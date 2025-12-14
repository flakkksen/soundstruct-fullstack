const http = require('http');
const fs = require('fs');
const { URL } = require('url');

/*
 * Simple JSON‑file backed REST API.
 *
 * This server exposes CRUD endpoints for several resources used by the
 * Soundstruct web app (products, services, studioItems, projects and
 * inquiries). Data is persisted to a JSON file on disk. This solution
 * avoids external dependencies (like Express) because internet access is
 * restricted in the running environment.  Endpoints follow a minimal
 * convention:
 *
 *   GET    /api/<resource>           – returns an array of items
 *   POST   /api/<resource>           – creates a new item from JSON body
 *   PUT    /api/<resource>/<id>      – updates an existing item by id
 *   DELETE /api/<resource>/<id>      – removes an item by id
 *
 * Resource names map to keys in the database file.  Supported resources are
 * products, services, studioItems, projects and inquiries.
 */

const DATA_FILE = __dirname + '/database.json';

// Helper to read the database file.  Returns a JS object.
function readData() {
  try {
    const text = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(text);
  } catch (err) {
    // If the file doesn't exist or is invalid, start with empty collections.
    return { products: [], services: [], studioItems: [], projects: [], inquiries: [] };
  }
}

// Helper to write the database file.
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Generate a new ID for a given resource.  If the resource is inquiries,
// generate an id with the appropriate prefix (REQ- or SVC-).  Otherwise
// return a numeric timestamp.
function generateId(resource, body, data) {
  if (resource === 'inquiries') {
    // Determine if this is a service request based on the type
    const isService = body && body.type && body.type.toLowerCase().includes('service');
    const prefix = isService ? 'SVC-' : 'REQ-';
    // Count existing inquiries of the same prefix and pad with zeros
    const samePrefixCount = data.inquiries.filter(i => i.id.startsWith(prefix)).length;
    const newNum = (samePrefixCount + 1).toString().padStart(3, '0');
    return `${prefix}${newNum}`;
  }
  // For other resources, use current timestamp as id
  return Date.now();
}

// List of valid collections
const VALID_RESOURCES = ['products', 'services', 'studioItems', 'projects', 'inquiries'];

const server = http.createServer((req, res) => {
  // Enable CORS so that the frontend can communicate with this API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = url.pathname.split('/').filter(Boolean);
  // Expect paths like /api/resource or /api/resource/id
  if (pathParts[0] !== 'api') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }
  const resource = pathParts[1];
  if (!VALID_RESOURCES.includes(resource)) {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Unknown resource' }));
    return;
  }

  // Read current data on each request to keep it up to date
  const db = readData();

  // GET /api/resource
  if (req.method === 'GET' && pathParts.length === 2) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(db[resource] || []));
    return;
  }

  // POST /api/resource
  if (req.method === 'POST' && pathParts.length === 2) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const item = JSON.parse(body || '{}');
        // Generate id if not provided
        if (!item.id) {
          item.id = generateId(resource, item, db);
        }
        // Push item into the collection
        db[resource] = db[resource] || [];
        db[resource].unshift(item);
        writeData(db);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(item));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // PUT /api/resource/id
  if ((req.method === 'PUT' || req.method === 'PATCH') && pathParts.length === 3) {
    const id = pathParts[2];
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const update = JSON.parse(body || '{}');
        const items = db[resource] || [];
        const index = items.findIndex(i => String(i.id) === id);
        if (index === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Not found' }));
          return;
        }
        // Merge existing item with update
        db[resource][index] = { ...items[index], ...update };
        writeData(db);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db[resource][index]));
      } catch (err) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }

  // DELETE /api/resource/id
  if (req.method === 'DELETE' && pathParts.length === 3) {
    const id = pathParts[2];
    const items = db[resource] || [];
    const index = items.findIndex(i => String(i.id) === id);
    if (index === -1) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Not found' }));
      return;
    }
    // Remove item
    items.splice(index, 1);
    db[resource] = items;
    writeData(db);
    res.statusCode = 204;
    res.end();
    return;
  }

  // If no route matches
  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'Method not allowed' }));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

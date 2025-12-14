import React, { useState, useEffect } from 'react';
import { Settings, Wrench, Plus, Edit2, Trash2, ChevronRight, Speaker, Disc, Activity, Square, X, Save, Search, Globe, Cpu, ShoppingCart, Calendar, User, MapPin, FileText, Send, Mic2, Printer, FileCheck, CreditCard, LayoutDashboard, LogOut, Package, List, ArrowLeft, Download, Layers, Home, Image as ImageIcon, Clock, Truck, Shield, Scale, ClipboardList, Sparkles, ImagePlus, Upload, CloudUpload } from 'lucide-react';

// --- SEO & AI HELPER COMPONENTS ---
const StructuredData = ({ type, data }) => {
  let schema = {};
  if (type === 'Organization') {
    schema = {
      "@context": "https://schema.org", "@type": "LocalBusiness", "name": "Soundstruct",
      "description": "Audio Verleih Leipzig", "telephone": "+49 123 456789"
    };
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

const SoundstructApp = () => {
  // --- VIEW STATE ---
  const [currentView, setCurrentView] = useState('public'); 
  const [publicTab, setPublicTab] = useState('home'); 
  const [adminTab, setAdminTab] = useState('inquiries'); 

  // --- ADMIN LOGIN STATE ---
  // Track whether the admin login modal is visible and the input values for admin username and password.
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');

  // Pre‑computed SHA‑256 hashes for the admin credentials.  To change the credentials, compute new hashes
  // for the username and password and replace these values.  The plaintext credentials are never stored
  // directly in the client code.
  const ADMIN_USERNAME_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
  const ADMIN_PASSWORD_HASH = 'da6f5e0ce6a780ffbbbb08389d39e8f36dc695e1de8a0483843de6b893aa17e2';

  // Helper to compute SHA‑256 hash of a string.  Uses Web Crypto API available in modern browsers.
  const hashString = async (str) => {
    const msgUint8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // --- DATA STATE (Local Simulation) ---
  const [products, setProducts] = useState([
    { 
      id: 1, name: "Pioneer CDJ-3000", cat: "Player", price: "75,00 €", status: "Available", quantity: 4, condition: "Neu (A-Ware)",
      specs: ["MPU Prozessor", "9-Zoll Touch", "Gigabit Link"],
      description: "Das Flaggschiff für professionelle DJs. Mieten Sie den CDJ-3000 in Leipzig für maximale Performance und Stabilität.",
      image: "https://images.unsplash.com/photo-1571175620922-263a4336c2d8?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 2, name: "Technics SL-1210 MK2", cat: "Turntable", price: "45,00 €", status: "Rented", quantity: 2, condition: "Gebraucht (Gut)",
      specs: ["Direct Drive", "Quartz Lock", "Heavy Mass"],
      description: "Der legendäre Vinyl-Plattenspieler. Frisch gewartet und kalibriert für analoge Perfektion.",
      image: "" 
    },
    { 
      id: 3, name: "Allen & Heath Xone:96", cat: "Mixer", price: "60,00 €", status: "Available", quantity: 1, condition: "Neu",
      specs: ["Analog", "Dual USB", "4-Band EQ"],
      description: "Analoge Wärme trifft digitale Konnektivität. Der Standard-Mixer für Techno und House Events.",
      image: "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 4, name: "L-Acoustics A15", cat: "PA", price: "120,00 €", status: "Available", quantity: 6, condition: "Gebraucht (Service ok)",
      specs: ["Wide/Focus", "144 dB", "Passive 2-Way"],
      description: "Kompaktes Line-Source Element für skalierbare Beschallungslösungen mit maximalem Output.",
      image: "" 
    },
  ]);

  const [services, setServices] = useState([
    { id: 1, title: "Fader Service", desc: "Reinigung und Austausch von Kanal- und Crossfadern.", price: "ab 49 €", image: "" },
    { id: 2, title: "Laser Kalibrierung", desc: "Justierung der Lasereinheit.", price: "39 €", image: "" },
  ]);

  const [studioItems, setStudioItems] = useState([
    { id: 1, title: "Vocal Booth", desc: "Schallisolierte Kabine für Sprachaufnahmen.", price: "40€ / h" },
    { id: 2, title: "Mixing Desk", desc: "SSL Nucleus Controller & Neumann Monitoring.", price: "50€ / h" }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, title: "Tanzhaus West", desc: "Komplettes Festival Setup & Betreuung.", price: "Mai 2024" },
    { id: 2, title: "Boiler Room Leipzig", desc: "Monitoring & DJ Booth Support.", price: "Juni 2024" }
  ]);

  const [inquiries, setInquiries] = useState([
    { 
      id: 'REQ-001', date: '2024-05-10', status: 'Pending', type: 'Rental',
      client: { name: 'Alex Meyer', company: 'Tanzhaus West', email: 'alex@club.de', phone: '0176-123456', street: 'Industriestr. 5', city: '04229 Leipzig' },
      event: { date: '2024-06-01', location: 'Leipzig, Westwerk', type: 'Club Night' },
      items: [{ name: 'Pioneer CDJ-3000', price: '75,00 €', count: 2 }, { name: 'Xone:96', price: '60,00 €', count: 1 }],
      total: '210,00 €'
    },
    { 
      id: 'SVC-002', date: '2024-05-12', status: 'In Diagnose', type: 'Service',
      client: { name: 'Sarah Kraft', company: 'Privat', email: 'sarah@mail.de', phone: '0151-998877', street: 'Karl-Liebknecht-Str. 10', city: '04107 Leipzig' },
      event: { date: 'Asap', location: 'Werkstatt', type: 'Repair' },
      items: [{ name: 'Technics SL-1210 (Fader Service)', price: 'Estimate', count: 1 }],
      total: 'Kostenvoranschlag'
    }
  ]);

  // --- CART & FORM STATE ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', company: '', email: '', phone: '', street: '', city: '', dateStart: '', location: '', eventType: 'Club', message: '' });

  // --- SETTINGS STATE ---
  const [invoiceSettings, setInvoiceSettings] = useState({
    companyName: 'Soundstruct Audio Engineering', owner: 'Dein Name', street: 'Musterstraße 12', city: '04109 Leipzig',
    taxId: 'DE123456789', iban: 'DE50 1234 5678 9000 00', bank: 'Sparkasse Leipzig', 
    email: 'info@soundstruct.de', phone: '+49 123 456 789'
  });

  // --- MODAL STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [viewInvoice, setViewInvoice] = useState(null);
  const [viewReport, setViewReport] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false); 

  const hasServiceItems = cart.some(i => i.cat === 'Service');

  // --- HANDLERS ---

  const addToCart = (item, type = 'Rental') => {
    const cartItem = {
        name: item.name || item.title,
        price: item.price,
        cat: type === 'Service' ? 'Service' : (item.cat || 'Rental')
    };
    setCart([...cart, cartItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const submitInquiry = () => {
    if (cart.length === 0) return;
    
    let totalVal = 0;
    let isServiceRequest = hasServiceItems;

    if (!isServiceRequest) {
        cart.forEach(item => {
            let priceStr = item.price.toString();
            let price = parseFloat(priceStr.replace(/[^0-9,.]/g, '').replace(',', '.'));
            if (!isNaN(price)) totalVal += price;
        });
    }

    const prefix = isServiceRequest ? 'SVC-' : 'REQ-';
    const newInquiry = {
      id: `${prefix}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New',
      type: isServiceRequest ? 'Service' : 'Rental',
      client: { ...checkoutForm },
      event: { 
          date: checkoutForm.dateStart || 'Asap', 
          location: checkoutForm.location || 'Werkstatt', 
          type: isServiceRequest ? 'Repair / Service' : checkoutForm.eventType 
      },
      items: cart.map(i => ({name: i.name, price: i.price, count: 1})), 
      total: isServiceRequest ? 'Kostenvoranschlag angefordert' : (totalVal > 0 ? totalVal.toFixed(2).replace('.', ',') + ' €' : 'On Request')
    };

    setInquiries([newInquiry, ...inquiries]);
    setCart([]);
    setIsCartOpen(false);
    setCheckoutForm({ name: '', company: '', email: '', phone: '', street: '', city: '', dateStart: '', location: '', eventType: 'Club', message: '' });
    
    alert(isServiceRequest 
        ? "SERVICE ANFRAGE GESENDET. Bitte Gerät einsenden/vorbeibringen für Kostenvoranschlag." 
        : "MIETANFRAGE GESENDET. Wir prüfen die Verfügbarkeit.");
  };

  const handleDelete = (id, type) => {
    if (confirm('Permanently delete item?')) {
      if (type === 'product') setProducts(products.filter(p => p.id !== id));
      else if (type === 'service') setServices(services.filter(s => s.id !== id));
      else if (type === 'studio') setStudioItems(studioItems.filter(s => s.id !== id));
      else if (type === 'project') setProjects(projects.filter(p => p.id !== id));
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
        setFormData(type === 'product' 
            ? { ...item, specs: item.specs ? item.specs.join(', ') : '' } 
            : { ...item }
        );
    } else {
        setFormData(type === 'product' 
            ? { name: '', cat: 'Player', price: '', status: 'Available', specs: '', quantity: 1, condition: 'Neu', image: '', description: '' } 
            : { title: '', desc: '', price: '', image: '' }
        );
    }
    setIsModalOpen(true);
  };

  const handleAiAutoFill = () => {
      if (!formData.name && !formData.title) {
          alert("Please enter a Name/Title first for the AI to analyze.");
          return;
      }
      setIsAiLoading(true);
      setTimeout(() => {
          const name = (formData.name || formData.title).toLowerCase();
          let aiData = {};
          if (name.includes("cdj") || name.includes("pioneer")) {
              aiData = { cat: "Player", specs: "Pro DJ Link, High-Res Audio, 9-Zoll Touchscreen, Gigabit Ethernet", description: `Mieten Sie den Industriestandard ${formData.name || formData.title} in Leipzig. Maximale Ausfallsicherheit für Ihren Club oder Ihr Festival. Inklusive Case und Verkabelung.`, condition: "Neu (A-Ware)" };
          } else if (name.includes("mixer") || name.includes("xone") || name.includes("djm")) {
              aiData = { cat: "Mixer", specs: "Analog Summing, VCF Filter, Dual Soundcard, 4-Band EQ", description: `Professioneller DJ-Mixer ${formData.name || formData.title} mit exzellenter Klangqualität. Perfekt für Techno und House Events. Verfügbar ab Lager Leipzig.`, condition: "Gebraucht (Gut)" };
          } else if (name.includes("pa") || name.includes("speaker") || name.includes("acoustics")) {
              aiData = { cat: "PA", specs: "High-SPL, Cardioid Sub Option, Touring Grade, Wetterfest", description: `Leistungsstarkes Beschallungssystem ${formData.name || formData.title} für klare Sprachverständlichkeit und druckvollen Bass. Skalierbar für Events jeder Größe.`, condition: "Gebraucht (Service ok)" };
          } else {
              aiData = { cat: "Equipment", specs: "Professionelle Audio-Qualität, Road-tauglich, Inkl. Case", description: `Hochwertiges ${formData.name || formData.title} für Ihre Veranstaltung. Technisch geprüft und sofort einsatzbereit. Jetzt in Leipzig anfragen.`, condition: "Neu" };
          }
          setFormData(prev => ({ ...prev, ...aiData, specs: prev.specs || aiData.specs }));
          setIsAiLoading(false);
      }, 1200);
  };

  const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData({ ...formData, image: reader.result });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = () => {
    const newItem = { id: editingItem ? editingItem.id : Date.now(), ...formData };
    if (modalType === 'product') {
        const specsArray = formData.specs ? formData.specs.split(',').map(s => s.trim()).filter(s => s !== '') : [];
        const prodItem = { ...newItem, specs: specsArray };
        if (editingItem) setProducts(products.map(p => p.id === editingItem.id ? prodItem : p));
        else setProducts([...products, prodItem]);
    } else if (modalType === 'service') {
        if (editingItem) setServices(services.map(s => s.id === editingItem.id ? newItem : s));
        else setServices([...services, newItem]);
    } else if (modalType === 'studio') {
        if (editingItem) setStudioItems(studioItems.map(s => s.id === editingItem.id ? newItem : s));
        else setStudioItems([...studioItems, newItem]);
    } else if (modalType === 'project') {
        if (editingItem) setProjects(projects.map(p => p.id === editingItem.id ? newItem : p));
        else setProjects([...projects, newItem]);
    }
    setIsModalOpen(false);
  };

  const printInvoice = () => window.print();
  
  // --- ADMIN LOGIN HANDLER ---
  // Verify entered admin credentials by hashing the provided username and password and comparing
  // them to the stored hash values.  Uses constant‑time comparison via strict equality on hashes.
  const handleAdminLogin = async () => {
    try {
      const userHash = await hashString(adminUsernameInput);
      const passHash = await hashString(adminPasswordInput);
      if (passHash === ADMIN_PASSWORD_HASH) {
        setShowLoginModal(false);
        setCurrentView('admin');
        setAdminUsernameInput('');
        setAdminPasswordInput('');
      } else {
        alert('Incorrect username or password');
      }
    } catch (err) {
      console.error(err);
      alert('Error verifying credentials');
    }
  };

  const colors = { bg: "bg-[#0A0A0A]", border: "border-[#2A2A2A]", accent: "text-[#FF3B30]", accentBg: "bg-[#FF3B30]" };

  return (
    <div className={`min-h-screen ${colors.bg} font-['Chakra_Petch'] selection:bg-red-500/30 selection:text-red-200 text-gray-200 overflow-x-hidden`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;500;600;700&display=swap'); 
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        /* Custom Scrollbar for Modal content */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF3B30; }
        
        @media print {
            body * { visibility: hidden; }
            #invoice-area, #invoice-area * { visibility: visible; }
            #invoice-area { position: absolute; left: 0; top: 0; width: 100%; height: auto; margin: 0; padding: 0; transform: none; box-shadow: none; }
            .no-print { display: none !important; }
        }
      `}</style>
      
      <StructuredData type="Organization" />
      <StructuredData type="ProductList" data={products} />

      {/* =====================================================================================
          VIEW: ADMIN DASHBOARD
         ===================================================================================== */}
      {currentView === 'admin' && (
        <div className="flex h-screen bg-[#050505] overflow-hidden font-sans">
            <aside className="w-64 border-r border-[#222] flex flex-col bg-[#080808]">
                <div className="h-16 flex items-center px-6 border-b border-[#222]">
                    <Activity className="text-[#FF3B30] w-6 h-6 mr-3" />
                    <span className="font-bold text-white tracking-widest uppercase font-mono">Admin<span className="text-[#FF3B30]">.sys</span></span>
                </div>
                
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                    <button onClick={() => setAdminTab('inquiries')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'inquiries' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <FileCheck size={18}/> Inquiries <span className="ml-auto bg-black/20 px-2 py-0.5 text-[10px] rounded">{inquiries.filter(i => i.status === 'New').length}</span>
                    </button>
                    <button onClick={() => setAdminTab('timeline')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'timeline' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Clock size={18}/> Timeline
                    </button>
                    <button onClick={() => setAdminTab('inventory')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'inventory' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Package size={18}/> Inventory
                    </button>
                    <button onClick={() => setAdminTab('services')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'services' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Wrench size={18}/> Services
                    </button>
                    <button onClick={() => setAdminTab('studio')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'studio' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Mic2 size={18}/> Studio
                    </button>
                    <button onClick={() => setAdminTab('projects')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'projects' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Layers size={18}/> Projects
                    </button>
                    <button onClick={() => setAdminTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${adminTab === 'settings' ? 'bg-[#FF3B30] text-black' : 'text-gray-500 hover:text-white hover:bg-[#111]'}`}>
                        <Settings size={18}/> Config
                    </button>
                </nav>

                <div className="p-4 border-t border-[#222]">
                    <button onClick={() => setCurrentView('public')} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase text-gray-500 hover:text-[#FF3B30] border border-[#222] hover:border-[#FF3B30] transition-colors">
                        <LogOut size={16}/> Logout / Site
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-[#0A0A0A] p-8">
                <div className="animate-in fade-in">
                    <div className="flex justify-between items-center mb-8 border-b border-[#222] pb-4">
                        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">{adminTab} Management</h2>
                        {adminTab === 'inventory' && (
                            <div className="flex gap-2">
                                <button onClick={() => setViewReport(true)} className="bg-gray-800 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-700 flex items-center gap-2">
                                    <ClipboardList size={16}/> Inventur-Bericht
                                </button>
                                <button onClick={() => openModal('product')} className="bg-[#FF3B30] text-black px-4 py-2 text-xs font-bold uppercase hover:bg-white flex items-center gap-2">
                                    <Plus size={16}/> Add New
                                </button>
                            </div>
                        )}
                        {adminTab !== 'inquiries' && adminTab !== 'timeline' && adminTab !== 'settings' && adminTab !== 'inventory' && (
                             <button onClick={() => openModal(adminTab === 'projects' ? 'project' : adminTab)} className="bg-[#FF3B30] text-black px-4 py-2 text-xs font-bold uppercase hover:bg-white flex items-center gap-2">
                                <Plus size={16}/> Add New
                             </button>
                        )}
                    </div>

                    {/* TIMELINE VIEW */}
                    {adminTab === 'timeline' && (
                        <div className="space-y-6">
                            <div className="bg-[#111] p-4 text-xs font-mono text-gray-500 uppercase tracking-widest border border-[#222]">
                                Visualisierung: Aktive & Geplante Einsätze
                            </div>
                            <div className="relative border-l border-[#333] ml-4 space-y-8 py-4">
                                {inquiries
                                    .filter(req => req.type === 'Rental') 
                                    .sort((a, b) => new Date(a.event.date === 'Asap' ? 0 : a.event.date) - new Date(b.event.date === 'Asap' ? 0 : b.event.date))
                                    .map((req) => (
                                    <div key={req.id} className="relative pl-8">
                                        <div className="absolute -left-1.5 top-1 w-3 h-3 bg-[#FF3B30] rounded-full"></div>
                                        <div className="bg-[#0F0F0F] border border-[#222] p-4 hover:border-[#FF3B30] transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[#FF3B30] font-bold font-mono">{req.event.date}</span>
                                                <span className="text-xs text-gray-500 bg-[#1a1a1a] px-2 py-1 rounded">{req.status}</span>
                                            </div>
                                            <h3 className="text-white font-bold uppercase mb-1">{req.event.location}</h3>
                                            <p className="text-xs text-gray-400 mb-3">{req.client.company || req.client.name}</p>
                                            
                                            <div className="border-t border-[#222] pt-2">
                                                <p className="text-[10px] text-gray-600 uppercase mb-1">Equipment Out:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {req.items.map((item, idx) => (
                                                        <span key={idx} className="text-xs font-mono text-white bg-[#222] px-2 py-0.5 border border-[#333]">
                                                            {item.count}x {item.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {inquiries.filter(req => req.type === 'Rental').length === 0 && (
                                    <div className="pl-8 text-gray-600 font-mono text-sm">Keine aktiven Miet-Jobs im System.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* INQUIRIES */}
                    {adminTab === 'inquiries' && (
                        <div className="space-y-4">
                            {inquiries.map((req) => (
                                <div key={req.id} className="bg-[#0F0F0F] border border-[#222] hover:border-[#FF3B30] p-4 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-[#FF3B30] font-bold">{req.id}</span>
                                            <span className="text-xs text-gray-500">{req.date}</span>
                                            {req.type === 'Service' 
                                                ? <span className="px-2 py-0.5 text-[10px] font-bold uppercase border border-blue-500 text-blue-500 flex items-center gap-1"><Wrench size={10}/> Service Case</span>
                                                : <span className="px-2 py-0.5 text-[10px] font-bold uppercase border border-green-500 text-green-500 flex items-center gap-1"><Package size={10}/> Rental Job</span>
                                            }
                                            <span className="text-xs text-white bg-[#222] px-2 py-0.5">{req.status}</span>
                                        </div>
                                        <button onClick={() => setViewInvoice(req)} className="text-[10px] uppercase font-bold bg-[#FF3B30] text-black px-3 py-1 hover:bg-white flex items-center gap-2"><Printer size={12}/> Invoice / KV</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 text-sm text-gray-400 font-mono">
                                        <div><div className="text-xs uppercase text-gray-600 mb-1">Client</div><span className="text-white font-bold">{req.client.company}</span><br/>{req.client.name}</div>
                                        <div>
                                            <div className="text-xs uppercase text-gray-600 mb-1">Event / Info</div>
                                            {req.event.type} • {req.event.location}
                                            {req.type === 'Service' && <div className="text-[#FF3B30] text-xs mt-1">! Wartet auf Einsendung !</div>}
                                        </div>
                                        <div><div className="text-xs uppercase text-gray-600 mb-1">Total</div><span className="text-[#FF3B30] text-lg font-bold">{req.total}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* SETTINGS */}
                    {adminTab === 'settings' && (
                        <div className="max-w-xl animate-in fade-in">
                            <div className="bg-[#0F0F0F] border border-[#222] p-6">
                                <h3 className="text-white font-bold uppercase mb-6 flex items-center gap-2 border-b border-[#222] pb-2"><Settings size={18}/> Global System Config</h3>
                                <div className="space-y-4 font-mono">
                                    <div><label className="text-xs text-gray-500 uppercase block mb-1">Company Name</label><input type="text" value={invoiceSettings.companyName} onChange={e=>setInvoiceSettings({...invoiceSettings, companyName:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    <div><label className="text-xs text-gray-500 uppercase block mb-1">Owner / CEO</label><input type="text" value={invoiceSettings.owner} onChange={e=>setInvoiceSettings({...invoiceSettings, owner:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-gray-500 uppercase block mb-1">Street</label><input type="text" value={invoiceSettings.street} onChange={e=>setInvoiceSettings({...invoiceSettings, street:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                        <div><label className="text-xs text-gray-500 uppercase block mb-1">City</label><input type="text" value={invoiceSettings.city} onChange={e=>setInvoiceSettings({...invoiceSettings, city:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-xs text-gray-500 uppercase block mb-1">Email</label><input type="text" value={invoiceSettings.email} onChange={e=>setInvoiceSettings({...invoiceSettings, email:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                        <div><label className="text-xs text-gray-500 uppercase block mb-1">Phone</label><input type="text" value={invoiceSettings.phone} onChange={e=>setInvoiceSettings({...invoiceSettings, phone:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    </div>
                                    <h4 className="text-xs text-[#FF3B30] uppercase mt-6 mb-2">Financial Data</h4>
                                    <div><label className="text-xs text-gray-500 uppercase block mb-1">Tax ID / Steuernummer</label><input type="text" value={invoiceSettings.taxId} onChange={e=>setInvoiceSettings({...invoiceSettings, taxId:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    <div><label className="text-xs text-gray-500 uppercase block mb-1">IBAN</label><input type="text" value={invoiceSettings.iban} onChange={e=>setInvoiceSettings({...invoiceSettings, iban:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    <div><label className="text-xs text-gray-500 uppercase block mb-1">Bank Name</label><input type="text" value={invoiceSettings.bank} onChange={e=>setInvoiceSettings({...invoiceSettings, bank:e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-white outline-none focus:border-[#FF3B30] transition-colors"/></div>
                                    
                                    <button onClick={() => alert('System Configuration Updated')} className="bg-[#FF3B30] text-black font-bold uppercase px-6 py-3 hover:bg-white transition-colors mt-6 w-full flex items-center justify-center gap-2"><Save size={16}/> Save Configuration</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY */}
                    {adminTab === 'inventory' && (
                        <div className="grid grid-cols-1 gap-2">
                            {products.map(p => (
                                <div key={p.id} className="flex justify-between items-center bg-[#111] p-3 border-l-2 border-transparent hover:border-[#FF3B30]">
                                    <div className="flex items-center gap-4">
                                        {/* Image Thumbnail */}
                                        <div className="w-10 h-10 bg-[#222] flex items-center justify-center overflow-hidden">
                                            {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover"/> : <ImageIcon size={16} className="text-gray-600"/>}
                                        </div>
                                        <div>
                                            <span className="text-xs font-mono text-gray-600 block">{p.id.toString().substring(0, 6)}</span>
                                            <span className="text-white font-bold uppercase w-48 truncate block">{p.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-xs text-gray-400 font-mono text-right">
                                            <span className="block text-white font-bold">{p.quantity} Stk.</span>
                                            <span className="text-[10px]">{p.condition}</span>
                                        </div>
                                        <span className="text-[#FF3B30] font-mono">{p.price}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => openModal('product', p)} className="text-gray-500 hover:text-white"><Edit2 size={14}/></button>
                                            <button onClick={() => handleDelete(p.id, 'product')} className="text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* GENERIC LISTS */}
                    {(adminTab === 'services' || adminTab === 'studio' || adminTab === 'projects') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(adminTab === 'services' ? services : adminTab === 'studio' ? studioItems : projects).map(s => (
                                <div key={s.id} className="bg-[#0F0F0F] border border-[#222] p-6 relative group hover:border-gray-600">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-bold uppercase tracking-wide">{s.title}</h3>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button onClick={() => openModal(adminTab === 'inventory' ? 'product' : adminTab === 'projects' ? 'project' : adminTab, s)} className="text-gray-500 hover:text-white"><Edit2 size={14}/></button>
                                             <button onClick={() => handleDelete(s.id, adminTab === 'inventory' ? 'product' : adminTab === 'projects' ? 'project' : adminTab)} className="text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 font-mono mb-4">{s.desc}</p>
                                    <div className="text-[#FF3B30] font-bold text-sm border border-[#333] inline-block px-2 py-1">{s.price}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
      )}

      {/* =====================================================================================
          VIEW: PUBLIC WEBSITE
         ===================================================================================== */}
      {currentView === 'public' && (
        <>
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-[#FF3B30]/10 to-transparent pointer-events-none z-0"></div>

            <header className={`border-b ${colors.border} sticky top-0 z-40 backdrop-blur-md bg-[#0A0A0A]/95`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer z-10 group shrink-0" onClick={() => setPublicTab('home')}>
                        <Activity className="text-[#FF3B30] w-6 h-6" />
                        <h1 className="text-white text-2xl font-bold tracking-tighter uppercase leading-none hidden sm:block">Sound<span className="text-[#FF3B30]">struct</span></h1>
                    </div>
                    <nav className="flex gap-6 overflow-x-auto no-scrollbar items-center px-4 z-10 w-full md:w-auto mx-4 md:mx-0">
                        {['Home', 'Rental', 'Services', 'Studio', 'Projects'].map((item) => (
                        <button key={item} onClick={() => setPublicTab(item.toLowerCase())} className={`text-sm uppercase tracking-widest font-semibold hover:text-[#FF3B30] transition-colors whitespace-nowrap ${publicTab === item.toLowerCase() ? 'text-[#FF3B30]' : 'text-gray-400'}`}>
                            {item}
                        </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-6 z-10 shrink-0">
                        <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer group">
                            <ShoppingCart className={`w-5 h-5 ${cart.length > 0 ? 'text-[#FF3B30]' : 'text-gray-500'} group-hover:text-white transition-colors`}/>
                            {cart.length > 0 && <div className="absolute -top-2 -right-2 bg-[#FF3B30] text-black text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-sm">{cart.length}</div>}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 relative z-10 min-h-screen">
                
                {/* --- HOME LANDING PAGE --- */}
                {publicTab === 'home' && (
                    <div className="flex flex-col items-start justify-center min-h-[60vh] animate-in fade-in slide-in-from-bottom-8">
                        <div className="inline-block px-3 py-1 border border-[#FF3B30]/40 bg-[#FF3B30]/5 mb-8">
                            <span className="text-[#FF3B30] text-[10px] tracking-[0.15em] uppercase font-bold">BASED IN LEIPZIG • AUDIO ENGINEERING</span>
                        </div>
                        <h1 className="text-6xl md:text-9xl font-bold text-white mb-8 tracking-tighter leading-[0.9]">
                            YOUR VISION.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-700">OUR SOUND.</span>
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-lg font-light leading-relaxed font-sans border-l-2 border-[#FF3B30] pl-6">
                            Professionelle Audiotechnik, präzise Planung und kompromissloser Service für Events, die im Gedächtnis bleiben.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => setPublicTab('rental')} className="px-8 py-4 bg-[#FF3B30] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center gap-3">
                                Enter Rental Shop <ChevronRight size={16}/>
                            </button>
                            <button onClick={() => setPublicTab('services')} className="px-8 py-4 border border-gray-700 text-gray-300 font-bold uppercase tracking-widest text-sm hover:border-white hover:text-white transition-colors">
                                Explore Services
                            </button>
                        </div>
                    </div>
                )}

                {/* --- RENTAL VIEW --- */}
                {publicTab === 'rental' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in">
                        {products.map((product) => (
                        <div key={product.id} className="group relative bg-[#0F0F0F] border border-[#1A1A1A] hover:border-[#FF3B30]/50 transition-all flex flex-col">
                            {/* Image Area */}
                            <div className="h-48 bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden group-hover:bg-[#0F0F0F] transition-colors border-b border-[#1A1A1A]">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500"/>
                                ) : (
                                    <>
                                        {product.cat === 'Player' ? <Disc strokeWidth={1} size={40} className="text-[#333] group-hover:text-[#FF3B30] transition-colors"/> : 
                                        product.cat === 'Mixer' ? <Settings strokeWidth={1} size={40} className="text-[#333] group-hover:text-[#FF3B30] transition-colors"/> :
                                        <Speaker strokeWidth={1} size={40} className="text-[#333] group-hover:text-[#FF3B30] transition-colors"/>}
                                    </>
                                )}
                                {/* Status Badge */}
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className={`w-2 h-2 ${product.status === 'Available' ? 'bg-[#FF3B30]' : 'bg-gray-700'}`}></div>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1 flex flex-col border-t border-[#1A1A1A]">
                                <h3 className="text-sm font-bold text-gray-200 uppercase mb-1">{product.name}</h3>
                                <p className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider">{product.cat}</p>
                                
                                {/* Description / Specs */}
                                <p className="text-xs text-gray-400 font-sans leading-snug mb-4 line-clamp-2">
                                    {product.description || (Array.isArray(product.specs) ? product.specs.join(', ') : product.specs)}
                                </p>

                                <div className="flex justify-between items-center pt-2 border-t border-[#1A1A1A] mt-auto">
                                    <span className="text-[#FF3B30] font-bold text-sm">{product.price}</span>
                                    <button onClick={() => addToCart(product, 'Rental')} className="bg-[#222] hover:bg-[#FF3B30] text-white hover:text-black p-1.5 transition-colors"><Plus size={16}/></button>
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                {/* --- GENERIC LIST VIEWS (Services, Studio, Projects) --- */}
                {(publicTab === 'services' || publicTab === 'studio' || publicTab === 'projects') && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
                        {(publicTab === 'services' ? services : publicTab === 'studio' ? studioItems : projects).map((item) => (
                        <div key={item.id} className="bg-[#0F0F0F] border border-[#1A1A1A] p-6 hover:border-gray-700 transition-colors relative group flex flex-col h-full">
                            {publicTab === 'studio' ? <Mic2 className="text-[#FF3B30] mb-6 opacity-30 group-hover:opacity-100 transition-opacity" size={20}/> : 
                             publicTab === 'projects' ? <Layers className="text-[#FF3B30] mb-6 opacity-30 group-hover:opacity-100 transition-opacity" size={20}/> :
                             <Wrench className="text-[#FF3B30] mb-6 opacity-30 group-hover:opacity-100 transition-opacity" size={20}/>}
                            
                            <h3 className="text-lg font-bold text-white uppercase mb-2 tracking-wide">{item.title}</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed font-sans font-light flex-1">{item.desc}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-[#FF3B30] border border-[#222] inline-block px-4 py-2 bg-[#0A0A0A] font-bold tracking-wider">{item.price}</div>
                                {publicTab !== 'projects' && <button onClick={() => addToCart(item, publicTab === 'services' ? 'Service' : 'Rental')} className="text-gray-500 hover:text-[#FF3B30]"><Plus size={20}/></button>}
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                {/* --- LEGAL PAGES (IMPRESSUM / AGB) --- */}
                {publicTab === 'impressum' && (
                    <div className="max-w-3xl mx-auto py-12 animate-in fade-in text-gray-300">
                        <h1 className="text-3xl font-bold text-white uppercase mb-8 border-b border-[#222] pb-4">Impressum</h1>
                        <div className="space-y-6 font-mono text-sm">
                            <div>
                                <h3 className="text-white font-bold uppercase mb-2">Angaben gemäß § 5 TMG</h3>
                                <p>{invoiceSettings.companyName}</p>
                                <p>{invoiceSettings.street}</p>
                                <p>{invoiceSettings.city}</p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold uppercase mb-2">Kontakt</h3>
                                <p>Telefon: {invoiceSettings.phone}</p>
                                <p>E-Mail: {invoiceSettings.email}</p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold uppercase mb-2">Vertreten durch</h3>
                                <p>{invoiceSettings.owner}</p>
                            </div>
                            <div>
                                <h3 className="text-white font-bold uppercase mb-2">Umsatzsteuer-ID</h3>
                                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz: <br/>{invoiceSettings.taxId}</p>
                            </div>
                            <p className="text-xs text-gray-600 mt-8">Haftungsausschluss: Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.</p>
                        </div>
                    </div>
                )}

                {publicTab === 'agb' && (
                    <div className="max-w-3xl mx-auto py-12 animate-in fade-in text-gray-300">
                        <h1 className="text-3xl font-bold text-white uppercase mb-8 border-b border-[#222] pb-4">AGB</h1>
                        <div className="space-y-6 font-mono text-sm">
                            <p className="text-[#FF3B30]">Allgemeine Geschäftsbedingungen</p>
                            <p><strong>§1 Geltungsbereich</strong><br/>Für die Geschäftsbeziehung zwischen {invoiceSettings.companyName} und dem Kunden gelten ausschließlich die nachfolgenden Allgemeinen Geschäftsbedingungen in ihrer zum Zeitpunkt der Bestellung gültigen Fassung.</p>
                            <p><strong>§2 Vertragsschluss</strong><br/>Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern einen unverbindlichen Online-Katalog dar. Durch Anklicken des Bestellbuttons geben Sie eine verbindliche Bestellung der im Warenkorb enthaltenen Waren ab.</p>
                            <p><strong>§3 Mietbedingungen</strong><br/>Das Mietequipment ist sorgfältig zu behandeln. Schäden, die während der Mietdauer entstehen, sind vom Mieter zu tragen.</p>
                            <p><strong>§4 Eigentumsvorbehalt</strong><br/>Die Ware bleibt bis zur vollständigen Bezahlung Eigentum von {invoiceSettings.companyName}.</p>
                        </div>
                    </div>
                )}

                {publicTab === 'datenschutz' && (
                    <div className="max-w-3xl mx-auto py-12 animate-in fade-in text-gray-300">
                        <h1 className="text-3xl font-bold text-white uppercase mb-8 border-b border-[#222] pb-4">Datenschutz</h1>
                        <div className="space-y-6 font-mono text-sm">
                            <p><strong>1. Datenschutz auf einen Blick</strong><br/>Allgemeine Hinweise: Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
                            <p><strong>2. Datenerfassung auf unserer Website</strong><br/>Wer ist verantwortlich für die Datenerfassung auf dieser Website?<br/>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber: {invoiceSettings.companyName}.</p>
                        </div>
                    </div>
                )}
            </main>

            <footer className="border-t border-[#1A1A1A] bg-[#050505] py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-600 font-mono uppercase">© 2024 {invoiceSettings.companyName}.</p>
                    
                    <div className="flex gap-6 text-[10px] uppercase font-bold text-gray-600">
                        <button onClick={() => setPublicTab('impressum')} className="hover:text-white transition-colors">Impressum</button>
                        <button onClick={() => setPublicTab('agb')} className="hover:text-white transition-colors">AGB</button>
                        <button onClick={() => setPublicTab('datenschutz')} className="hover:text-white transition-colors">Datenschutz</button>
                    </div>

                    {/* Clicking this button opens the admin login modal instead of switching views directly */}
                    <button
                        onClick={() => setShowLoginModal(true)}
                        className="text-[10px] uppercase font-bold text-gray-700 hover:text-[#FF3B30] border border-transparent hover:border-[#FF3B30] px-2 py-1 transition-colors"
                    >
                        System Access
                    </button>
                </div>
            </footer>

            {/* Cart Overlay */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCartOpen(false)}>
                    <div className="w-full max-w-md bg-[#0F0F0F] border-l border-[#FF3B30] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#FF3B30] text-black">
                            <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2"><Square size={14} fill="black"/> Gear List</h2>
                            <button onClick={() => setIsCartOpen(false)}><X size={20} className="hover:rotate-90 transition-transform"/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? <div className="text-center py-12 text-gray-600 font-mono uppercase">List Empty</div> : 
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start border border-[#333] p-3 bg-[#050505]">
                                        <div><div className="text-sm font-bold text-gray-200 uppercase">{item.name}</div><div className="text-[10px] text-[#FF3B30]">{item.price}</div></div>
                                        <button onClick={() => removeFromCart(idx)} className="text-gray-600 hover:text-[#FF3B30]"><Trash2 size={14}/></button>
                                    </div>
                                ))
                            }
                        </div>
                        {cart.length > 0 && (
                            <div className="p-6 bg-[#0a0a0a] border-t border-[#333] space-y-4 overflow-y-auto max-h-[50vh] custom-scrollbar">
                                {/* SERVICE ALERT */}
                                {hasServiceItems && (
                                    <div className="bg-blue-900/20 border border-blue-800 p-3 mb-4">
                                        <p className="text-[10px] text-blue-300 font-bold uppercase mb-1 flex items-center gap-2"><Wrench size={12}/> Service Anfrage</p>
                                        <p className="text-[10px] text-blue-200 leading-snug">
                                            Sie haben Service-Leistungen im Warenkorb. Bitte senden Sie uns eine Anfrage. Nach Erhalt des Geräts erstellen wir einen verbindlichen <strong>Kostenvoranschlag</strong>.
                                        </p>
                                    </div>
                                )}

                                <div className="text-xs font-bold text-[#FF3B30] uppercase tracking-widest mb-2 border-b border-[#222] pb-1">Request Data</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Name" value={checkoutForm.name} onChange={e => setCheckoutForm({...checkoutForm, name: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-white outline-none focus:border-[#FF3B30]"/>
                                    <input type="text" placeholder="Company" value={checkoutForm.company} onChange={e => setCheckoutForm({...checkoutForm, company: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-white outline-none focus:border-[#FF3B30]"/>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="text" placeholder="Email" value={checkoutForm.email} onChange={e => setCheckoutForm({...checkoutForm, email: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-white outline-none focus:border-[#FF3B30]"/>
                                    <input type="text" placeholder="Phone" value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-white outline-none focus:border-[#FF3B30]"/>
                                </div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4 border-b border-[#222] pb-1">Event / Service Info</div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="date" value={checkoutForm.dateStart} onChange={e => setCheckoutForm({...checkoutForm, dateStart: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-gray-400 outline-none focus:border-[#FF3B30]"/>
                                    <select value={checkoutForm.eventType} onChange={e => setCheckoutForm({...checkoutForm, eventType: e.target.value})} className="bg-[#111] border border-[#333] p-2 text-xs text-gray-400 outline-none focus:border-[#FF3B30]">
                                        <option>Club Event</option><option>Open Air</option><option>Private</option><option>Corporate</option>
                                    </select>
                                </div>
                                <input type="text" placeholder="Location" value={checkoutForm.location} onChange={e => setCheckoutForm({...checkoutForm, location: e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-xs text-white outline-none focus:border-[#FF3B30]"/>
                                <textarea placeholder="Notes..." value={checkoutForm.message} onChange={e => setCheckoutForm({...checkoutForm, message: e.target.value})} className="w-full bg-[#111] border border-[#333] p-2 text-xs text-white outline-none h-20"></textarea>
                                <button onClick={submitInquiry} className="w-full bg-[#FF3B30] hover:bg-white hover:text-black text-black font-bold uppercase py-3 tracking-widest text-xs transition-colors">
                                    {hasServiceItems ? <span className="flex items-center justify-center gap-2"><Wrench size={14}/> Kostenvoranschlag anfordern</span> : <span className="flex items-center justify-center gap-2"><Send size={14}/> Send Request</span>}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div className="bg-[#0F0F0F] border border-[#FF3B30] shadow-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold uppercase text-white mb-4 flex items-center gap-2">
              <Shield size={20} className="text-[#FF3B30]" /> Admin Login
            </h2>
            {/* Username Field */}
            <input
              type="text"
              value={adminUsernameInput}
              onChange={(e) => setAdminUsernameInput(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-2 mb-3 bg-[#050505] text-gray-200 border border-[#333] focus:outline-none focus:border-[#FF3B30]"
            />
            {/* Password Field */}
            <input
              type="password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 mb-4 bg-[#050505] text-gray-200 border border-[#333] focus:outline-none focus:border-[#FF3B30]"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowLoginModal(false)} className="px-4 py-2 text-xs font-bold uppercase border border-[#333] text-gray-500 hover:text-[#FF3B30] hover:border-[#FF3B30]">Cancel</button>
              <button onClick={handleAdminLogin} className="px-4 py-2 text-xs font-bold uppercase bg-[#FF3B30] text-black hover:bg-[#ff584e]">Login</button>
            </div>
          </div>
        </div>
      )}

      {/* --- SHARED MODALS (Improved with Fixed Header & Scroll) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
           <div className="bg-[#0F0F0F] border border-[#FF3B30] w-full max-w-lg flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(255,59,48,0.2)]" onClick={(e) => e.stopPropagation()}>
              
              {/* FIXED MODAL HEADER */}
              <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#0F0F0F] shrink-0">
                  <h3 className="text-[#FF3B30] font-bold uppercase tracking-widest">{editingItem ? 'Edit' : 'New'} Entry</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20}/></button>
              </div>

              {/* SCROLLABLE CONTENT */}
              <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
                {modalType === 'product' ? (
                    <>
                        <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Name / Product Title" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="flex-1 bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF3B30]"/>
                            {/* AI BUTTON */}
                            <button 
                                onClick={handleAiAutoFill}
                                disabled={isAiLoading}
                                className={`bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 text-xs font-bold uppercase hover:brightness-110 flex items-center gap-2 ${isAiLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isAiLoading ? <span className="animate-spin">...</span> : <Sparkles size={14}/>}
                                {isAiLoading ? 'Generating...' : 'AI Auto-Fill'}
                            </button>
                        </div>
                        
                        {/* --- IMAGE UPLOAD & PREVIEW --- */}
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase">Product Image</label>
                            <div className="flex gap-2 items-start">
                                {/* Upload Button */}
                                <label className="flex-1 cursor-pointer group">
                                    <div className="bg-[#050505] border border-[#333] border-dashed group-hover:border-[#FF3B30] p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                                        <CloudUpload size={24} className="text-gray-500 group-hover:text-[#FF3B30]"/>
                                        <span className="text-[10px] text-gray-500 uppercase">Click to Upload</span>
                                    </div>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                
                                {/* Preview Area */}
                                <div className="w-24 h-24 border border-[#333] bg-black flex items-center justify-center overflow-hidden relative">
                                    {formData.image ? (
                                        <>
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover"/>
                                            <button onClick={() => setFormData({...formData, image: ''})} className="absolute top-0 right-0 bg-red-600 text-white p-1 hover:bg-red-700"><X size={10}/></button>
                                        </>
                                    ) : (
                                        <ImagePlus size={20} className="text-gray-700"/>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <select value={formData.cat} onChange={e=>setFormData({...formData, cat:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none"><option>Player</option><option>Mixer</option><option>PA</option><option>Accessories</option></select>
                            <input type="text" placeholder="Price" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF3B30]"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase">Quantity</label>
                                <input type="number" value={formData.quantity || ''} onChange={e=>setFormData({...formData, quantity: parseInt(e.target.value) || 0})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF3B30]"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs text-gray-500 uppercase">Condition</label>
                                <select value={formData.condition || 'Neu'} onChange={e=>setFormData({...formData, condition:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none">
                                    <option>Neu</option>
                                    <option>Gut</option>
                                    <option>Gebraucht</option>
                                    <option>Service nötig</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase">SEO Description (AI Generated)</label>
                            <textarea placeholder="Description..." value={formData.description || ''} onChange={e=>setFormData({...formData, description:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none h-20 focus:border-[#FF3B30] font-sans"></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-500 uppercase">Technical Specs (Comma separated)</label>
                            <textarea placeholder="Specs..." value={formData.specs} onChange={e=>setFormData({...formData, specs:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none h-16 focus:border-[#FF3B30]"></textarea>
                        </div>
                    </>
                ) : (
                    <>
                        <input type="text" placeholder="Title" value={formData.title} onChange={e=>setFormData({...formData, title:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF3B30]"/>
                        <input type="text" placeholder="Subline / Price" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none focus:border-[#FF3B30]"/>
                        <textarea placeholder="Description" value={formData.desc} onChange={e=>setFormData({...formData, desc:e.target.value})} className="w-full bg-[#050505] border border-[#333] p-2 text-white text-sm outline-none h-32 focus:border-[#FF3B30]"></textarea>
                    </>
                )}
                
                <button onClick={handleSave} className="w-full bg-[#FF3B30] text-black font-bold uppercase py-3 hover:bg-white transition-colors mt-4">Commit to Database</button>
              </div>
           </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowLoginModal(false)}>
          <div className="bg-[#0F0F0F] border border-[#FF3B30] w-full max-w-sm p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold uppercase tracking-widest text-white">Admin Login</h3>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPasswordInput}
              onChange={(e) => setAdminPasswordInput(e.target.value)}
              className="w-full bg-[#111] border border-[#333] p-2 text-sm text-white outline-none focus:border-[#FF3B30]"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setAdminPasswordInput('');
                }}
                className="text-xs font-bold uppercase px-4 py-2 border border-gray-500 text-gray-500 hover:border-[#FF3B30] hover:text-[#FF3B30]"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="text-xs font-bold uppercase px-4 py-2 bg-[#FF3B30] text-black hover:bg-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4" onClick={() => setViewInvoice(null)}>
            <div className="bg-[#111] p-4 rounded-lg flex flex-col items-center max-h-screen" onClick={(e) => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center mb-4 max-w-[210mm] no-print">
                     <span className="text-white font-bold uppercase tracking-widest text-sm">Preview Mode</span>
                     <div className="flex gap-4">
                        <button onClick={printInvoice} className="bg-[#FF3B30] text-black px-4 py-2 font-bold uppercase text-xs flex items-center gap-2 hover:bg-white rounded"><Printer size={16}/> Print / Save PDF</button>
                        <button onClick={() => setViewInvoice(null)} className="bg-gray-800 text-white px-4 py-2 font-bold uppercase text-xs hover:bg-gray-700 rounded"><X size={16}/> Close</button>
                     </div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden p-4 bg-[#222] border border-[#333] rounded shadow-2xl max-h-[85vh] custom-scrollbar">
                    <div id="invoice-area" className="bg-white text-black w-[210mm] min-h-[297mm] p-[15mm] relative shadow-lg mx-auto origin-top transform scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform">
                        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                            <div><h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">{viewInvoice.type === 'Service' ? 'Kostenvoranschlag' : 'Invoice'}</h1><p className="text-sm font-mono text-gray-600">Nr. {viewInvoice.displayId || viewInvoice.id}</p><p className="text-sm font-mono text-gray-600">Datum: {new Date().toLocaleDateString('de-DE')}</p></div>
                            <div className="text-right"><h2 className="font-bold uppercase">{invoiceSettings.companyName}</h2><p className="text-xs">{invoiceSettings.street}</p><p className="text-xs">{invoiceSettings.city}</p><p className="text-xs mt-2">{invoiceSettings.owner}</p></div>
                        </div>
                        <div className="flex justify-between mb-12">
                            <div className="w-1/2"><p className="text-[10px] uppercase text-gray-500 mb-1 border-b border-gray-300 inline-block">Empfänger</p><p className="font-bold">{viewInvoice.client.company}</p><p>{viewInvoice.client.name}</p><p>{viewInvoice.client.street}</p><p>{viewInvoice.client.city}</p></div>
                        </div>
                        <table className="w-full text-sm mb-12"><thead className="border-b-2 border-black"><tr className="text-left uppercase text-xs"><th className="py-2">Pos</th><th className="py-2">Bezeichnung</th><th className="py-2 text-right">Menge</th><th className="py-2 text-right">Einzelpreis</th><th className="py-2 text-right">Gesamt</th></tr></thead><tbody>{viewInvoice.items.map((item, idx) => (<tr key={idx} className="border-b border-gray-200"><td className="py-2 text-gray-500">{idx + 1}</td><td className="py-2 font-bold">{item.name}</td><td className="py-2 text-right">{item.count}</td><td className="py-2 text-right">{item.price}</td><td className="py-2 text-right">{item.price}</td></tr>))}</tbody></table>
                        <div className="flex justify-end mb-16"><div className="w-1/3"><div className="flex justify-between py-2 border-b border-gray-300"><span>Netto</span><span>{viewInvoice.total.replace(' €', '')},00 €</span></div><div className="flex justify-between py-2 border-b border-gray-300"><span>MwSt (19%)</span><span>Included</span></div><div className="flex justify-between py-2 border-b-2 border-black font-bold text-lg mt-2"><span>Rechnungsbetrag</span><span>{viewInvoice.total}</span></div></div></div>
                        <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] border-t border-gray-300 pt-4 text-xs text-gray-600 flex justify-between"><div><p className="font-bold">Bankverbindung:</p><p>{invoiceSettings.bank}</p><p>IBAN: {invoiceSettings.iban}</p></div><div className="text-right"><p>Steuer-ID: {invoiceSettings.taxId}</p><p>Gerichtsstand: Leipzig</p></div></div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- INVENTORY REPORT MODAL (NEW) --- */}
      {viewReport && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4" onClick={() => setViewReport(false)}>
            <div className="bg-[#111] p-4 rounded-lg flex flex-col items-center max-h-screen" onClick={(e) => e.stopPropagation()}>
                <div className="w-full flex justify-between items-center mb-4 max-w-[210mm] no-print">
                     <span className="text-white font-bold uppercase tracking-widest text-sm">Jahresbericht / Inventur</span>
                     <div className="flex gap-4">
                        <button onClick={printInvoice} className="bg-[#FF3B30] text-black px-4 py-2 font-bold uppercase text-xs flex items-center gap-2 hover:bg-white rounded"><Printer size={16}/> Print / Save PDF</button>
                        <button onClick={() => setViewReport(false)} className="bg-gray-800 text-white px-4 py-2 font-bold uppercase text-xs hover:bg-gray-700 rounded"><X size={16}/> Close</button>
                     </div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden p-4 bg-[#222] border border-[#333] rounded shadow-2xl max-h-[85vh] custom-scrollbar">
                    <div id="invoice-area" className="bg-white text-black w-[210mm] min-h-[297mm] p-[15mm] relative shadow-lg mx-auto origin-top transform scale-[0.6] sm:scale-[0.8] md:scale-100 transition-transform">
                        <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">Inventur-Bericht</h1>
                                <p className="text-sm font-mono text-gray-600">Erstellt am: {new Date().toLocaleDateString('de-DE')}</p>
                            </div>
                            <div className="text-right">
                                <h2 className="font-bold uppercase">{invoiceSettings.companyName}</h2>
                                <p className="text-xs">Internes Dokument</p>
                            </div>
                        </div>
                        
                        <table className="w-full text-sm mb-12">
                            <thead className="border-b-2 border-black">
                                <tr className="text-left uppercase text-xs">
                                    <th className="py-2">ID</th>
                                    <th className="py-2">Produkt</th>
                                    <th className="py-2">Kategorie</th>
                                    <th className="py-2 text-right">Menge</th>
                                    <th className="py-2 text-right">Zustand</th>
                                    <th className="py-2 text-right">Mietpreis (Tag)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p) => (
                                    <tr key={p.id} className="border-b border-gray-200">
                                        <td className="py-2 text-gray-500">{p.id.substring(0, 6)}</td>
                                        <td className="py-2 font-bold">{p.name}</td>
                                        <td className="py-2">{p.cat}</td>
                                        <td className="py-2 text-right font-bold">{p.quantity}</td>
                                        <td className="py-2 text-right text-xs uppercase">{p.condition}</td>
                                        <td className="py-2 text-right">{p.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="border-t-2 border-black pt-4 mt-8 flex justify-between items-center">
                            <span className="font-bold uppercase">Gesamtbestand (Einheiten):</span>
                            <span className="text-xl font-bold">{products.reduce((acc, p) => acc + (p.quantity || 0), 0)}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                            * Hinweis: Preise beziehen sich auf den Tagesmietpreis, nicht den Anschaffungswert.
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SoundstructApp;

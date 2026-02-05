import React, { useState, useEffect, useRef } from 'react';
import { User, Event, ChatMessage, Post, Ticket, ProfileType, InvitationCode, IdentityMember } from '../types';
import { Home, Search, Calendar, MessageSquare, User as UserIcon, Bell, MoreVertical, Heart, Lock, Check, MessageCircle, Share2, Shield, CreditCard, Ticket as TicketIcon, TrendingUp, DollarSign, Image as ImageIcon, Send, Plus, Key, ArrowLeft, X, Copy, Camera, MapPin, Clock, LogOut, ArrowRight, Minus, Edit2, Save, Trash2, Ticket as Ticket2 } from 'lucide-react';
import { USERS, EVENTS, CHATS, POSTS, TICKETS } from '../data';

interface UserAppProps {
  user: User;
  onLogout: () => void;
}

// --- Utility Components ---

// Custom Toast Notification
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down ${type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-md`}>
    {type === 'success' ? <Check size={18} /> : <X size={18} />}
    <span className="text-sm font-medium">{message}</span>
  </div>
);

// Currency Formatter
const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

// --- Sub-Components ---

interface ChatInterfaceProps {
  chatId: string;
  partner: User;
  onBack: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, partner, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(CHATS[chatId] || []);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      senderId: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text'
    };
    setMessages([...messages, newMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black animate-slide-in-right">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={onBack} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition">
           <ArrowLeft size={24} />
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700">
          <img src={partner.publicPhoto} className="w-full h-full object-cover" alt={partner.nickname} />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">{partner.nickname}</h3>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-xs text-slate-400">En línea</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        {messages.length === 0 && (
            <div className="text-center text-slate-600 text-xs py-10 uppercase tracking-widest">
                Inicio de la conversación encriptada
            </div>
        )}
        {messages.map(msg => {
           const isMe = msg.senderId === 'me';
           return (
             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-3 shadow-lg ${
                  isMe ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                   {msg.type === 'unlock_grant' && msg.unlockContent?.type === 'real_photo' ? (
                       <div className="space-y-2">
                           <div className="flex items-center gap-2 text-xs font-bold opacity-70">
                               <Lock size={12} /> FOTO PRIVADA REVELADA
                           </div>
                           <img src={msg.unlockContent.value} className="rounded-lg w-full" alt="Private" />
                       </div>
                   ) : (
                       <p className="text-sm leading-relaxed">{msg.text}</p>
                   )}
                   <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-black/60' : 'text-slate-500'}`}>
                      {msg.timestamp}
                   </span>
                </div>
             </div>
           );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 sticky bottom-14 md:bottom-0 safe-area-bottom">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-5 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-600"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        {/* MVP Restriction: Image sending disabled */}
        {/* <button className="text-slate-400 p-3 hover:text-white"><ImageIcon size={20}/></button> */}
        <button onClick={handleSend} className="bg-amber-500 text-black p-3 rounded-full hover:bg-amber-400 active:scale-95 transition flex items-center justify-center shadow-lg shadow-amber-500/20">
           <Send size={20} />
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---

const UserApp: React.FC<UserAppProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<'home' | 'explore' | 'events' | 'chat' | 'profile' | 'finance'>('home');
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  
  // Data State (Local)
  const [events, setEvents] = useState<Event[]>(EVENTS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [myTickets, setMyTickets] = useState<Ticket[]>(user.id === 'u1' ? TICKETS : []); 
  
  // Event Checkout Logic
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Viewing Details
  const [checkoutEvent, setCheckoutEvent] = useState<Event | null>(null); // Buying
  const [ticketQuantity, setTicketQuantity] = useState(1);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [editDescription, setEditDescription] = useState(user.description);
  const [userGallery, setUserGallery] = useState<string[]>(user.gallery || []);

  // Business Logic State
  const [inviteType, setInviteType] = useState<ProfileType>(ProfileType.SINGLE);
  const [businessCodes, setBusinessCodes] = useState<InvitationCode[]>([
      { code: 'VELVET-INV-01', type: ProfileType.SINGLE, generatedBy: user.id, expiresAt: '2024-03-01', isUsed: false }
  ]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '', description: '', date: '', time: '', price: 0, maxAttendees: 50, location: '', image: '' });

  // UI State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Verification Form Data (Changed Age to DOB)
  const [verificationData, setVerificationData] = useState<IdentityMember[]>([
      { fullName: '', dateOfBirth: '', idNumber: '', idPhotoUrl: '' },
      { fullName: '', dateOfBirth: '', idNumber: '', idPhotoUrl: '' }
  ]);

  const exploreUsers = USERS.filter(u => u.id !== user.id);
  const isBusiness = user.profileType === ProfileType.BUSINESS;
  const isCouple = user.profileType === ProfileType.COUPLE;

  // Helpers
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleOpenEventDetails = (event: Event) => {
      setSelectedEvent(event);
      setTicketQuantity(1);
  };

  const handleProceedToCheckout = (event: Event) => {
      setCheckoutEvent(event);
      setSelectedEvent(null);
  };

  const confirmPurchase = () => {
    if (!checkoutEvent) return;
    const totalPrice = checkoutEvent.price * ticketQuantity;
    const commission = totalPrice * 0.08;
    
    const newTicket: Ticket = {
      id: `t-${Date.now()}`,
      eventId: checkoutEvent.id,
      userId: user.id,
      eventName: checkoutEvent.title,
      eventDate: `${checkoutEvent.date} - ${checkoutEvent.time}`,
      eventLocation: checkoutEvent.location,
      quantity: ticketQuantity,
      status: 'active',
      purchaseDate: new Date().toLocaleDateString(),
      pricePaid: totalPrice,
      commission: commission
    };
    setMyTickets([...myTickets, newTicket]);
    setEvents(events.map(e => e.id === checkoutEvent.id ? {...e, soldCount: e.soldCount + ticketQuantity} : e));
    setCheckoutEvent(null);
    setTicketQuantity(1);
    showToast(`¡Compra exitosa! (${ticketQuantity} entradas)`);
  };

  const handleCreatePost = () => {
      if (!newPostText.trim()) return;
      
      const newPost: Post = {
          id: `p-${Date.now()}`,
          userId: user.id,
          content: newPostText,
          likes: 0,
          comments: 0,
          timestamp: 'Ahora mismo',
          images: Math.random() > 0.7 ? [`https://picsum.photos/id/${Math.floor(Math.random()*100)}/800/600`] : [] 
      };
      
      setPosts([newPost, ...posts]);
      setNewPostText('');
      setIsCreatingPost(false);
      showToast('Publicación creada');
  };

  const handleCreateEvent = () => {
    if(!newEvent.title || !newEvent.date || !newEvent.price || !newEvent.time) {
        showToast("Completa los campos obligatorios", 'error');
        return;
    }

    const createdEvent: Event = {
        id: `e-${Date.now()}`,
        creatorId: user.id,
        title: newEvent.title || 'Evento Nuevo',
        description: newEvent.description || 'Sin descripción',
        date: newEvent.date || 'Pendiente',
        time: newEvent.time || '20:00',
        location: newEvent.location || user.location,
        attendees: 0,
        maxAttendees: newEvent.maxAttendees || 100,
        soldCount: 0,
        isPremium: (newEvent.price || 0) > 200000,
        price: newEvent.price || 0,
        image: newEvent.image || `https://picsum.photos/id/${Math.floor(Math.random()*100)}/800/400`
    };

    setEvents([createdEvent, ...events]);
    setNewEvent({ title: '', description: '', date: '', time: '', price: 0, maxAttendees: 50, location: '', image: '' });
    showToast("Evento creado exitosamente");
  };

  const handleGenerateBusinessCode = () => {
      if (businessCodes.length >= 15) {
          showToast("Has alcanzado el límite de 15 códigos generados.", 'error');
          return;
      }
      
      const prefix = inviteType === ProfileType.COUPLE ? 'CPL' : 'IND';
      const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
      const newCode: InvitationCode = {
          code: `${user.nickname.substring(0,3).toUpperCase()}-${prefix}-${randomStr}`,
          type: inviteType,
          generatedBy: user.id,
          expiresAt: '2025-01-01',
          isUsed: false
      };

      setBusinessCodes([...businessCodes, newCode]);
      showToast(`Código generado. (${businessCodes.length + 1}/15)`);
  };

  const handleUploadGallery = () => {
      // Mock upload simulation
      const newImg = `https://picsum.photos/id/${Math.floor(Math.random() * 500)}/400/600`;
      setUserGallery([newImg, ...userGallery]);
      showToast("Foto agregada");
  };
  
  const handleRemovePhoto = (index: number) => {
      const newGallery = [...userGallery];
      newGallery.splice(index, 1);
      setUserGallery(newGallery);
  };
  
  const handleSaveProfile = () => {
      if (!editNickname.trim()) {
          showToast("El nickname no puede estar vacío", 'error');
          return;
      }
      if (userGallery.length === 0) {
          showToast("Debes tener al menos 1 foto pública", 'error');
          return;
      }
      // Mock save
      user.nickname = editNickname;
      user.description = editDescription;
      user.gallery = userGallery;
      user.publicPhoto = userGallery[0]; // Set first gallery image as avatar
      
      setIsEditingProfile(false);
      showToast("Perfil actualizado correctamente");
  };

  const handleSubmitVerification = () => {
      // Validate form
      if (!verificationData[0].fullName || !verificationData[0].idNumber || !verificationData[0].dateOfBirth) {
          showToast("Completa los datos del miembro principal.", 'error');
          return;
      }
      
      // Strict Age Check
      const age1 = calculateAge(verificationData[0].dateOfBirth);
      if (age1 < 18) {
          showToast("El miembro principal debe ser mayor de 18 años.", 'error');
          return;
      }

      if (isCouple) {
         if (!verificationData[1].fullName || !verificationData[1].idNumber || !verificationData[1].dateOfBirth) {
             showToast("Completa los datos de tu pareja.", 'error');
             return;
         }
         const age2 = calculateAge(verificationData[1].dateOfBirth);
         if (age2 < 18) {
             showToast("El segundo miembro debe ser mayor de 18 años.", 'error');
             return;
         }
      }

      showToast("Datos enviados para validación.");
      setIsVerifying(false);
      // Here you would optimally update the user status to "Pending Verification"
  };

  // Define Menu Items based on Role (Strictly removing Explore/Chat for Business)
  const menuItems = isBusiness 
    ? [
        { id: 'home', icon: Home, label: 'Feed' },
        { id: 'events', icon: Calendar, label: 'Eventos' }, // Can only manage events
        { id: 'finance', icon: TrendingUp, label: 'Finanzas' },
        { id: 'profile', icon: UserIcon, label: 'Perfil' },
      ]
    : [
        { id: 'home', icon: Home, label: 'Feed' },
        { id: 'explore', icon: Search, label: 'Explorar' },
        { id: 'events', icon: Calendar, label: 'Eventos' },
        { id: 'chat', icon: MessageSquare, label: 'Chat' },
        { id: 'profile', icon: UserIcon, label: 'Perfil' },
      ];

  return (
    <div className="min-h-screen bg-black text-slate-200 pb-20 relative overflow-hidden font-sans selection:bg-amber-500/30">
      
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* App Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]">K</div>
          <span className="font-bold text-white tracking-widest text-sm">KITANA</span>
        </div>
        <div className="flex gap-4 text-slate-300">
          <button className="hover:text-amber-500 transition relative">
            <Bell size={22} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button onClick={onLogout} className="hover:text-white transition"><LogOut size={22} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-0 max-w-lg mx-auto md:border-x md:border-white/5 md:min-h-screen">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="animate-fade-in pb-4">
            {/* Quick Actions */}
            <div className="p-4 border-b border-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                    <img src={user.publicPhoto || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="User" />
                </div>
                <button 
                    onClick={() => setIsCreatingPost(true)}
                    className="flex-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-left px-5 py-3 rounded-full text-slate-400 text-sm transition-all shadow-inner"
                >
                    ¿Qué está pasando esta noche?
                </button>
            </div>

            {/* Social Feed */}
            <div className="space-y-4 mt-4 px-2">
               {posts.map(post => {
                  const author = USERS.find(u => u.id === post.userId) || user;
                  return (
                     <div key={post.id} className="bg-[#0a0a0a] border border-slate-900 rounded-2xl overflow-hidden shadow-sm">
                        {/* Post Header */}
                        <div className="flex items-center justify-between p-4 pb-2">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800">
                                 <img src={author.publicPhoto} className="w-full h-full object-cover" alt={author.nickname} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-1">
                                    <span className="font-bold text-white text-sm">{author.nickname}</span>
                                    {author.verificationLevel !== 'Básico' && <Check size={14} className="text-amber-500" />}
                                 </div>
                                 <div className="text-xs text-slate-500 flex items-center gap-1">
                                    {post.timestamp} • <span className="text-slate-600">{author.location}</span>
                                 </div>
                              </div>
                           </div>
                           <button className="text-slate-500 hover:text-white"><MoreVertical size={18} /></button>
                        </div>

                        {/* Post Content */}
                        <div className="px-4 py-2 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                           {post.content}
                        </div>
                        
                        {/* Images */}
                        {post.images && post.images.length > 0 && (
                           <div className="mt-2">
                              {post.images.length === 1 ? (
                                  <img src={post.images[0]} className="w-full h-64 object-cover" alt="Post" />
                              ) : (
                                  <div className="grid grid-cols-2 gap-0.5">
                                      {post.images.map((img, idx) => (
                                          <img key={idx} src={img} className="w-full h-40 object-cover" alt="Post part" />
                                      ))}
                                  </div>
                              )}
                           </div>
                        )}

                        {/* Actions */}
                        <div className="px-4 py-3 flex items-center justify-between text-slate-400 border-t border-slate-900/50 mt-2">
                           <div className="flex gap-6">
                              <button className="flex items-center gap-2 hover:text-pink-500 transition group">
                                 <Heart size={20} className="group-hover:fill-pink-500/20" /> 
                                 <span className="text-xs font-medium">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-2 hover:text-blue-400 transition">
                                 <MessageCircle size={20} /> 
                                 <span className="text-xs font-medium">{post.comments}</span>
                              </button>
                           </div>
                           <button className="hover:text-white transition">
                              <Share2 size={20} />
                           </button>
                        </div>
                     </div>
                  )
               })}
            </div>
          </div>
        )}

        {/* VIEW: FINANCE (BUSINESS ONLY) */}
        {view === 'finance' && isBusiness && (
            <div className="space-y-6 px-4 pt-4 animate-fade-in pb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Finanzas del Establecimiento</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold">
                            <DollarSign size={14} /> Ingresos Brutos
                        </div>
                        <div className="text-xl font-bold text-white">
                            {formatCOP(events.filter(e => e.creatorId === user.id).reduce((acc, e) => acc + (e.price * e.soldCount), 0))}
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/40 to-slate-900 p-4 rounded-2xl border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2 text-green-400 text-xs uppercase font-bold">
                            <TrendingUp size={14} /> Ingreso Neto (92%)
                        </div>
                        <div className="text-xl font-bold text-white">
                            {formatCOP(events.filter(e => e.creatorId === user.id).reduce((acc, e) => acc + (e.price * e.soldCount), 0) * 0.92)}
                        </div>
                        <span className="text-[10px] text-green-500/70">Despues de comisión (8%)</span>
                    </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                         <div className="bg-amber-500/10 p-2 rounded-full text-amber-500"><TicketIcon size={20} /></div>
                         <div>
                             <span className="text-xs text-slate-400 uppercase font-bold block">Total Entradas</span>
                             <span className="text-white font-bold text-lg">
                                 {events.filter(e => e.creatorId === user.id).reduce((acc, e) => acc + e.soldCount, 0)}
                             </span>
                         </div>
                     </div>
                </div>

                {/* Event Breakdown */}
                <div>
                    <h3 className="text-white font-bold text-sm mb-3">Desglose por Evento</h3>
                    <div className="space-y-3">
                        {events.filter(e => e.creatorId === user.id).map(event => {
                            const revenue = event.price * event.soldCount;
                            return (
                                <div key={event.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold text-sm truncate w-2/3">{event.title}</h4>
                                        <span className="text-amber-500 font-bold text-sm">{formatCOP(revenue)}</span>
                                    </div>
                                    <div className="text-xs text-slate-500 flex justify-between items-center">
                                        <span>{event.date}</span>
                                        <span>{event.soldCount} entradas vendidas</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: EVENTS */}
        {view === 'events' && (
             <div className="space-y-6 px-4 pt-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">{isBusiness ? 'Gestión' : 'Agenda'}</h2>
                  {!isBusiness && <span className="text-xs text-amber-500 uppercase font-bold tracking-widest">Próximos</span>}
              </div>
              
               {isBusiness ? (
                  <div className="space-y-6">
                      {/* Create Event Form */}
                      <div className="bg-slate-900/80 backdrop-blur p-5 rounded-2xl border border-slate-800 shadow-xl">
                          <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                              <Plus size={16} className="text-amber-500" /> Crear Evento
                          </h3>
                           <div className="space-y-3">
                              <input 
                                type="text" 
                                placeholder="Nombre del evento" 
                                value={newEvent.title}
                                onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                                className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                              />
                              <textarea
                                placeholder="Descripción del evento..."
                                value={newEvent.description}
                                onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                                className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none resize-none h-24"
                              />
                              
                              <div className="grid grid-cols-2 gap-3">
                                  <div>
                                      <label className="text-[10px] text-slate-500 mb-1 block">Fecha</label>
                                      <input 
                                        type="text" 
                                        placeholder="DD/MM" 
                                        value={newEvent.date}
                                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                                      />
                                  </div>
                                  <div>
                                      <label className="text-[10px] text-slate-500 mb-1 block">Hora</label>
                                      <input 
                                        type="time" 
                                        value={newEvent.time}
                                        onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                                      />
                                  </div>
                              </div>

                               <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500 text-sm">$</span>
                                    <input 
                                        type="number" 
                                        placeholder="Precio" 
                                        value={newEvent.price || ''}
                                        onChange={e => setNewEvent({...newEvent, price: parseInt(e.target.value)})}
                                        className="w-full bg-black/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                                    />
                                </div>
                                <input 
                                    type="number" 
                                    placeholder="Capacidad" 
                                    value={newEvent.maxAttendees || ''}
                                    onChange={e => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                                    className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"
                                />
                               </div>
                               
                               <button 
                                onClick={() => setNewEvent({...newEvent, image: 'https://picsum.photos/id/123/800/400'})}
                                className="w-full border border-dashed border-slate-700 rounded-xl p-3 text-slate-500 text-xs flex items-center justify-center gap-2 hover:text-white hover:border-slate-500 transition"
                               >
                                   <ImageIcon size={14} /> {newEvent.image ? 'Imagen Adjuntada (1/1)' : 'Adjuntar Imagen (Max 1)'}
                               </button>

                                <button onClick={handleCreateEvent} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 rounded-xl text-sm hover:brightness-110 transition shadow-lg shadow-amber-500/20">
                                  Publicar Evento
                                </button>
                           </div>
                      </div>

                      {/* Created Events History */}
                      <div className="space-y-4">
                        <h3 className="text-white font-bold text-sm">Historial de Eventos</h3>
                        {events.filter(e => e.creatorId === user.id).map(event => (
                             <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                                 <div className="flex justify-between items-start mb-2">
                                     <h4 className="text-white text-sm font-bold">{event.title}</h4>
                                     <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Activo</span>
                                 </div>
                                 <div className="flex justify-between text-xs text-slate-400 mb-2">
                                     <span>{event.date} • {event.time}</span>
                                     <span>{formatCOP(event.price)}</span>
                                 </div>
                                 
                                 {/* Progress Bar for Tickets */}
                                 <div className="mt-3">
                                     <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                                         <span>Vendidas: <span className="font-bold text-white">{event.soldCount}</span></span>
                                         <span>Quedan: <span className="font-bold text-amber-500">{event.maxAttendees - event.soldCount}</span></span>
                                     </div>
                                     <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                         <div 
                                            className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-1000" 
                                            style={{width: `${(event.soldCount / event.maxAttendees) * 100}%`}}
                                         ></div>
                                     </div>
                                 </div>
                             </div>
                        ))}
                      </div>
                  </div>
               ) : (
                  events.map(event => (
                    <div key={event.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                        <div className="h-48 bg-slate-800 relative overflow-hidden">
                            <img src={event.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt={event.title} />
                            <div className="absolute top-3 left-3">
                                <span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1">
                                    <Calendar size={12} /> {event.date}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-xl leading-tight w-2/3">{event.title}</h3>
                                <div className="text-right">
                                    <span className="text-amber-500 font-bold text-lg block">{event.price > 0 ? formatCOP(event.price) : 'Gratis'}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
                                <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>
                                <span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span>
                            </div>
                            <button 
                                onClick={() => handleOpenEventDetails(event)}
                                className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition"
                            >
                                <TicketIcon size={18} /> Ver Detalles / Comprar
                            </button>
                        </div>
                    </div>
                  ))
               )}
             </div>
        )}

        {/* VIEW: CHAT LIST */}
        {view === 'chat' && !isBusiness && (
           <div className="h-full flex flex-col animate-fade-in pt-4 px-2">
             {!activeChat ? (
               <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white px-2 mb-4">Mensajes</h2>
                  {Object.keys(CHATS).map(chatId => {
                     const partner = USERS.find(u => u.id === chatId);
                     if (!partner) return null;
                     const lastMsg = CHATS[chatId][CHATS[chatId].length - 1];
                     
                     return (
                        <div key={chatId} onClick={() => setActiveChat(chatId)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-900/60 transition cursor-pointer border border-transparent hover:border-slate-800">
                           <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-800">
                              <img src={partner.publicPhoto} className="w-full h-full object-cover" alt={partner.nickname} />
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-baseline mb-1">
                                 <h3 className="font-bold text-white text-base">{partner.nickname}</h3>
                                 <span className="text-xs text-slate-500">{lastMsg.timestamp}</span>
                              </div>
                              <p className="text-sm text-slate-400 truncate flex items-center gap-1">
                                {lastMsg.type === 'unlock_grant' ? <><Lock size={12} className="text-amber-500"/> Contenido privado</> : lastMsg.text}
                              </p>
                           </div>
                        </div>
                     );
                  })}
               </div>
             ) : (
                <ChatInterface chatId={activeChat} partner={USERS.find(u => u.id === activeChat)!} onBack={() => setActiveChat(null)} />
             )}
           </div>
        )}

        {/* VIEW: PROFILE */}
        {view === 'profile' && (
           <div className="px-4 pt-6 space-y-8 animate-fade-in pb-10">
              
              {/* Profile Header Card */}
              <div className="bg-gradient-to-b from-slate-900 to-black p-6 rounded-3xl border border-slate-800 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-500/10 to-transparent"></div>
                  
                  <div className="relative z-10 mx-auto w-24 h-24 mb-4">
                      <img src={isEditingProfile && userGallery.length > 0 ? userGallery[0] : (user.publicPhoto || 'https://via.placeholder.com/150')} className="w-full h-full rounded-full object-cover border-4 border-slate-950 shadow-2xl" alt="Profile" />
                      <div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900 ${user.verificationLevel !== 'Básico' ? 'bg-amber-500 text-black' : 'bg-slate-600 text-white'}`}>
                          {user.verificationLevel !== 'Básico' ? <Check size={14} strokeWidth={4} /> : <Lock size={14} />}
                      </div>
                  </div>
                  
                  {isEditingProfile ? (
                      <div className="space-y-3 relative z-10">
                          <input 
                              value={editNickname}
                              onChange={(e) => setEditNickname(e.target.value)}
                              className="bg-black/50 border border-slate-700 text-center font-black text-xl text-white rounded p-1 w-full"
                              placeholder="Nickname"
                          />
                          <textarea 
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="bg-black/50 border border-slate-700 text-sm text-slate-300 rounded p-2 w-full h-20 resize-none"
                              placeholder="Bio..."
                          />
                          <div className="flex gap-2 justify-center">
                              <button onClick={() => setIsEditingProfile(false)} className="bg-slate-800 px-4 py-2 rounded text-xs">Cancelar</button>
                              <button onClick={handleSaveProfile} className="bg-green-600 px-4 py-2 rounded text-xs font-bold text-white">Guardar</button>
                          </div>
                      </div>
                  ) : (
                      <>
                        <div className="flex justify-center items-center gap-2">
                             <h2 className="text-2xl font-black text-white">{user.nickname || 'Usuario'}</h2>
                             <button onClick={() => {
                                 setEditNickname(user.nickname);
                                 setEditDescription(user.description);
                                 setIsEditingProfile(true);
                             }} className="text-slate-500 hover:text-white"><Edit2 size={16} /></button>
                        </div>
                        <div className="flex justify-center gap-2 mt-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">{user.profileType}</span>
                            {user.isPremium && <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold shadow-lg shadow-amber-500/20">PREMIUM</span>}
                        </div>
                        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">{user.description || "Sin descripción"}</p>
                      </>
                  )}
              </div>

              {/* Action: Pending Verification */}
              {(user.status === 'Pending' || user.verificationLevel === 'Básico') && !isVerifying && (
                  <div 
                    onClick={() => setIsVerifying(true)}
                    className="bg-red-500/5 border border-red-500/20 p-5 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-red-500/10 transition group"
                  >
                      <div>
                          <h3 className="text-red-400 font-bold text-sm mb-1 flex items-center gap-2">
                             <Shield size={16} /> Verificación Pendiente
                          </h3>
                          <p className="text-xs text-slate-500">Valida tu identidad para acceder a funciones.</p>
                      </div>
                      <ArrowRight size={20} className="text-red-500 group-hover:translate-x-1 transition" />
                  </div>
              )}

              {/* Gallery Manager */}
              <div>
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-lg">Galería Pública</h3>
                      {isEditingProfile && (
                        <button onClick={handleUploadGallery} className="text-amber-500 text-xs font-bold hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition flex items-center gap-1">
                            <Plus size={14} /> AÑADIR
                        </button>
                      )}
                  </div>
                  {userGallery.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                          {userGallery.map((img, i) => (
                              <div key={i} className="aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden relative group">
                                  <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                  {isEditingProfile && (
                                    <button onClick={() => handleRemovePhoto(i)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700">
                                        <X size={12} />
                                    </button>
                                  )}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="h-32 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2">
                          <ImageIcon size={24} />
                          <span className="text-xs">Tu galería está vacía</span>
                      </div>
                  )}
              </div>

              {/* Private Identity Viewer */}
              <div className="bg-[#0f1115] rounded-3xl border border-slate-800 overflow-hidden">
                  <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <div className="bg-slate-900 p-2 rounded-lg"><Lock size={18} className="text-amber-500" /></div>
                          <div>
                              <h3 className="font-bold text-white text-sm">Identidad Privada</h3>
                              <p className="text-[10px] text-slate-500">Encriptado de extremo a extremo</p>
                          </div>
                      </div>
                  </div>
                  
                  {user.privateIdentity ? (
                      <div className="divide-y divide-slate-800/50">
                          {user.privateIdentity.map((member, idx) => (
                              <div key={idx} className="p-5 flex items-center justify-between">
                                  <div>
                                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Miembro {idx + 1}</p>
                                      <div className="text-sm text-white font-medium">{member.fullName}</div>
                                      <div className="text-xs text-slate-400 mt-0.5">ID: •••• {member.idNumber.slice(-4)}</div>
                                      <div className="text-xs text-slate-500 mt-0.5">Nac: {member.dateOfBirth}</div>
                                  </div>
                                  <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-slate-600">
                                      <UserIcon size={18} />
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="p-6 text-center">
                          <p className="text-slate-500 text-sm">No has proporcionado información privada.</p>
                      </div>
                  )}
              </div>
              
              {/* My Invitation Codes (New for Users) */}
              {!isBusiness && user.myInviteCodes && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-3xl border border-amber-500/20 p-5">
                       <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ticket2 size={16} className="text-amber-500"/> Mis Pases de Invitación</h3>
                       <div className="space-y-2">
                           {user.myInviteCodes.map((code, idx) => (
                              <div key={idx} className={`p-3 rounded-xl border flex justify-between items-center group cursor-pointer ${code.isUsed ? 'bg-black/40 border-slate-800/50 opacity-60' : 'bg-black/60 border-amber-500/30'}`} 
                                  onClick={() => !code.isUsed && navigator.clipboard.writeText(code.code) && showToast('Código copiado')}
                              >
                                  <div>
                                      <code className={`text-sm font-mono block ${code.isUsed ? 'text-slate-500 line-through' : 'text-amber-500'}`}>{code.code}</code>
                                      <span className="text-[10px] text-slate-600">Válido hasta: {code.expiresAt}</span>
                                  </div>
                                  {code.isUsed ? (
                                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">USADO</span>
                                  ) : (
                                      <Copy size={14} className="text-slate-500 group-hover:text-white transition" />
                                  )}
                              </div>
                           ))}
                           <p className="text-[10px] text-slate-500 text-center mt-2">Comparte estos códigos solo con personas de confianza. Eres responsable de tus invitados.</p>
                       </div>
                  </div>
              )}
              
              {/* Business Tools */}
              {isBusiness && (
                  <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-5">
                       <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key size={16} className="text-amber-500"/> Generador de Pases</h3>
                       <div className="flex gap-2 mb-4">
                          <select 
                              value={inviteType}
                              onChange={(e) => setInviteType(e.target.value as ProfileType)}
                              className="bg-black border border-slate-700 rounded-xl px-4 py-2 text-xs text-white flex-1 outline-none focus:border-amber-500"
                          >
                              <option value={ProfileType.SINGLE}>Individual</option>
                              <option value={ProfileType.COUPLE}>Pareja</option>
                          </select>
                          <button onClick={handleGenerateBusinessCode} className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition">
                              GENERAR
                          </button>
                       </div>
                       <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                           <span>Códigos generados: {businessCodes.length}/15</span>
                       </div>
                       <div className="space-y-2">
                           {businessCodes.map((code, idx) => (
                              <div key={idx} className="bg-black/40 p-3 rounded-xl border border-slate-800/50 flex justify-between items-center group cursor-pointer" onClick={() => {navigator.clipboard.writeText(code.code); showToast('Código copiado')}}>
                                  <div>
                                      <code className="text-sm font-mono text-amber-500 block">{code.code}</code>
                                      <span className="text-[10px] text-slate-600">{code.type}</span>
                                  </div>
                                  <Copy size={14} className="text-slate-600 group-hover:text-white transition" />
                              </div>
                           ))}
                       </div>
                  </div>
              )}
           </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* Verification Modal (Strict Age Control) */}
      {isVerifying && (
          <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
              <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden my-auto shadow-2xl">
                  <div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-white text-lg">Verificación</h3>
                          <p className="text-xs text-slate-500">Paso obligatorio de seguridad (+18)</p>
                      </div>
                      <button onClick={() => setIsVerifying(false)} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white"><X size={18} /></button>
                  </div>
                  
                  <div className="p-6 space-y-8">
                      {/* Form Member 1 */}
                      <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-2">
                              <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">1</span>
                              <h4 className="text-white font-bold text-sm">Titular Principal</h4>
                          </div>
                          <input 
                              placeholder="Nombre Legal Completo"
                              value={verificationData[0].fullName}
                              onChange={(e) => {
                                  const n = [...verificationData]; n[0].fullName = e.target.value; setVerificationData(n);
                              }}
                              className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">Fecha Nacimiento</label>
                                    <input 
                                        type="date"
                                        value={verificationData[0].dateOfBirth}
                                        onChange={(e) => { const n = [...verificationData]; n[0].dateOfBirth = e.target.value; setVerificationData(n); }}
                                        className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 block mb-1">Doc. Identidad</label>
                                    <input 
                                        placeholder="DNI / Pasaporte"
                                        value={verificationData[0].idNumber}
                                        onChange={(e) => { const n = [...verificationData]; n[0].idNumber = e.target.value; setVerificationData(n); }}
                                        className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                    />
                                </div>
                          </div>
                          <button className="w-full border border-dashed border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition">
                                <Camera size={18} />
                                <span className="text-xs font-bold uppercase">Subir Foto Documento</span>
                          </button>
                      </div>

                      {/* Form Member 2 (Conditional) */}
                      {isCouple && (
                          <div className="space-y-4 pt-4 border-t border-slate-800">
                              <div className="flex items-center gap-2 mb-2">
                                  <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">2</span>
                                  <h4 className="text-white font-bold text-sm">Pareja</h4>
                              </div>
                              <input 
                                  placeholder="Nombre Legal Completo"
                                  value={verificationData[1].fullName}
                                  onChange={(e) => { const n = [...verificationData]; n[1].fullName = e.target.value; setVerificationData(n); }}
                                  className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none"
                              />
                               <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Fecha Nacimiento</label>
                                        <input 
                                            type="date"
                                            value={verificationData[1].dateOfBirth}
                                            onChange={(e) => { const n = [...verificationData]; n[1].dateOfBirth = e.target.value; setVerificationData(n); }}
                                            className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 block mb-1">Doc. Identidad</label>
                                        <input 
                                            placeholder="DNI / Pasaporte"
                                            value={verificationData[1].idNumber}
                                            onChange={(e) => { const n = [...verificationData]; n[1].idNumber = e.target.value; setVerificationData(n); }}
                                            className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"
                                        />
                                    </div>
                              </div>
                          </div>
                      )}

                      <button 
                          onClick={handleSubmitVerification}
                          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/30 text-sm tracking-wide uppercase transition-all active:scale-95"
                      >
                          Enviar a Revisión
                      </button>
                      <p className="text-[10px] text-center text-slate-500">Tus datos están protegidos y solo son visibles para el equipo de Staff.</p>
                  </div>
              </div>
          </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                 <div className="relative h-56 bg-slate-800 shrink-0">
                     <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                     <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black transition"><X size={20} /></button>
                 </div>
                 <div className="p-6 overflow-y-auto">
                     <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
                     <div className="flex gap-4 text-sm text-slate-400 mb-4">
                         <span className="flex items-center gap-1"><Calendar size={14}/> {selectedEvent.date}</span>
                         <span className="flex items-center gap-1"><Clock size={14}/> {selectedEvent.time}</span>
                     </div>
                     <p className="text-slate-300 text-sm leading-relaxed mb-6">{selectedEvent.description || "Sin descripción adicional."}</p>
                     
                     <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6">
                         <div className="text-xs text-slate-500 uppercase font-bold mb-1">Ubicación</div>
                         <div className="text-white flex items-center gap-2"><MapPin size={16}/> {selectedEvent.location}</div>
                     </div>
                 </div>
                 <div className="p-4 border-t border-slate-800 bg-slate-950 mt-auto shrink-0">
                     <button 
                       onClick={() => handleProceedToCheckout(selectedEvent)}
                       className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition"
                     >
                        Comprar Entrada • {formatCOP(selectedEvent.price)}
                     </button>
                 </div>
             </div>
        </div>
      )}

      {/* Checkout Modal with Quantity */}
      {checkoutEvent && (
        <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
                <div className="h-32 bg-slate-800 relative">
                    <img src={checkoutEvent.image} className="w-full h-full object-cover opacity-60" alt="Event" />
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900 to-transparent">
                        <h3 className="font-bold text-white text-lg leading-none">{checkoutEvent.title}</h3>
                    </div>
                </div>
                
                <div className="p-6 space-y-4">
                    {/* Quantity Selector */}
                    <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-400 text-sm">Cantidad</span>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"
                            >
                                <Minus size={14}/>
                            </button>
                            <span className="font-bold text-white w-4 text-center">{ticketQuantity}</span>
                             <button 
                                onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
                                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"
                            >
                                <Plus size={14}/>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                         <span className="text-slate-400 text-sm">Total a Pagar</span>
                         <span className="text-2xl font-bold text-amber-500">{formatCOP(checkoutEvent.price * ticketQuantity)}</span>
                    </div>

                    <div className="bg-black border border-slate-800 p-4 rounded-xl flex items-center gap-3">
                         <div className="bg-slate-800 p-2 rounded-lg"><CreditCard size={20} className="text-white"/></div>
                         <div className="flex-1">
                             <div className="text-xs text-slate-500 uppercase font-bold">Método de Pago</div>
                             <div className="text-sm text-white">Visa •••• 4242</div>
                         </div>
                         <span className="text-xs text-amber-500 font-bold cursor-pointer">CAMBIAR</span>
                    </div>

                    <button 
                       onClick={confirmPurchase}
                       className="w-full bg-white hover:bg-slate-200 text-black font-bold py-4 rounded-xl mt-2 flex justify-center items-center gap-2 transition"
                    >
                       <Lock size={16} /> Confirmar Pago
                    </button>
                    <button 
                       onClick={() => { setCheckoutEvent(null); setTicketQuantity(1); }}
                       className="w-full text-slate-500 text-sm py-2 hover:text-white"
                    >
                       Cancelar transacción
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Create Post Modal */}
      {isCreatingPost && (
          <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transform transition-all">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <span className="font-bold text-white text-sm px-2">Crear Publicación</span>
                      <button onClick={() => setIsCreatingPost(false)} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"><X size={20} /></button>
                  </div>
                  <div className="p-4">
                      <textarea 
                          className="w-full bg-transparent text-white resize-none h-32 focus:outline-none placeholder-slate-600 text-lg"
                          placeholder="¿Qué estás pensando?"
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          autoFocus
                      ></textarea>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/50">
                          <button className="text-amber-500 p-2 rounded-full hover:bg-amber-500/10 transition">
                             <ImageIcon size={22} />
                          </button>
                          <button 
                             onClick={handleCreatePost}
                             disabled={!newPostText.trim()}
                             className="bg-white text-black font-bold px-6 py-2 rounded-full flex items-center gap-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                             Publicar
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Profile Detail Modal (Explore) */}
      {selectedProfile && (
        <div className="fixed inset-0 z-[70] bg-black animate-slide-up overflow-y-auto">
           <button onClick={() => setSelectedProfile(null)} className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur p-2 rounded-full text-white border border-white/10 hover:bg-white hover:text-black transition">
             <X size={24} />
           </button>
           
           <div className="h-[50vh] relative">
              <img src={selectedProfile.publicPhoto} className="w-full h-full object-cover" alt="Profile" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"></div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                 <h1 className="text-4xl font-black text-white mb-2">{selectedProfile.nickname}</h1>
                 <div className="flex items-center gap-3">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-bold">{selectedProfile.profileType}</span>
                    <span className="flex items-center gap-1 text-slate-300 text-xs"><MapPin size={12}/> {selectedProfile.location}</span>
                 </div>
              </div>
           </div>
           
           <div className="p-6 space-y-8 pb-20 max-w-lg mx-auto">
              <div className="flex gap-4">
                 {selectedProfile.profileType !== ProfileType.BUSINESS && (
                    <button className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition"
                        onClick={() => { setActiveChat(selectedProfile.id); setView('chat'); setSelectedProfile(null); }}
                    >
                        MENSAJE
                    </button>
                 )}
                 <button className="bg-slate-800 p-3.5 rounded-xl text-white hover:bg-pink-600 transition flex-1">
                    <Heart size={24} className="mx-auto"/>
                 </button>
              </div>

              <div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Sobre mí</h3>
                  <p className="text-slate-300 text-sm leading-7 font-light">
                      {selectedProfile.description || "Este usuario prefiere mantener el misterio."}
                  </p>
              </div>

              <div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Intereses</h3>
                  <div className="flex flex-wrap gap-2">
                      {selectedProfile.interests?.map(interest => (
                          <span key={interest} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-300">
                              {interest}
                          </span>
                      ))}
                  </div>
              </div>
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-3">
                 <div className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${selectedProfile.verificationLevel === 'Verificado' ? 'bg-green-900/10 border-green-900/30' : 'bg-slate-900 border-slate-800'}`}>
                    <Shield className={selectedProfile.verificationLevel === 'Verificado' ? 'text-green-500' : 'text-slate-600'} size={24} />
                    <span className="text-xs font-bold uppercase text-slate-400">Verificación</span>
                    <span className={`text-sm font-bold ${selectedProfile.verificationLevel === 'Verificado' ? 'text-green-400' : 'text-slate-500'}`}>
                        {selectedProfile.verificationLevel}
                    </span>
                 </div>
                 <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col items-center gap-2">
                    <TrendingUp className="text-amber-500" size={24} />
                    <span className="text-xs font-bold uppercase text-slate-400">Confianza</span>
                    <span className="text-sm font-bold text-white">{selectedProfile.trustScore}%</span>
                 </div>
              </div>

              {selectedProfile.gallery && selectedProfile.gallery.length > 0 && (
                  <div>
                      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Galería</h3>
                      <div className="grid grid-cols-3 gap-2">
                          {selectedProfile.gallery.map((img, i) => (
                              <div key={i} className="aspect-square bg-slate-800 rounded-lg overflow-hidden">
                                  <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                              </div>
                          ))}
                      </div>
                  </div>
              )}
           </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full z-30 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 relative ${view === item.id ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <item.icon size={24} strokeWidth={view === item.id ? 2.5 : 2} className={`transition-transform duration-300 ${view === item.id ? '-translate-y-1' : ''}`} />
            {view === item.id && <span className="absolute -bottom-2 w-1 h-1 bg-amber-500 rounded-full animate-fade-in"></span>}
          </button>
        ))}
        </div>
      </nav>
    </div>
  );
};

export default UserApp;
import React, { useState, useEffect, useRef } from 'react';
import { User, Event, ChatMessage, Post, Ticket, ProfileType, InvitationCode, IdentityMember, ReportCategory, SubscriptionTier } from '../types';
import { Home, Search, Calendar, MessageSquare, User as UserIcon, Bell, MoreVertical, Heart, Lock, Check, MessageCircle, Share2, Shield, CreditCard, Ticket as TicketIcon, TrendingUp, DollarSign, Image as ImageIcon, Send, Plus, Key, ArrowLeft, X, Copy, Camera, MapPin, Clock, LogOut, ArrowRight, Minus, Edit2, Save, Trash2, Ticket as Ticket2, Flame, Repeat, Star, Timer, AlertCircle, FileText, ChevronRight, Flag, AlertTriangle, Crown, CalendarPlus, Trophy, Sparkles, Video, Mic, Map, ShieldCheck, Play, Pause, Phone, ExternalLink, UserPlus } from 'lucide-react';
import { EVENTS, CHATS, POSTS, TICKETS } from '../data';
import LegalDocs from './LegalDocs';
import MembershipView from './MembershipView';

interface UserAppProps {
  user: User;
  allUsers: User[]; // New prop for Explore
  onLogout: () => void;
}

// --- Utility Components ---
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in-down-centered ${type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'} backdrop-blur-md`}>
    {type === 'success' ? <Check size={18} /> : <X size={18} />}
    <span className="text-sm font-medium">{message}</span>
  </div>
);

const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

// --- Engagement Components ---

// 1. Stories Component (DAU Booster)
const StoriesRail = ({ users, onAddStory, onViewStory }: { users: User[], onAddStory: () => void, onViewStory: (u: User) => void }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide">
            <div className="flex flex-col items-center gap-1 shrink-0 cursor-pointer" onClick={onAddStory}>
                <div className="w-16 h-16 rounded-full border-2 border-slate-800 bg-slate-900 flex items-center justify-center relative">
                    <Plus size={24} className="text-amber-500" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-amber-500 rounded-full border-2 border-black flex items-center justify-center text-black font-bold text-[10px]">+</div>
                </div>
                <span className="text-[10px] text-slate-400">Tu Historia</span>
            </div>
            {users.slice(0,5).map(u => (
                <div key={u.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group" onClick={() => onViewStory(u)}>
                    <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-pink-600 group-hover:scale-105 transition-transform">
                        <img src={u.publicPhoto} className="w-full h-full rounded-full object-cover border-2 border-black" />
                    </div>
                    <span className="text-[10px] text-white w-16 truncate text-center">{u.nickname}</span>
                </div>
            ))}
        </div>
    )
}

// STORY VIEWER (FULL SCREEN OVERLAY)
const StoryViewer = ({ user, onClose }: { user: User, onClose: () => void }) => {
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onClose();
                    return 100;
                }
                return prev + 2; // 50ms * 50 = 2.5s duration approx
            });
        }, 50);
        return () => clearInterval(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-fade-in">
            {/* Story Progress Bar */}
            <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden">
                    <div className="h-full bg-white transition-all duration-75 ease-linear" style={{width: `${progress}%`}}></div>
                </div>
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 z-20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/50 overflow-hidden">
                    <img src={user.publicPhoto} className="w-full h-full object-cover"/>
                </div>
                <div>
                    <span className="text-white font-bold text-sm shadow-black drop-shadow-md">{user.nickname}</span>
                    <span className="text-white/80 text-xs block shadow-black drop-shadow-md">Hace 2h</span>
                </div>
            </div>

            <button onClick={onClose} className="absolute top-8 right-4 z-20 text-white drop-shadow-md"><X size={24}/></button>

            {/* Content (Mock Image) */}
            <div className="flex-1 relative">
                <img src={`https://picsum.photos/seed/${user.id}/400/800`} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent pb-10">
                    <p className="text-white text-lg font-medium text-center">Disfrutando de la noche... ✨</p>
                </div>
            </div>
        </div>
    )
};

// 2. Profile Progress Widget (Gamification)
const ProgressWidget = ({ user, onClick }: { user: User, onClick: () => void }) => {
    const progress = user.verificationTier === 'L0: Unverified' ? 20 : user.verificationTier.includes('L1') ? 40 : user.verificationTier.includes('L2') ? 60 : user.verificationTier.includes('L3') ? 80 : 100;
    
    if (progress >= 100) return null; // Hide if complete

    return (
        <div onClick={onClick} className="mx-4 mb-6 bg-gradient-to-r from-slate-900 to-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer relative overflow-hidden group">
            <div className="flex justify-between items-center mb-2 relative z-10">
                <h4 className="text-sm font-bold text-white flex items-center gap-2"><Trophy size={16} className="text-amber-500"/> Completa tu perfil</h4>
                <span className="text-xs text-amber-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden relative z-10">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-1000" style={{width: `${progress}%`}}></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 relative z-10">Alcanza el 80% para aumentar tu visibilidad x2.</p>
            <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-600 group-hover:translate-x-1 transition z-10" />
        </div>
    )
}

// 3. Smart Notifications Dropdown
const SmartNotifications = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute top-12 right-4 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 animate-fade-in overflow-hidden">
            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notificaciones</span>
                <button onClick={onClose}><X size={14} className="text-slate-500"/></button>
            </div>
            <div className="max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-800 cursor-pointer flex gap-3 border-b border-slate-800/50">
                    <div className="bg-pink-900/20 p-2 rounded-full h-fit"><Heart size={14} className="text-pink-500"/></div>
                    <div>
                        <p className="text-xs text-white">A <strong>MarcoYSofia</strong> le gustó tu perfil.</p>
                        <span className="text-[10px] text-slate-500">Hace 2 min</span>
                    </div>
                </div>
                <div className="p-3 hover:bg-slate-800 cursor-pointer flex gap-3 border-b border-slate-800/50">
                    <div className="bg-amber-900/20 p-2 rounded-full h-fit"><MapPin size={14} className="text-amber-500"/></div>
                    <div>
                        <p className="text-xs text-white">Evento cerca: <strong>Cena Clandestina</strong> este viernes.</p>
                        <span className="text-[10px] text-slate-500">Hace 1 hora</span>
                    </div>
                </div>
                <div className="p-3 hover:bg-slate-800 cursor-pointer flex gap-3">
                    <div className="bg-green-900/20 p-2 rounded-full h-fit"><Shield size={14} className="text-green-500"/></div>
                    <div>
                        <p className="text-xs text-white">Tu verificación L2 ha sido aprobada.</p>
                        <span className="text-[10px] text-slate-500">Ayer</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Chat Component (ENHANCED) ---
interface ChatInterfaceProps { chatId: string; partner: User; onBack: () => void; currentUser: User; }
const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatId, partner, onBack, currentUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(CHATS[chatId] || []);
  const [input, setInput] = useState('');
  const [isEphemeral, setIsEphemeral] = useState(false); // Default OFF
  const [ephemeralTimer, setEphemeralTimer] = useState(24); // Hours
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Anti-Spam: Removed subscription check. Chat is free.
  // Kept a basic flood check just in case, but no upsell wall.
  const canSendMessage = true; 

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isEphemeral]);

  const handleSend = (type: 'text' | 'audio' | 'location' = 'text', content: string = input) => {
    if (!content.trim() && type === 'text') return;
    
    if (!canSendMessage) {
        alert("Límite de mensajes diarios alcanzado. Actualiza a Premium.");
        return;
    }

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`, 
      senderId: 'me', 
      text: type === 'text' ? content : (type === 'audio' ? 'Nota de voz' : 'Ubicación compartida'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      type: type,
      isEphemeral: isEphemeral,
      locationData: type === 'location' ? { lat: 4.6, lng: -74.0, label: 'Ubicación actual' } : undefined
    };

    setMessages([...messages, newMsg]);
    setInput('');
    setShowAttachMenu(false);
  };

  const toggleEphemeral = () => {
      const newState = !isEphemeral;
      setIsEphemeral(newState);
      setMessages(prev => [...prev, {
          id: `sys-${Date.now()}`,
          senderId: 'system',
          text: newState ? `🔒 Mensajes temporales: ${ephemeralTimer}h` : '🔓 Mensajes guardados en historial',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text'
      }]);
  };

  return (
    <div className="flex flex-col h-full bg-black animate-slide-in-right relative">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-20">
        <button onClick={onBack} className="text-slate-400 hover:text-white p-1 rounded-full"><ArrowLeft size={24} /></button>
        
        <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 relative">
            <img src={partner.publicPhoto} className="w-full h-full object-cover"/>
            {partner.verificationLevel !== 'Básico' && <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-slate-900 rounded-full w-3 h-3"></div>}
        </div>
        
        <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-sm flex items-center gap-1">
                {partner.nickname} 
                <ShieldCheck size={12} className={partner.verificationLevel === 'Básico' ? 'text-slate-500' : 'text-green-500'} />
            </h3>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Lock size={8} /> <span>E2EE</span>
                <span className="mx-1">•</span>
                <span className="text-green-400">En línea</span>
            </div>
        </div>
        
        {/* Header Actions */}
        <div className="flex gap-1">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"><Phone size={18}/></button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"><Video size={18}/></button>
            <button 
                onClick={toggleEphemeral} 
                className={`p-2 rounded-full transition-all border ${isEphemeral ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-slate-800 border-transparent text-slate-500'}`}
            >
                <Timer size={18} />
            </button>
        </div>
      </div>

      {/* Ephemeral Banner */}
      {isEphemeral && (
          <div className="text-center py-2 bg-slate-900/50 animate-fade-in border-b border-slate-800">
              <span className="text-[10px] text-amber-500 flex items-center justify-center gap-1 font-mono">
                  <Timer size={10} /> Autodestrucción en {ephemeralTimer}h
              </span>
          </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black">
        <div className="flex justify-center mb-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 max-w-xs text-center">
                <div className="flex justify-center mb-2"><Lock size={16} className="text-amber-500"/></div>
                <p className="text-[10px] text-slate-400 leading-tight">
                    Conversación protegida con cifrado de extremo a extremo. Solo tú y {partner.nickname} pueden leer esto.
                </p>
            </div>
        </div>

        {messages.map(msg => {
             const isSystem = msg.senderId === 'system';
             if (isSystem) return <div key={msg.id} className="flex justify-center my-4 opacity-70"><span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800 flex items-center gap-1"><AlertCircle size={10} /> {msg.text}</span></div>;
             
             const isMe = msg.senderId === 'me';
             
             return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl p-3 shadow-lg relative border ${isMe ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white border-amber-500/30' : 'bg-slate-800 text-slate-200 border-slate-700'}`}>
                        
                        {/* Special Types Handling */}
                        {msg.type === 'unlock_grant' && <div className="flex items-center gap-2 text-xs font-bold opacity-90 mb-1"><Lock size={12} /> CONTENIDO PRIVADO</div>}
                        
                        {msg.type === 'audio' && (
                            <div className="flex items-center gap-3 min-w-[150px]">
                                <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"><Play size={14} fill="currentColor" /></button>
                                <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <div className="w-1/3 h-full bg-white"></div>
                                </div>
                                <span className="text-[10px] font-mono">0:15</span>
                            </div>
                        )}

                        {msg.type === 'location' && (
                            <div className="rounded-lg overflow-hidden mb-1">
                                <div className="h-24 bg-slate-700 flex items-center justify-center relative">
                                    <MapPin size={24} className="text-red-500" />
                                    <span className="absolute bottom-1 right-2 text-[8px] bg-black/50 px-1 rounded text-white">Mapa</span>
                                </div>
                                <div className="p-2 bg-black/20 text-xs font-bold">{msg.locationData?.label || 'Ubicación'}</div>
                            </div>
                        )}

                        {msg.type === 'text' && <p className="text-sm">{msg.text}</p>}

                        {/* Metadata Footer */}
                        <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                            {msg.isEphemeral && <Timer size={8} />}
                            <span className="text-[10px]">{msg.timestamp}</span>
                            {isMe && <Check size={10} strokeWidth={3} className="text-white/80" />}
                        </div>
                    </div>
                </div>
             )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 sticky bottom-14 md:bottom-0 safe-area-bottom">
        {/* Attachment Menu */}
        {showAttachMenu && (
            <div className="absolute bottom-full left-4 mb-2 bg-slate-800 border border-slate-700 rounded-xl p-2 shadow-2xl flex gap-2 animate-fade-in">
                <button onClick={() => handleSend('location')} className="flex flex-col items-center gap-1 p-2 hover:bg-slate-700 rounded-lg w-16">
                    <div className="bg-green-600 p-2 rounded-full text-white"><MapPin size={18}/></div>
                    <span className="text-[9px] text-slate-300">Ubicación</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-700 rounded-lg w-16">
                    <div className="bg-blue-600 p-2 rounded-full text-white"><ImageIcon size={18}/></div>
                    <span className="text-[9px] text-slate-300">Foto</span>
                </button>
                <button className="flex flex-col items-center gap-1 p-2 hover:bg-slate-700 rounded-lg w-16">
                    <div className="bg-purple-600 p-2 rounded-full text-white"><Video size={18}/></div>
                    <span className="text-[9px] text-slate-300">Video</span>
                </button>
            </div>
        )}

        <div className="flex gap-2 items-center">
            <button onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2 text-slate-400 hover:text-white transition"><Plus size={24} className={`transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} /></button>
            
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-full px-4 py-2 flex items-center gap-2">
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Escribe un mensaje..."
                    className="bg-transparent text-white text-sm w-full focus:outline-none" 
                />
            </div>

            {input.trim() ? (
                <button onClick={() => handleSend('text')} className="bg-amber-500 text-black p-3 rounded-full hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"><Send size={20} /></button>
            ) : (
                <button 
                    onMouseDown={() => setIsRecording(true)} 
                    onMouseUp={() => { setIsRecording(false); handleSend('audio'); }}
                    className={`p-3 rounded-full transition ${isRecording ? 'bg-red-500 text-white scale-110' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                    <Mic size={20} />
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const UserApp: React.FC<UserAppProps> = ({ user, allUsers, onLogout }) => {
  const [view, setView] = useState<'home' | 'explore' | 'events' | 'chat' | 'profile' | 'finance' | 'membership'>('home');
  const [selectedProfile, setSelectedProfile] = useState<User | null>(null);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewingStory, setViewingStory] = useState<User | null>(null);
  const [exploreFilter, setExploreFilter] = useState<string>('Todos');
  
  // Data State
  const [events, setEvents] = useState<Event[]>(EVENTS);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  
  // Checkout & Event Management
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [checkoutEvent, setCheckoutEvent] = useState<Event | null>(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '', description: '', date: '', time: '', price: 0, maxAttendees: 50, location: '', image: '' });

  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editNickname, setEditNickname] = useState(user.nickname);
  const [editDescription, setEditDescription] = useState(user.description);
  const [userGallery, setUserGallery] = useState<string[]>(user.gallery || []);

  // Business Logic
  const [inviteType, setInviteType] = useState<ProfileType>(ProfileType.SINGLE);
  const [businessCodes, setBusinessCodes] = useState<InvitationCode[]>([{ code: 'VELVET-INV-01', type: ProfileType.SINGLE, generatedBy: user.id, expiresAt: '2024-03-01', isUsed: false }]);

  // Post Creation
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState<string[]>([]);
  const [isStoryMode, setIsStoryMode] = useState(false);

  // Verification
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState<IdentityMember[]>([{ fullName: '', dateOfBirth: '', idNumber: '', idPhotoUrl: '' }, { fullName: '', dateOfBirth: '', idNumber: '', idPhotoUrl: '' }]);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Legal Docs State
  const [showLegalDocs, setShowLegalDocs] = useState(false);

  // Reporting State
  const [isReporting, setIsReporting] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory>(ReportCategory.HARASSMENT);
  const [reportDescription, setReportDescription] = useState('');
  const [reportingPostId, setReportingPostId] = useState<string | null>(null); // Track if reporting a specific post

  const isBusiness = user.profileType === ProfileType.BUSINESS;
  const isCouple = user.profileType === ProfileType.COUPLE;
  
  // FILTER EXPLORE USERS
  const exploreTags = ['Todos', 'Parejas', 'Amistad', 'Eventos', 'Viajes', 'Fiestas Temáticas'];
  const exploreUsers = allUsers.filter(u => {
      if (u.id === user.id) return false;
      if (exploreFilter === 'Todos') return true;
      // Simple filter logic: check if user interests include filter
      return u.interests?.some(i => i.includes(exploreFilter)) || u.profileType === exploreFilter;
  });

  // Fix: Includes 100 for L4/Premium
  const currentProgress = user.verificationTier === 'L0: Unverified' ? 20 : 
                          user.verificationTier.includes('L1') ? 40 : 
                          user.verificationTier.includes('L2') ? 60 : 
                          user.verificationTier.includes('L3') ? 80 : 
                          100;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const handleCreatePost = () => { 
      if (!newPostText.trim() && newPostImages.length === 0) return; 
      
      if (isStoryMode) {
          // Simulate Story Creation
          showToast('Historia subida a tu perfil 📸');
          setIsCreatingPost(false);
          setNewPostText('');
          setNewPostImages([]);
          setIsStoryMode(false);
          return;
      }

      const newPost: Post = { 
          id: `p-${Date.now()}`, 
          userId: user.id, 
          content: newPostText, 
          likes: 0, 
          comments: 0, 
          timestamp: 'Ahora mismo', 
          images: newPostImages 
      }; 
      setPosts([newPost, ...posts]); 
      setNewPostText(''); 
      setNewPostImages([]); 
      setIsCreatingPost(false); 
      showToast('Publicación creada con éxito'); 
  };

  const addPostImage = () => { if (newPostImages.length >= 3) { showToast("Máximo 3 imágenes", 'error'); return; } setNewPostImages([...newPostImages, `https://picsum.photos/id/${Math.floor(Math.random()*200)}/800/600`]); };
  const handleShareToChat = (post: Post) => { showToast("Compartido en chats"); };
  const handleRepost = (post: Post) => { showToast("Recompartido en tu feed"); };
  const handleRateProfile = () => { showToast("Perfil calificado (+1 Trust Score)"); };
  const handleReactProfile = () => { showToast("Has reaccionado a este perfil ❤️‍🔥"); };
  const handleConnect = () => { showToast("Solicitud de conexión enviada 🤝"); setSelectedProfile(null); };
  
  const handleReportPost = (postId: string) => {
      setReportingPostId(postId);
      setIsReporting(true);
  };

  const confirmPurchase = () => { if (!checkoutEvent) return; const totalPrice = checkoutEvent.price * ticketQuantity; showToast(`¡Compra exitosa! (${ticketQuantity} entradas)`); setCheckoutEvent(null); setTicketQuantity(1); };
  const handleCreateEvent = () => { showToast("Evento creado exitosamente"); };
  const handleGenerateBusinessCode = () => { if (businessCodes.length >= 15) { showToast("Has alcanzado el límite de 15 códigos.", 'error'); return; } const prefix = inviteType === ProfileType.COUPLE ? 'CPL' : 'IND'; const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase(); setBusinessCodes([...businessCodes, { code: `${user.nickname.substring(0,3).toUpperCase()}-${prefix}-${randomStr}`, type: inviteType, generatedBy: user.id, expiresAt: '2024-03-01', isUsed: false }]); showToast(`Código generado. (${businessCodes.length + 1}/15)`); };
  const handleSubmitVerification = () => { setIsEncrypting(true); setTimeout(() => { setIsEncrypting(false); showToast("Datos encriptados y enviados exitosamente."); setIsVerifying(false); }, 2000); };
  const handleSaveProfile = () => { if (!editNickname.trim()) { showToast("Nickname inválido", 'error'); return; } if (userGallery.length === 0) { showToast("Mínimo 1 foto pública", 'error'); return; } user.nickname = editNickname; user.description = editDescription; user.gallery = userGallery; user.publicPhoto = userGallery[0]; setIsEditingProfile(false); showToast("Perfil actualizado"); };
  const handleOpenEventDetails = (event: Event) => { setSelectedEvent(event); };
  const handleProceedToCheckout = (event: Event) => { setSelectedEvent(null); setCheckoutEvent(event); setTicketQuantity(1); };
  const handleUploadGallery = () => { if (userGallery.length >= 6) { showToast("Límite de 6 fotos", 'error'); return; } const newImg = `https://picsum.photos/id/${Math.floor(Math.random()*200)+50}/800/800`; setUserGallery([...userGallery, newImg]); };
  const handleRemovePhoto = (index: number) => { const ng = [...userGallery]; ng.splice(index, 1); setUserGallery(ng); };
  
  const handleSyncCalendar = () => {
      showToast("Evento sincronizado con Google Calendar 📅");
  };

  const handleSubmitReport = () => {
      if(!reportDescription.trim()) {
          showToast("Debes describir el motivo.", 'error');
          return;
      }
      setIsReporting(false);
      setReportDescription('');
      setReportingPostId(null);
      showToast("Reporte enviado. Moderación revisará el caso.", 'success');
  };

  // Mix events into feed as Ads
  const getMixedFeed = () => {
      const feed: any[] = [];
      posts.forEach((post, index) => {
          feed.push({ ...post, type: 'post' });
          // Inject an event ad every 3 posts
          if ((index + 1) % 3 === 0 && events.length > 0) {
              const eventIndex = Math.floor(index / 3) % events.length;
              feed.push({ ...events[eventIndex], type: 'ad_event' });
          }
      });
      return feed;
  };

  const menuItems = isBusiness 
    ? [ { id: 'home', icon: Home }, { id: 'events', icon: Calendar }, { id: 'finance', icon: TrendingUp }, { id: 'profile', icon: UserIcon } ]
    : [ { id: 'home', icon: Home }, { id: 'explore', icon: Search }, { id: 'events', icon: Calendar }, { id: 'chat', icon: MessageSquare }, { id: 'profile', icon: UserIcon } ];

  if (view === 'membership') {
      return <MembershipView user={user} onBack={() => setView('profile')} />;
  }

  return (
    <div className="min-h-screen bg-black text-slate-200 pb-20 relative overflow-hidden font-sans selection:bg-amber-500/30">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showLegalDocs && <LegalDocs onClose={() => setShowLegalDocs(false)} />}
      {viewingStory && <StoryViewer user={viewingStory} onClose={() => setViewingStory(null)} />}

      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black font-black text-lg">K</div>
          <span className="font-bold text-white tracking-widest text-sm">KITANA</span>
        </div>
        <div className="flex gap-4 text-slate-300 relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="hover:text-amber-500 transition relative">
              <Bell size={22} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <SmartNotifications isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          <button onClick={onLogout} className="hover:text-white transition"><LogOut size={22} /></button>
        </div>
      </header>

      <main className="p-0 max-w-lg mx-auto md:border-x md:border-white/5 md:min-h-screen">
        
        {/* VIEW: HOME / FEED */}
        {view === 'home' && (
          <div className="animate-fade-in pb-4">
            
            {/* New Stories Rail */}
            <StoriesRail 
                users={exploreUsers} 
                onAddStory={() => { setIsStoryMode(true); setIsCreatingPost(true); }}
                onViewStory={(u) => setViewingStory(u)}
            />

            {/* Engagement Widget */}
            <ProgressWidget user={user} onClick={() => setView('profile')} />

            <div className="p-4 border-b border-slate-900 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-slate-700">
                    <img src={user.publicPhoto || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                </div>
                <button 
                    onClick={() => { setIsStoryMode(false); setIsCreatingPost(true); }}
                    className="flex-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-left px-5 py-3 rounded-full text-slate-400 text-sm transition-all shadow-inner"
                >
                    Comparte algo interesante...
                </button>
            </div>

            <div className="space-y-4 mt-4 px-2">
               {getMixedFeed().map((item, idx) => {
                  
                  // RENDER AD EVENT
                  if (item.type === 'ad_event') {
                      return (
                          <div key={`ad-${idx}`} onClick={() => handleOpenEventDetails(item)} className="bg-gradient-to-r from-slate-900 to-black border border-amber-900/30 rounded-2xl overflow-hidden cursor-pointer relative group">
                              <div className="absolute top-2 right-2 z-10 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">PUBLICIDAD SUGERIDA</div>
                              <img src={item.image} className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition" />
                              <div className="p-4">
                                  <div className="flex justify-between items-center mb-1">
                                      <h3 className="font-bold text-white text-lg">{item.title}</h3>
                                      <span className="text-amber-500 font-bold">{formatCOP(item.price)}</span>
                                  </div>
                                  <p className="text-slate-400 text-xs flex items-center gap-2"><Calendar size={12}/> {item.date}</p>
                              </div>
                          </div>
                      )
                  }

                  // RENDER POST
                  const post = item as Post;
                  const author = allUsers.find(u => u.id === post.userId) || user;
                  
                  return (
                     <div key={post.id} className="bg-[#0a0a0a] border border-slate-900 rounded-2xl overflow-hidden shadow-sm relative group">
                        <div className="flex items-center justify-between p-4 pb-2">
                           <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProfile(author)}>
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800"><img src={author.publicPhoto} className="w-full h-full object-cover"/></div>
                              <div>
                                 <div className="flex items-center gap-1"><span className="font-bold text-white text-sm hover:underline">{author.nickname}</span>{author.verificationLevel !== 'Básico' && <Check size={14} className="text-amber-500" />}</div>
                                 <div className="text-xs text-slate-500">{post.timestamp}</div>
                              </div>
                           </div>
                           
                           {/* Report Post Dropdown */}
                           <div className="relative group/menu">
                               <button className="text-slate-500 hover:text-white p-2"><MoreVertical size={18} /></button>
                               <div className="absolute right-0 top-full hidden group-hover/menu:block bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-20 w-32 overflow-hidden">
                                   <button onClick={() => handleReportPost(post.id)} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-slate-800 flex items-center gap-2"><Flag size={12}/> Reportar</button>
                               </div>
                           </div>
                        </div>
                        <div className="px-4 py-2 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</div>
                        {post.images && post.images.length > 0 && (
                           <div className="mt-2">
                              {post.images.length === 1 ? <img src={post.images[0]} className="w-full h-64 object-cover"/> : <div className="grid grid-cols-2 gap-0.5">{post.images.map((img, idx) => <img key={idx} src={img} className="w-full h-40 object-cover"/>)}</div>}
                           </div>
                        )}
                        <div className="px-4 py-3 flex items-center justify-between text-slate-400 border-t border-slate-900/50 mt-2">
                           <div className="flex gap-6">
                              <button className="flex items-center gap-2 hover:text-amber-500 transition group" title="Me prende">
                                 <Flame size={20} className="group-hover:fill-amber-500/20" /> 
                                 <span className="text-xs font-medium">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-2 hover:text-blue-400 transition" title="Comentar">
                                 <MessageCircle size={20} /> <span className="text-xs font-medium">{post.comments}</span>
                              </button>
                              <button onClick={() => handleRepost(post)} className="flex items-center gap-2 hover:text-green-500 transition" title="Recompartir en mi feed">
                                 <Repeat size={20} />
                              </button>
                           </div>
                           <button onClick={() => handleShareToChat(post)} className="hover:text-white transition" title="Enviar por chat">
                              <Send size={20} />
                           </button>
                        </div>
                     </div>
                  )
               })}
            </div>
          </div>
        )}

        {/* VIEW: EXPLORE (All Profile Types) */}
        {view === 'explore' && !isBusiness && (
          <div className="space-y-4 animate-fade-in px-4 pt-4">
             {/* AI Recommendations */}
             <div className="mb-4">
                 <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2"><Sparkles size={18} className="text-purple-500"/> Sugerencias IA</h3>
                 <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                     {exploreUsers.slice(0,3).map(u => (
                         <div key={u.id} onClick={() => setSelectedProfile(u)} className="w-32 shrink-0 bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-800">
                             <img src={u.publicPhoto} className="w-32 h-32 object-cover" />
                             <div className="p-2">
                                 <p className="text-xs text-white font-bold truncate">{u.nickname}</p>
                                 <p className="text-[10px] text-slate-500">95% Compatible</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>

             {/* FILTERS */}
             <div className="sticky top-[60px] z-30 bg-black/95 py-2 -mx-4 px-4 overflow-x-auto scrollbar-hide flex gap-2 border-b border-slate-900">
                 {exploreTags.map(tag => (
                     <button 
                        key={tag} 
                        onClick={() => setExploreFilter(tag)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition border ${exploreFilter === tag ? 'bg-white text-black border-white' : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                     >
                         {tag}
                     </button>
                 ))}
             </div>

             <h2 className="text-xl font-bold text-white mb-2">Explorar Comunidad</h2>
             <div className="grid grid-cols-2 gap-4">
                {exploreUsers.map(u => (
                  <div key={u.id} onClick={() => setSelectedProfile(u)} className="aspect-[3/4] rounded-2xl bg-slate-800 relative overflow-hidden cursor-pointer border border-white/5 group">
                     <img src={u.publicPhoto} className="w-full h-full object-cover opacity-90 transition group-hover:scale-105" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-4">
                        <h3 className="text-base font-bold text-white">{u.nickname}</h3>
                        <div className="flex gap-2">
                            <span className="text-[10px] bg-white/20 backdrop-blur px-2 py-0.5 rounded text-white">{u.profileType}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* ... (Other views: FINANCE, EVENTS, CHAT same as before) ... */}
        {view === 'finance' && isBusiness && (
            <div className="space-y-6 px-4 pt-4 animate-fade-in pb-10">
                <h2 className="text-2xl font-bold text-white mb-4">Finanzas del Establecimiento</h2>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-2 text-slate-400 text-xs uppercase font-bold"><DollarSign size={14} /> Ingresos Brutos</div>
                        <div className="text-xl font-bold text-white">{formatCOP(events.filter(e => e.creatorId === user.id).reduce((acc, e) => acc + (e.price * e.soldCount), 0))}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/40 to-slate-900 p-4 rounded-2xl border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2 text-green-400 text-xs uppercase font-bold"><TrendingUp size={14} /> Neto (92%)</div>
                        <div className="text-xl font-bold text-white">{formatCOP(events.filter(e => e.creatorId === user.id).reduce((acc, e) => acc + (e.price * e.soldCount), 0) * 0.92)}</div>
                    </div>
                </div>
                <div><h3 className="text-white font-bold text-sm mb-3">Desglose por Evento</h3><div className="space-y-3">{events.filter(e => e.creatorId === user.id).map(event => (<div key={event.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800"><div className="flex justify-between items-start mb-2"><h4 className="text-white font-bold text-sm truncate w-2/3">{event.title}</h4><span className="text-amber-500 font-bold text-sm">{formatCOP(event.price * event.soldCount)}</span></div><div className="text-xs text-slate-500 flex justify-between items-center"><span>{event.date}</span><span>{event.soldCount} entradas vendidas</span></div></div>))}</div></div>
            </div>
        )}

        {view === 'events' && (
             <div className="space-y-6 px-4 pt-4 animate-fade-in">
                <div className="flex justify-between items-center"><h2 className="text-2xl font-bold text-white">{isBusiness ? 'Gestión' : 'Agenda'}</h2>{!isBusiness && <span className="text-xs text-amber-500 uppercase font-bold tracking-widest">Próximos</span>}</div>
               {isBusiness ? (
                  <div className="space-y-6">
                      <div className="bg-slate-900/80 backdrop-blur p-5 rounded-2xl border border-slate-800 shadow-xl"><h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><Plus size={16} className="text-amber-500" /> Crear Evento</h3><div className="space-y-3"><input type="text" placeholder="Nombre del evento" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"/><textarea placeholder="Descripción del evento..." value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none resize-none h-24"/><div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] text-slate-500 mb-1 block">Fecha</label><input type="text" placeholder="DD/MM" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"/></div><div><label className="text-[10px] text-slate-500 mb-1 block">Hora</label><input type="time" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"/></div></div><div className="grid grid-cols-2 gap-3"><div className="relative"><span className="absolute left-4 top-3 text-slate-500 text-sm">$</span><input type="number" placeholder="Precio" value={newEvent.price || ''} onChange={e => setNewEvent({...newEvent, price: parseInt(e.target.value)})} className="w-full bg-black/50 border border-slate-700 rounded-xl pl-8 pr-4 py-3 text-sm text-white focus:border-amber-500 outline-none"/></div><input type="number" placeholder="Capacidad" value={newEvent.maxAttendees || ''} onChange={e => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})} className="w-full bg-black/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none"/></div><button onClick={() => setNewEvent({...newEvent, image: 'https://picsum.photos/id/123/800/400'})} className="w-full border border-dashed border-slate-700 rounded-xl p-3 text-slate-500 text-xs flex items-center justify-center gap-2 hover:text-white hover:border-slate-500 transition"><ImageIcon size={14} /> {newEvent.image ? 'Imagen Adjuntada (1/1)' : 'Adjuntar Imagen (Max 1)'}</button><button onClick={handleCreateEvent} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 rounded-xl text-sm hover:brightness-110 transition shadow-lg shadow-amber-500/20">Publicar Evento</button></div></div>
                      <div className="space-y-4"><h3 className="text-white font-bold text-sm">Historial de Eventos</h3>{events.filter(e => e.creatorId === user.id).map(event => (<div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4"><div className="flex justify-between items-start mb-2"><h4 className="text-white text-sm font-bold">{event.title}</h4><span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Activo</span></div><div className="flex justify-between text-xs text-slate-400 mb-2"><span>{event.date} • {event.time}</span><span>{formatCOP(event.price)}</span></div><div className="mt-3"><div className="flex justify-between text-[10px] text-slate-300 mb-1"><span>Vendidas: <span className="font-bold text-white">{event.soldCount}</span></span><span>Quedan: <span className="font-bold text-amber-500">{event.maxAttendees - event.soldCount}</span></span></div><div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-1000" style={{width: `${(event.soldCount / event.maxAttendees) * 100}%`}}></div></div></div></div>))}</div></div>
               ) : (
                  events.map(event => (
                    <div key={event.id} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative group">
                        <div className="h-48 bg-slate-800 relative overflow-hidden">
                            <img src={event.image} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt={event.title} />
                            <div className="absolute top-3 left-3"><span className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1"><Calendar size={12} /> {event.date}</span></div>
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-white text-xl leading-tight w-2/3">{event.title}</h3><div className="text-right"><span className="text-amber-500 font-bold text-lg block">{event.price > 0 ? formatCOP(event.price) : 'Gratis'}</span></div></div>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mb-5"><span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span><span className="flex items-center gap-1"><MapPin size={12}/> {event.location}</span></div>
                            <div className="flex gap-2">
                                <button onClick={() => handleOpenEventDetails(event)} className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 transition"><TicketIcon size={18} /> Ver Detalles</button>
                                <button onClick={handleSyncCalendar} className="bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 p-3.5 rounded-xl transition"><CalendarPlus size={20}/></button>
                            </div>
                        </div>
                    </div>
                  ))
               )}
             </div>
        )}

        {view === 'chat' && !isBusiness && (
           <div className="h-full flex flex-col animate-fade-in pt-4 px-2">
             {!activeChat ? (
               <div className="space-y-2"><h2 className="text-2xl font-bold text-white px-2 mb-4">Mensajes</h2>{Object.keys(CHATS).map(chatId => { const partner = allUsers.find(u => u.id === chatId); if (!partner) return null; const lastMsg = CHATS[chatId][CHATS[chatId].length - 1]; return ( <div key={chatId} onClick={() => setActiveChat(chatId)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-900/60 transition cursor-pointer border border-transparent hover:border-slate-800"> <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-800"> <img src={partner.publicPhoto} className="w-full h-full object-cover" /> </div> <div className="flex-1 min-w-0"> <div className="flex justify-between items-baseline mb-1"> <h3 className="font-bold text-white text-base">{partner.nickname}</h3> <span className="text-xs text-slate-500">{lastMsg.timestamp}</span> </div> <p className="text-sm text-slate-400 truncate flex items-center gap-1"> {lastMsg.type === 'unlock_grant' ? <><Lock size={12} className="text-amber-500"/> Contenido privado</> : lastMsg.text} </p> </div> </div> ); })} </div>
             ) : ( <ChatInterface chatId={activeChat} partner={allUsers.find(u => u.id === activeChat)!} onBack={() => setActiveChat(null)} currentUser={user} /> )}
           </div>
        )}

        {view === 'profile' && (
           <div className="px-4 pt-6 space-y-8 animate-fade-in pb-10">
              <div className="bg-gradient-to-b from-slate-900 to-black p-6 rounded-3xl border border-slate-800 text-center relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-amber-500/10 to-transparent"></div><div className="relative z-10 mx-auto w-24 h-24 mb-4"><img src={isEditingProfile && userGallery.length > 0 ? userGallery[0] : (user.publicPhoto || 'https://via.placeholder.com/150')} className="w-full h-full rounded-full object-cover border-4 border-slate-950 shadow-2xl" /><div className={`absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-900 ${user.verificationLevel !== 'Básico' ? 'bg-amber-500 text-black' : 'bg-slate-600 text-white'}`}>{user.verificationLevel !== 'Básico' ? <Check size={14} strokeWidth={4} /> : <Lock size={14} />}</div></div>{isEditingProfile ? (<div className="space-y-3 relative z-10"><input value={editNickname} onChange={(e) => setEditNickname(e.target.value)} className="bg-black/50 border border-slate-700 text-center font-black text-xl text-white rounded p-1 w-full" placeholder="Nickname"/><textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-black/50 border border-slate-700 text-sm text-slate-300 rounded p-2 w-full h-20 resize-none" placeholder="Bio..."/><div className="flex gap-2 justify-center"><button onClick={() => setIsEditingProfile(false)} className="bg-slate-800 px-4 py-2 rounded text-xs">Cancelar</button><button onClick={handleSaveProfile} className="bg-green-600 px-4 py-2 rounded text-xs font-bold text-white">Guardar</button></div></div>) : (<><div className="flex justify-center items-center gap-2"><h2 className="text-2xl font-black text-white">{user.nickname || 'Usuario'}</h2><button onClick={() => { setEditNickname(user.nickname); setEditDescription(user.description); setIsEditingProfile(true); }} className="text-slate-500 hover:text-white"><Edit2 size={16} /></button></div><div className="flex justify-center gap-2 mt-2 mb-4"><span className="px-3 py-1 rounded-full bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700">{user.profileType}</span>{user.isPremium && <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-bold shadow-lg shadow-amber-500/20">PREMIUM</span>}</div><p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">{user.description || "Sin descripción"}</p></>)}</div>
              
              {/* GAMIFICATION BADGES */}
              {user.badges && user.badges.length > 0 && (
                  <div className="flex justify-center gap-3">
                      {user.badges.map(b => (
                          <div key={b} className="bg-slate-900 border border-amber-500/30 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-amber-500 shadow-lg shadow-amber-900/10">
                              <Star size={10} fill="currentColor" /> {b}
                          </div>
                      ))}
                  </div>
              )}

              {/* MEMBERSHIP BANNER */}
              <div 
                onClick={() => setView('membership')}
                className="bg-gradient-to-r from-amber-600 to-amber-800 p-4 rounded-xl cursor-pointer shadow-lg shadow-amber-900/20 flex justify-between items-center group relative overflow-hidden"
              >
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="relative z-10 flex items-center gap-3">
                      <div className="bg-black/20 p-2 rounded-full">
                          <Crown size={24} className="text-white fill-white" />
                      </div>
                      <div>
                          <h3 className="font-bold text-white text-sm uppercase tracking-wide">Membresía & Estatus</h3>
                          <p className="text-xs text-amber-100">Gestionar plan: {user.subscriptionTier || 'GRATIS'}</p>
                      </div>
                  </div>
                  <ChevronRight className="text-white group-hover:translate-x-1 transition" />
              </div>

              {/* NEW VERIFICATION PROGRESS BAR */}
              <div onClick={() => setIsVerifying(true)} className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:bg-slate-800 transition">
                  <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Shield size={16} className={currentProgress === 100 ? 'text-green-500' : 'text-slate-400'} />
                        <span className="text-sm font-bold text-white">Verificación: {user.verificationTier || 'L0: Incompleto'}</span>
                      </div>
                      <ChevronRight size={16} className="text-slate-600" />
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${currentProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${currentProgress}%`}}></div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 text-right">Siguiente nivel: {currentProgress < 50 ? 'L2 Identidad' : currentProgress < 75 ? 'L3 Revisión' : 'Máximo alcanzado'}</p>
              </div>

              {/* LEGAL DOCS LINK */}
              <div onClick={() => setShowLegalDocs(true)} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-800 transition">
                  <div className="flex items-center gap-3">
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                          <FileText size={18} className="text-slate-400" />
                      </div>
                      <div>
                          <h4 className="text-white text-sm font-bold">Legal y Privacidad</h4>
                          <p className="text-[10px] text-slate-500">Términos, Habeas Data y Responsabilidad</p>
                      </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-600" />
              </div>

              <div><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-white text-lg">Galería Pública</h3>{isEditingProfile && (<button onClick={handleUploadGallery} className="text-amber-500 text-xs font-bold hover:bg-amber-500/10 px-3 py-1.5 rounded-lg transition flex items-center gap-1"><Plus size={14} /> AÑADIR</button>)}</div>{userGallery.length > 0 ? (<div className="grid grid-cols-3 gap-2">{userGallery.map((img, i) => (<div key={i} className="aspect-[3/4] bg-slate-800 rounded-xl overflow-hidden relative group"><img src={img} className="w-full h-full object-cover" alt="Gallery" />{isEditingProfile && (<button onClick={() => handleRemovePhoto(i)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700"><X size={12} /></button>)}</div>))}</div>) : (<div className="h-32 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 gap-2"><ImageIcon size={24} /><span className="text-xs">Sube tu primera foto para empezar</span></div>)}</div>
              <div className="bg-[#0f1115] rounded-3xl border border-slate-800 overflow-hidden"><div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between"><div className="flex items-center gap-3"><div className="bg-slate-900 p-2 rounded-lg"><Lock size={18} className="text-amber-500" /></div><div><h3 className="font-bold text-white text-sm">Identidad Privada</h3><p className="text-[10px] text-slate-500">Encriptado de extremo a extremo</p></div></div></div>{user.privateIdentity ? (<div className="divide-y divide-slate-800/50">{user.privateIdentity.map((member, idx) => (<div key={idx} className="p-5 flex items-center justify-between"><div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Miembro {idx + 1}</p><div className="text-sm text-white font-medium">{member.fullName}</div><div className="text-xs text-slate-400 mt-0.5">ID: •••• {member.idNumber.slice(-4)}</div><div className="text-xs text-slate-500 mt-0.5">Nac: {member.dateOfBirth}</div></div><div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-slate-600"><UserIcon size={18} /></div></div>))}</div>) : (<div className="p-6 text-center"><p className="text-slate-500 text-sm">No has proporcionado información privada.</p></div>)}</div>
              {!isBusiness && user.myInviteCodes && (<div className="bg-gradient-to-br from-amber-500/10 to-transparent rounded-3xl border border-amber-500/20 p-5"><h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ticket2 size={16} className="text-amber-500"/> Mis Pases de Invitación</h3><div className="space-y-2">{user.myInviteCodes.map((code, idx) => (<div key={idx} className={`p-3 rounded-xl border flex justify-between items-center group cursor-pointer ${code.isUsed ? 'bg-black/40 border-slate-800/50 opacity-60' : 'bg-black/60 border-amber-500/30'}`} onClick={() => !code.isUsed && navigator.clipboard.writeText(code.code) && showToast('Código copiado')}><div><code className={`text-sm font-mono block ${code.isUsed ? 'text-slate-500 line-through' : 'text-amber-500'}`}>{code.code}</code><span className="text-[10px] text-slate-600">Válido hasta: {code.expiresAt}</span></div>{code.isUsed ? (<span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">USADO</span>) : (<Copy size={14} className="text-slate-500 group-hover:text-white transition" />)}</div>))}<p className="text-[10px] text-slate-500 text-center mt-2">Comparte estos códigos solo con personas de confianza. Eres responsable de tus invitados.</p></div></div>)}
              {isBusiness && (<div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-5"><h3 className="font-bold text-white mb-4 flex items-center gap-2"><Key size={16} className="text-amber-500"/> Generador de Pases</h3><div className="flex gap-2 mb-4"><select value={inviteType} onChange={(e) => setInviteType(e.target.value as ProfileType)} className="bg-black border border-slate-700 rounded-xl px-4 py-2 text-xs text-white flex-1 outline-none focus:border-amber-500"><option value={ProfileType.SINGLE}>Individual</option><option value={ProfileType.COUPLE}>Pareja</option></select><button onClick={handleGenerateBusinessCode} className="px-4 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl hover:bg-amber-400 transition">GENERAR</button></div><div className="flex justify-between items-center text-xs text-slate-500 mb-2"><span>Códigos generados: {businessCodes.length}/15</span></div><div className="space-y-2">{businessCodes.map((code, idx) => (<div key={idx} className="bg-black/40 p-3 rounded-xl border border-slate-800/50 flex justify-between items-center group cursor-pointer" onClick={() => {navigator.clipboard.writeText(code.code); showToast('Código copiado')}}><div><code className="text-sm font-mono text-amber-500 block">{code.code}</code><span className="text-[10px] text-slate-600">{code.type}</span></div><Copy size={14} className="text-slate-600 group-hover:text-white transition" /></div>))}</div></div>)}
           </div>
        )}
      </main>

      {/* --- MODALS --- */}

      {/* REPORT USER MODAL */}
      {isReporting && (
          <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                      <div className="flex items-center gap-2 text-red-500">
                          <Flag size={20} />
                          <h3 className="font-bold">Reportar {reportingPostId ? 'Publicación' : 'Usuario'}</h3>
                      </div>
                      <button onClick={() => setIsReporting(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                  </div>
                  <div className="p-5 space-y-4">
                      <div className="bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex gap-3 items-start">
                          <AlertTriangle className="text-red-500 shrink-0 mt-1" size={16} />
                          <p className="text-xs text-red-200">
                              Tomamos cada reporte con seriedad. Falsos reportes pueden llevar a la suspensión de tu propia cuenta.
                          </p>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Motivo</label>
                          <select 
                            className="w-full bg-black border border-slate-700 rounded-lg p-3 text-sm text-white"
                            value={reportCategory}
                            onChange={(e) => setReportCategory(e.target.value as ReportCategory)}
                          >
                              {Object.values(ReportCategory).map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                              ))}
                          </select>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Descripción y Evidencia</label>
                          <textarea 
                             className="w-full bg-black border border-slate-700 rounded-lg p-3 text-sm text-white h-32 resize-none"
                             placeholder="Describe lo sucedido. Si es un chat, indica fecha y hora aproximada..."
                             value={reportDescription}
                             onChange={(e) => setReportDescription(e.target.value)}
                          />
                      </div>
                      
                      <button 
                        onClick={handleSubmitReport}
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition"
                      >
                          Enviar Reporte Confidencial
                      </button>
                  </div>
              </div>
          </div>
      )}

      {isVerifying && (<div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"><div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden my-auto shadow-2xl"><div className="p-5 border-b border-slate-800 bg-slate-950 flex justify-between items-center"><div><h3 className="font-bold text-white text-lg">Verificación Inteligente</h3><p className="text-xs text-slate-500">Sube de nivel para desbloquear confianza.</p></div><button onClick={() => setIsVerifying(false)} className="bg-slate-800 p-2 rounded-full text-slate-400 hover:text-white"><X size={18} /></button></div><div className="p-6 space-y-8"><div className="space-y-4"><div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">1</span><h4 className="text-white font-bold text-sm">Titular Principal</h4></div><input placeholder="Nombre Legal Completo" value={verificationData[0].fullName} onChange={(e) => { const n = [...verificationData]; n[0].fullName = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none"/><div className="grid grid-cols-2 gap-4"><div><label className="text-[10px] text-slate-500 block mb-1">Fecha Nacimiento</label><input type="date" value={verificationData[0].dateOfBirth} onChange={(e) => { const n = [...verificationData]; n[0].dateOfBirth = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"/></div><div><label className="text-[10px] text-slate-500 block mb-1">Doc. Identidad</label><input placeholder="DNI / Pasaporte" value={verificationData[0].idNumber} onChange={(e) => { const n = [...verificationData]; n[0].idNumber = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"/></div></div><button className="w-full border border-dashed border-slate-700 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 transition"><Camera size={18} /><span className="text-xs font-bold uppercase">Subir Foto Documento (L2)</span></button></div>{isCouple && (<div className="space-y-4 pt-4 border-t border-slate-800"><div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs flex items-center justify-center font-bold">2</span><h4 className="text-white font-bold text-sm">Pareja</h4></div><input placeholder="Nombre Legal Completo" value={verificationData[1].fullName} onChange={(e) => { const n = [...verificationData]; n[1].fullName = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-500 outline-none"/><div className="grid grid-cols-2 gap-4"><div><label className="text-[10px] text-slate-500 block mb-1">Fecha Nacimiento</label><input type="date" value={verificationData[1].dateOfBirth} onChange={(e) => { const n = [...verificationData]; n[1].dateOfBirth = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"/></div><div><label className="text-[10px] text-slate-500 block mb-1">Doc. Identidad</label><input placeholder="DNI / Pasaporte" value={verificationData[1].idNumber} onChange={(e) => { const n = [...verificationData]; n[1].idNumber = e.target.value; setVerificationData(n); }} className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none"/></div></div></div>)}<button onClick={handleSubmitVerification} disabled={isEncrypting} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/30 text-sm tracking-wide uppercase transition-all active:scale-95 flex items-center justify-center gap-2">{isEncrypting ? (<><Lock className="animate-pulse" size={16} /> Encriptando (AES-256)...</>) : "Solicitar Verificación L2"}</button><p className="text-[10px] text-center text-slate-500">Tus datos se encriptan en tu dispositivo antes de enviarse.</p></div></div></div>)}

      {selectedEvent && (<div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"><div className="bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"><div className="relative h-56 bg-slate-800 shrink-0"><img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} /><button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black transition"><X size={20} /></button></div><div className="p-6 overflow-y-auto"><h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2><div className="flex gap-4 text-sm text-slate-400 mb-4"><span className="flex items-center gap-1"><Calendar size={14}/> {selectedEvent.date}</span><span className="flex items-center gap-1"><Clock size={14}/> {selectedEvent.time}</span></div><p className="text-slate-300 text-sm leading-relaxed mb-6">{selectedEvent.description || "Sin descripción adicional."}</p><div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6"><div className="text-xs text-slate-500 uppercase font-bold mb-1">Ubicación</div><div className="text-white flex items-center gap-2"><MapPin size={16}/> {selectedEvent.location}</div></div></div><div className="p-4 border-t border-slate-800 bg-slate-950 mt-auto shrink-0"><button onClick={() => handleProceedToCheckout(selectedEvent)} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition">Comprar Entrada • {formatCOP(selectedEvent.price)}</button></div></div></div>)}

      {checkoutEvent && (<div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"><div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"><div className="h-32 bg-slate-800 relative"><img src={checkoutEvent.image} className="w-full h-full object-cover opacity-60" alt="Event" /><div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-slate-900 to-transparent"><h3 className="font-bold text-white text-lg leading-none">{checkoutEvent.title}</h3></div></div><div className="p-6 space-y-4"><div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800"><span className="text-slate-400 text-sm">Cantidad</span><div className="flex items-center gap-3"><button onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"><Minus size={14}/></button><span className="font-bold text-white w-4 text-center">{ticketQuantity}</span><button onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700"><Plus size={14}/></button></div></div><div className="flex justify-between items-center py-2 border-b border-slate-800"><span className="text-slate-400 text-sm">Total a Pagar</span><span className="text-2xl font-bold text-amber-500">{formatCOP(checkoutEvent.price * ticketQuantity)}</span></div><div className="bg-black border border-slate-800 p-4 rounded-xl flex items-center gap-3"><div className="bg-slate-800 p-2 rounded-lg"><CreditCard size={20} className="text-white"/></div><div className="flex-1"><div className="text-xs text-slate-500 uppercase font-bold">Método de Pago</div><div className="text-sm text-white">Visa •••• 4242</div></div><span className="text-xs text-amber-500 font-bold cursor-pointer">CAMBIAR</span></div><button onClick={confirmPurchase} className="w-full bg-white hover:bg-slate-200 text-black font-bold py-4 rounded-xl mt-2 flex justify-center items-center gap-2 transition"><Lock size={16} /> Confirmar Pago</button><button onClick={() => { setCheckoutEvent(null); setTicketQuantity(1); }} className="w-full text-slate-500 text-sm py-2 hover:text-white">Cancelar transacción</button></div></div></div>)}

      {/* CREATE POST MODAL (UPDATED) */}
      {isCreatingPost && (
          <div className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-md rounded-3xl border border-slate-800 shadow-2xl overflow-hidden transform transition-all">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                      <span className="font-bold text-white text-sm px-2">{isStoryMode ? 'Crear Historia' : 'Crear Publicación'}</span>
                      <button onClick={() => { setIsCreatingPost(false); setIsStoryMode(false); }} className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"><X size={20} /></button>
                  </div>
                  <div className="p-4">
                      <textarea 
                          className="w-full bg-transparent text-white resize-none h-32 focus:outline-none placeholder-slate-600 text-lg"
                          placeholder={isStoryMode ? "Comparte tu momento (desaparece en 24h)..." : "¿Con qué quieres provocar hoy?"}
                          value={newPostText}
                          onChange={(e) => setNewPostText(e.target.value)}
                          maxLength={250}
                          autoFocus
                      ></textarea>
                      <div className="text-right text-xs text-slate-500 mb-2">{newPostText.length}/250</div>
                      
                      {newPostImages.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-4">
                              {newPostImages.map((img, idx) => (
                                  <div key={idx} className="relative aspect-square bg-black rounded-lg overflow-hidden">
                                      <img src={img} className="w-full h-full object-cover" />
                                  </div>
                              ))}
                          </div>
                      )}

                      <div className="flex justify-between items-center mt-2 pt-4 border-t border-slate-800/50">
                          <button onClick={addPostImage} className="text-amber-500 p-2 rounded-full hover:bg-amber-500/10 transition flex items-center gap-2">
                             <ImageIcon size={22} /> <span className="text-xs">{newPostImages.length}/3</span>
                          </button>
                          <button 
                             onClick={handleCreatePost}
                             disabled={!newPostText.trim() && newPostImages.length === 0}
                             className={`bg-white text-black font-bold px-6 py-2 rounded-full flex items-center gap-2 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition ${isStoryMode ? 'border-2 border-amber-500' : ''}`}
                          >
                             {isStoryMode ? 'Subir Historia' : 'Publicar'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Profile Detail Modal (UPDATED with Actions) */}
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
              <div className="grid grid-cols-4 gap-2">
                 <button onClick={() => { setActiveChat(selectedProfile.id); setView('chat'); setSelectedProfile(null); }} className="col-span-2 bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2">
                    <MessageSquare size={18} /> Mensaje
                 </button>
                 
                 {/* Connect Button */}
                 <button onClick={handleConnect} className="col-span-2 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2">
                    <UserPlus size={18} /> Conectar
                 </button>

                 <button onClick={handleReactProfile} className="bg-slate-800 p-3.5 rounded-xl text-white hover:bg-pink-600 transition flex items-center justify-center col-span-2">
                    <Heart size={24} />
                 </button>
                 <button onClick={handleRateProfile} className="bg-slate-800 p-3.5 rounded-xl text-white hover:bg-yellow-500 transition flex items-center justify-center col-span-2">
                    <Star size={24} />
                 </button>
              </div>

              <div>
                  <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Sobre mí</h3>
                  <p className="text-slate-300 text-sm leading-7 font-light">
                      {selectedProfile.description || "Este usuario prefiere mantener el misterio."}
                  </p>
              </div>

              {/* BADGES ON PROFILE MODAL */}
              {selectedProfile.badges && selectedProfile.badges.length > 0 && (
                  <div>
                      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3">Reconocimientos</h3>
                      <div className="flex flex-wrap gap-2">
                          {selectedProfile.badges.map(b => (
                              <div key={b} className="bg-slate-900 border border-slate-700 px-3 py-1 rounded-full text-xs text-slate-300 flex items-center gap-2">
                                  <Trophy size={12} className="text-amber-500"/> {b}
                              </div>
                          ))}
                      </div>
                  </div>
              )}

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
                              <div key={i} className="aspect-square bg-slate-800 rounded-lg overflow-hidden relative group"><img src={img} className="w-full h-full object-cover" alt="Gallery" />{isEditingProfile && (<button onClick={() => handleRemovePhoto(i)} className="absolute top-1 right-1 bg-red-600 p-1 rounded-full text-white hover:bg-red-700"><X size={12} /></button>)}</div>
                          ))}
                      </div>
                  </div>
              )}
           </div>

           {/* REPORT BUTTON FOOTER */}
           <div className="p-4 bg-black border-t border-slate-900 flex justify-center pb-8">
               <button 
                 onClick={() => setIsReporting(true)}
                 className="flex items-center gap-2 text-slate-500 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition"
               >
                   <Flag size={14} /> Reportar Perfil
               </button>
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
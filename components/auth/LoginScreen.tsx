import React, { useState, useEffect } from 'react';
import { Crown, ArrowRight, UserPlus, ArrowLeft, Fingerprint, ShieldAlert, Lock, Check, FileText, ExternalLink, MapPin, Tag, Camera, LogIn, Building, HelpCircle, Send, X, Heart, Search } from 'lucide-react';
import { User, ProfileType, SubscriptionTier } from '../../types';
import LegalDocs from '../../views/LegalDocs';
import BusinessLanding from '../../views/BusinessLanding';

interface LoginScreenProps {
  onLogin: (pin: string) => void;
  onRegister: (user: User) => void;
  onBack?: () => void; // New optional prop for navigation
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, onBack }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login State
  const [pin, setPin] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [isBiometricCheck, setIsBiometricCheck] = useState(false);
  const [showBusinessLanding, setShowBusinessLanding] = useState(false); // Can still be accessed internally

  // Request Code Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [requestEmail, setRequestEmail] = useState('');

  // Register State (Optimized 3 Steps)
  // Step 1: Access (Invite + PIN)
  // Step 2: Identity (Type + Photo)
  // Step 3: Context (Location + Interests + Legal)
  const [regStep, setRegStep] = useState(1);
  const [regData, setRegData] = useState({
      inviteCode: '',
      pin: '',
      type: ProfileType.SINGLE,
      photoUrl: '',
      location: '',
      interests: [] as string[],
      seeking: [] as string[], // New field for what they are looking for
      legalAccepted: false
  });
  
  const [showLegalDocs, setShowLegalDocs] = useState(false);

  // --- LOGIN LOGIC ---
  const handleDigit = (digit: string) => {
    if (isLocked || isBiometricCheck) return;

    // Handle Registration PIN (Step 1)
    if (mode === 'register' && regStep === 1) {
        if (regData.pin.length < 6) {
            const next = regData.pin + digit;
            setRegData(prev => ({ ...prev, pin: next }));
        }
    } 
    // Handle Login PIN
    else if (mode === 'login') {
        if (pin.length < 6) {
            const next = pin + digit;
            setPin(next);
            if (next.length === 6) {
                setTimeout(() => startBiometricFlow(next), 300);
            }
        }
    }
  };

  const handleDelete = () => {
    if (mode === 'register' && regStep === 1) setRegData(prev => ({...prev, pin: prev.pin.slice(0, -1)}));
    else if (mode === 'login') setPin(prev => prev.slice(0, -1));
  };

  const startBiometricFlow = (validPin: string) => {
      setIsBiometricCheck(true);
      setTimeout(() => onLogin(validPin), 1500); 
  };

  // --- REGISTRATION LOGIC ---
  const handleNextStep = () => {
      if (regStep === 1) {
          if (regData.inviteCode.length < 4) return alert("Hmm, ese código no parece válido. Verifica con quien te invitó.");
          if (regData.pin.length < 6) return alert("Por seguridad, el PIN necesita 6 dígitos.");
          setRegStep(2);
      } else if (regStep === 2) {
          // Photo is optional for demo but good for UX
          setRegStep(3);
      } else if (regStep === 3) {
          if (!regData.legalAccepted) return alert("Para proteger a la comunidad, necesitamos que aceptes los términos.");
          if (!regData.location) return alert("Cuéntanos en qué ciudad estás para mostrarte eventos cercanos.");
          completeRegistration();
      }
  };

  const completeRegistration = () => {
      // Merge interests and seeking into one array for MVP, or handle separately if User type allows
      // For now, we'll merge them but maybe prefix 'Busco:' to seeking tags for clarity
      const mergedInterests = [
          ...regData.interests,
          ...regData.seeking.map(s => `Busco: ${s}`)
      ];

      const newUser: User = {
          id: regData.pin, 
          nickname: `Nuevo ${regData.type}`,
          profileType: regData.type,
          publicPhoto: regData.photoUrl || 'https://via.placeholder.com/400',
          gallery: [],
          description: 'Explorando con curiosidad y respeto.',
          location: regData.location,
          interests: mergedInterests,
          trustScore: 50,
          verificationLevel: 'Básico',
          verificationTier: 'L1: Básico (Email/Tel)',
          isPremium: false,
          subscriptionTier: SubscriptionTier.FREE,
          status: 'Pending',
          joinedDate: new Date().toISOString().split('T')[0],
          badges: ['Nuevo'], // Gamification start
          invitationQuota: 0
      };
      onRegister(newUser);
  };

  const handleRequestCode = (e: React.FormEvent) => {
      e.preventDefault();
      setRequestStatus('sending');
      setTimeout(() => setRequestStatus('sent'), 1500);
  };

  const offeringTags = ['Fiestas Temáticas', 'Viajes Lifestyle', 'Cenas Íntimas', 'Wellness & Spa', 'Arte & Cultura', 'Mixología'];
  const seekingTags = ['Parejas', 'Amistad', 'Eventos Exclusivos', 'Mentoria', 'Networking', 'Diversión'];

  const toggleInterest = (tag: string, type: 'interests' | 'seeking') => {
      if (type === 'interests') {
          if (regData.interests.includes(tag)) {
              setRegData(p => ({...p, interests: p.interests.filter(t => t !== tag)}));
          } else {
              setRegData(p => ({...p, interests: [...p.interests, tag]}));
          }
      } else {
          if (regData.seeking.includes(tag)) {
              setRegData(p => ({...p, seeking: p.seeking.filter(t => t !== tag)}));
          } else {
              setRegData(p => ({...p, seeking: [...p.seeking, tag]}));
          }
      }
  };

  // Allow internal navigation to Business Landing if invoked from Login Screen (legacy path)
  if (showBusinessLanding) {
      return <BusinessLanding 
          onBack={() => setShowBusinessLanding(false)} 
          onRegister={() => {
              setShowBusinessLanding(false);
              setMode('register');
              setRegData(prev => ({...prev, type: ProfileType.BUSINESS}));
          }} 
      />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative font-sans overflow-x-hidden">
      {/* Back Button to Main Landing */}
      {onBack && mode === 'login' && !isBiometricCheck && (
          <button 
            onClick={onBack} 
            className="absolute top-6 left-6 text-slate-500 hover:text-white flex items-center gap-2 text-sm font-medium transition z-10"
          >
            <ArrowLeft size={18} /> Inicio
          </button>
      )}

      {showLegalDocs && <LegalDocs onClose={() => setShowLegalDocs(false)} />}
      
      <div className="w-full max-w-md transition-all duration-500">
        
        {/* Header Logo (Shrinks in Reg Mode) */}
        <div className={`flex flex-col items-center transition-all duration-500 ${mode === 'register' ? 'mb-4 scale-90' : 'mb-12'}`}>
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-900/20">
            <Crown className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">KITANA</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest mt-1">Donde la curiosidad es segura</p>
        </div>

        {/* BIOMETRIC SIMULATION */}
        {isBiometricCheck && (
            <div className="flex flex-col items-center animate-fade-in py-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
                    <div className="bg-slate-900 p-6 rounded-full border border-amber-500 relative z-10">
                        <Fingerprint className="w-12 h-12 text-amber-500" />
                    </div>
                </div>
                <p className="text-amber-500 font-bold mt-6 tracking-widest text-xs uppercase">Validando identidad...</p>
            </div>
        )}

        {/* --- LOGIN MODE --- */}
        {mode === 'login' && !isBiometricCheck && (
            <div className="animate-fade-in-down">
                <div className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm shadow-2xl">
                    <p className="text-slate-400 text-center mb-6 text-sm font-medium">Bienvenido de nuevo. Tu PIN, por favor.</p>
                    <div className="flex justify-center gap-3 mb-8">
                        {[...Array(6)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < pin.length ? 'bg-amber-500 scale-125 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-700'}`} />
                        ))}
                    </div>

                    {/* Numpad */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <button key={num} onClick={() => handleDigit(num.toString())} className="h-14 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-white text-xl font-medium transition active:scale-95">{num}</button>
                        ))}
                        <div className="h-14"></div>
                        <button onClick={() => handleDigit('0')} className="h-14 rounded-2xl bg-slate-800/50 hover:bg-slate-800 text-white text-xl font-medium transition active:scale-95">0</button>
                        <button onClick={handleDelete} className="h-14 rounded-2xl bg-slate-800/50 hover:bg-red-900/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition active:scale-95">⌫</button>
                    </div>

                    <div className="pt-6 border-t border-slate-800">
                        <button onClick={() => setShowBusinessLanding(true)} className="flex items-center justify-center gap-2 text-slate-400 hover:text-white w-full transition group py-2 rounded-lg hover:bg-slate-800/50">
                            <Building size={16} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">Propuesta para Negocios</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-xs">¿Aún no eres miembro?</p>
                    <button onClick={() => setMode('register')} className="text-amber-500 font-bold text-sm mt-2 hover:underline">Aplicar a la comunidad</button>
                </div>

                {/* Quick Links for Demo */}
                <div className="mt-8 opacity-50 hover:opacity-100 transition">
                    <p className="text-[10px] text-center text-slate-600 mb-2 uppercase tracking-widest">Accesos Rápidos (Demo)</p>
                    <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto">
                        <button onClick={() => startBiometricFlow('000000')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-red-500 font-bold">ADMIN</button>
                        <button onClick={() => startBiometricFlow('111111')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-blue-500 font-bold">VERIF</button>
                        <button onClick={() => startBiometricFlow('999999')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-purple-500 font-bold">MOD</button>
                        <div className="w-full h-0"></div>
                        <button onClick={() => startBiometricFlow('222222')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">Single</button>
                        <button onClick={() => startBiometricFlow('555555')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-400">Pareja</button>
                        <button onClick={() => startBiometricFlow('444444')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-amber-500">Negocio</button>
                        <button onClick={() => startBiometricFlow('333333')} className="text-[9px] bg-slate-900 border border-slate-800 px-2 py-1 rounded text-slate-600">Nuevo</button>
                    </div>
                </div>
            </div>
        )}

        {/* --- REGISTER MODE (Optimized 3 Steps) --- */}
        {mode === 'register' && (
            <div className="animate-fade-in relative">
                <button onClick={() => setMode('login')} className="absolute -top-12 left-0 text-slate-500 hover:text-white flex items-center gap-1 text-xs"><ArrowLeft size={14}/> Regresar</button>
                
                {/* Progress Bar */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3].map(step => (
                        <div key={step} className={`h-1 flex-1 rounded-full transition-all duration-500 ${step <= regStep ? 'bg-amber-500' : 'bg-slate-800'}`}></div>
                    ))}
                </div>

                <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 backdrop-blur-md shadow-2xl overflow-hidden min-h-[400px] flex flex-col">
                    
                    {/* STEP 1: ACCESS */}
                    {regStep === 1 && (
                        <div className="animate-slide-in-right flex-1 flex flex-col">
                            <h2 className="text-xl font-bold text-white mb-1">Tu Llave de Acceso</h2>
                            <p className="text-slate-400 text-xs mb-6">Kitana es una comunidad privada. Ingresa tu invitación.</p>
                            
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Código de Invitación</label>
                                    <input 
                                        value={regData.inviteCode}
                                        onChange={(e) => setRegData({...regData, inviteCode: e.target.value.toUpperCase()})}
                                        placeholder="EJ: KITANA-GUEST"
                                        className="w-full bg-black border border-slate-700 rounded-xl px-4 py-3 text-white font-mono placeholder:text-slate-700 focus:border-amber-500 outline-none uppercase"
                                    />
                                    <button onClick={() => setShowRequestModal(true)} className="text-[10px] text-amber-500 font-bold mt-2 hover:underline flex items-center gap-1">
                                        <HelpCircle size={12}/> ¿No tienes código? Solicítalo aquí
                                    </button>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Configura tu PIN (6 dígitos)</label>
                                    <div className="flex gap-2 justify-center my-4 bg-black/50 p-4 rounded-xl">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className={`w-3 h-3 rounded-full transition-all ${i < regData.pin.length ? 'bg-amber-500' : 'bg-slate-800'}`} />
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {[1,2,3,4,5].map(n => <button key={n} onClick={() => handleDigit(n.toString())} className="bg-slate-800 p-2 rounded text-white text-sm">{n}</button>)}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 mt-2">
                                        {[6,7,8,9,0].map(n => <button key={n} onClick={() => handleDigit(n.toString())} className="bg-slate-800 p-2 rounded text-white text-sm">{n}</button>)}
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleNextStep} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors">Continuar <ArrowRight size={16}/></button>
                        </div>
                    )}

                    {/* STEP 2: IDENTITY */}
                    {regStep === 2 && (
                        <div className="animate-slide-in-right flex-1 flex flex-col">
                            <h2 className="text-xl font-bold text-white mb-1">Tu Perfil</h2>
                            <p className="text-slate-400 text-xs mb-6">¿Cómo te identificarás en la comunidad?</p>

                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {Object.values(ProfileType).map((type) => (
                                    <button 
                                        key={type}
                                        onClick={() => setRegData({...regData, type})}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${regData.type === type ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${regData.type === type ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                                        <span className="text-[10px] font-bold">{type}</span>
                                    </button>
                                ))}
                            </div>

                            <div 
                                onClick={() => setRegData({...regData, photoUrl: 'https://picsum.photos/400/400'})}
                                className="flex-1 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-amber-500/50 transition group"
                            >
                                {regData.photoUrl ? (
                                    <img src={regData.photoUrl} className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100" />
                                ) : (
                                    <>
                                        <div className="bg-slate-800 p-4 rounded-full mb-3 group-hover:scale-110 transition"><Camera size={24} className="text-slate-400 group-hover:text-amber-500" /></div>
                                        <span className="text-xs text-slate-500">Seleccionar foto de portada</span>
                                    </>
                                )}
                            </div>
                            <button onClick={handleNextStep} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors">Continuar <ArrowRight size={16}/></button>
                        </div>
                    )}

                    {/* STEP 3: CONTEXT & INTERESTS */}
                    {regStep === 3 && (
                        <div className="animate-slide-in-right flex-1 flex flex-col overflow-y-auto custom-scrollbar pr-1">
                            <h2 className="text-xl font-bold text-white mb-1">Personalización</h2>
                            <p className="text-slate-400 text-xs mb-6">Diseña tu experiencia y mejora tus matches.</p>

                            <div className="space-y-6 flex-1">
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Ubicación</label>
                                    <div className="flex items-center gap-2 bg-black border border-slate-700 rounded-xl px-4 py-3">
                                        <MapPin size={16} className="text-amber-500" />
                                        <input 
                                            value={regData.location}
                                            onChange={(e) => setRegData({...regData, location: e.target.value})}
                                            placeholder="Tu ciudad base (Ej: Bogotá)"
                                            className="bg-transparent text-white text-sm outline-none w-full"
                                        />
                                    </div>
                                </div>

                                {/* Offering / Mis Gustos */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Heart size={12} className="text-pink-500"/> Mis Gustos / Lo que ofrezco
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {offeringTags.map(tag => (
                                            <button 
                                                key={tag}
                                                onClick={() => toggleInterest(tag, 'interests')}
                                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${regData.interests.includes(tag) ? 'bg-pink-900/40 text-white border-pink-500 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Seeking / Lo que busco */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Search size={12} className="text-blue-500"/> Lo que busco
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {seekingTags.map(tag => (
                                            <button 
                                                key={tag}
                                                onClick={() => toggleInterest(tag, 'seeking')}
                                                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${regData.seeking.includes(tag) ? 'bg-blue-900/40 text-white border-blue-500 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'}`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${regData.legalAccepted ? 'bg-green-500 border-green-500 text-black' : 'border-slate-600 group-hover:border-slate-400'}`}>
                                            {regData.legalAccepted && <Check size={14} strokeWidth={4} />}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={regData.legalAccepted} onChange={() => setRegData({...regData, legalAccepted: !regData.legalAccepted})} />
                                        <span className="text-xs text-slate-400">Certifico ser mayor de 18 años y acepto el <span onClick={(e) => {e.stopPropagation(); setShowLegalDocs(true)}} className="text-amber-500 underline hover:text-amber-400 cursor-pointer">código de conducta</span>.</span>
                                    </label>
                                </div>
                            </div>
                            <button onClick={handleNextStep} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-amber-500/20 transition-all">
                                Solicitar Acceso <Check size={16}/>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        )}

      </div>

      {/* --- REQUEST CODE MODAL (USER) --- */}
      {showRequestModal && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-sm rounded-2xl border border-slate-800 shadow-2xl relative">
                   <button onClick={() => setShowRequestModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                   
                   {requestStatus === 'sent' ? (
                       <div className="p-8 text-center">
                           <div className="w-14 h-14 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                               <Check size={28} />
                           </div>
                           <h3 className="text-lg font-bold text-white mb-2">Solicitud Recibida</h3>
                           <p className="text-slate-400 text-sm mb-6">
                               Hemos enviado tu solicitud. Si hay cupos disponibles en tu ciudad, recibirás tu código en <strong>{requestEmail}</strong>.
                           </p>
                           <button onClick={() => { setShowRequestModal(false); setRequestStatus('idle'); }} className="bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-bold">Cerrar</button>
                       </div>
                   ) : (
                       <div className="p-6">
                           <h3 className="text-lg font-bold text-white mb-2">Solicitar Código</h3>
                           <p className="text-sm text-slate-400 mb-6">Kitana es una comunidad exclusiva. Cuéntanos por qué quieres unirte.</p>
                           
                           <form onSubmit={handleRequestCode} className="space-y-4">
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Correo Electrónico</label>
                                   <input required type="email" value={requestEmail} onChange={e => setRequestEmail(e.target.value)} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white text-sm outline-none" placeholder="tucorreo@ejemplo.com"/>
                               </div>
                               <div>
                                   <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Motivación</label>
                                   <textarea className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white text-sm outline-none resize-none h-20" placeholder="Busco conectar con personas afines..."></textarea>
                               </div>
                               <button disabled={requestStatus === 'sending'} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                                   {requestStatus === 'sending' ? 'Enviando...' : <><Send size={16}/> Enviar Solicitud</>}
                               </button>
                           </form>
                       </div>
                   )}
              </div>
          </div>
      )}

    </div>
  );
};

export default LoginScreen;
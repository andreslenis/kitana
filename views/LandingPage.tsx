import React from 'react';
import { ArrowRight, User, Building, Shield, Lock, Heart, MapPin, Star } from 'lucide-react';

interface LandingPageProps {
  onUserEnter: () => void;
  onBusinessEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onUserEnter, onBusinessEnter }) => {
  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans relative overflow-x-hidden animate-fade-in selection:bg-amber-500/30">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg shadow-[0_0_15px_rgba(245,158,11,0.5)]">K</div>
            <span className="font-bold text-white tracking-widest text-sm">KITANA</span>
        </div>
        <button onClick={onUserEnter} className="text-sm font-bold text-slate-400 hover:text-white transition">
            Iniciar Sesión
        </button>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20 w-full">
        
        {/* Main Hero Text */}
        <div className="text-center mb-16 space-y-4 animate-fade-in-down">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight break-words">
                Curiosidad <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 whitespace-nowrap">Segura</span>.
            </h1>
            <p className="text-sm md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light px-4">
                La comunidad privada más exclusiva de Latinoamérica. <br className="hidden md:block"/>
                Verificación real, conexiones auténticas y eventos de alto nivel.
            </p>
        </div>

        {/* Split Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* USER CARD */}
            <div 
                onClick={onUserEnter}
                className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-[320px]"
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight className="text-amber-500 -rotate-45 group-hover:rotate-0 transition-transform duration-500" size={32} />
                </div>
                
                <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                        <User className="text-black" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Personas & Parejas</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Únete para explorar eventos, conectar con miembros verificados y vivir experiencias lifestyle en un entorno protegido.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 md:gap-3 opacity-80 md:opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded text-slate-300"><Shield size={10} className="text-green-500"/> Identidad Verificada</div>
                    <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded text-slate-300"><Lock size={10} className="text-amber-500"/> Chat E2EE</div>
                    <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded text-slate-300"><Heart size={10} className="text-pink-500"/> Match IA</div>
                </div>
            </div>

            {/* BUSINESS CARD */}
            <div 
                onClick={onBusinessEnter}
                className="group relative bg-slate-900/50 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-8 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-[320px]"
            >
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <ArrowRight className="text-blue-500 -rotate-45 group-hover:rotate-0 transition-transform duration-500" size={32} />
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Building className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Establecimientos</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Gestiona aforos, vende entradas sin fraude y atrae a una audiencia de alto valor con herramientas de CRM y Analytics.
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-2 md:gap-3 opacity-80 md:opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded text-slate-300"><Star size={10} className="text-amber-500"/> Usuarios Calificados</div>
                    <div className="flex items-center gap-1 text-[10px] bg-black/40 px-2 py-1 rounded text-slate-300"><MapPin size={10} className="text-blue-500"/> Geo-Marketing</div>
                </div>
            </div>

        </div>

        {/* Footer Trust Indicators */}
        <div className="mt-20 border-t border-slate-800 pt-10 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">Tecnología de Seguridad</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-16 opacity-40 grayscale px-4">
                {['AES-256 Encryption', 'Biometric Auth', 'Google Gemini AI', 'Zero-Knowledge Proof'].map((tech, i) => (
                    <span key={i} className="text-xs md:text-sm font-bold text-slate-300">{tech}</span>
                ))}
            </div>
            <p className="text-[10px] text-slate-600 mt-12">© 2024 Kitana Platform Inc. Todos los derechos reservados.</p>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;
import React, { useState } from 'react';
import { Crown, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (pin: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 6) {
        setTimeout(() => onLogin(newPin), 300);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-900/20">
            <Crown className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Kitana</h1>
          <p className="text-slate-400 text-sm">Comunidad Privada Exclusiva</p>
        </div>

        {/* PIN Display */}
        <div className="mb-10 text-center">
          <p className="text-slate-500 mb-6 text-sm">Ingresa tu PIN de acceso</p>
          <div className="flex justify-center gap-4">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full border border-slate-700 transition-all duration-300 ${i < pin.length ? 'bg-amber-500 border-amber-500 scale-110 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-900'}`}
              />
            ))}
          </div>
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num}
              onClick={() => handleDigit(num.toString())}
              className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-white text-xl font-medium hover:bg-slate-800 hover:border-amber-500/50 hover:text-amber-500 transition-all active:scale-95 flex items-center justify-center shadow-lg"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16"></div>
          <button 
            onClick={() => handleDigit('0')}
            className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-white text-xl font-medium hover:bg-slate-800 hover:border-amber-500/50 hover:text-amber-500 transition-all active:scale-95 flex items-center justify-center shadow-lg"
          >
            0
          </button>
          <button 
            onClick={handleDelete}
            className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-red-900/20 hover:border-red-500/50 transition-all active:scale-95 flex items-center justify-center shadow-lg"
          >
            ⌫
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
            <p className="text-slate-600 text-xs">Acceso reservado a miembros verificados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
import React, { useState } from 'react';
import { User, VerificationRequest } from '../types';
import { LogOut, CheckCircle, XCircle, Shield, Eye, Lock, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { VERIFICATIONS } from '../data';

interface VerifierPanelProps {
  user: User | null;
  onLogout: () => void;
}

const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
};

const VerifierPanel: React.FC<VerifierPanelProps> = ({ user, onLogout }) => {
  const [verifications, setVerifications] = useState<VerificationRequest[]>(VERIFICATIONS);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeIdentity = async (targetUser: User) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      if (!process.env.API_KEY) {
        setTimeout(() => { setAiAnalysis("⚠️ SIMULACIÓN: Documentación coherente. Riesgo BAJO."); setIsAnalyzing(false); }, 1000);
        return;
      }
      const privateDataStr = targetUser.privateIdentity ? targetUser.privateIdentity.map(m => `[${m.fullName}, ${m.dateOfBirth}, ID:${m.idNumber}]`).join('\n') : 'N/A';
      const prompt = `Analiza riesgo verificación: Privado: ${privateDataStr}. Público: ${targetUser.nickname}, ${targetUser.profileType}, ${targetUser.description}. Calcula edad real.`;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAiAnalysis(response.text || "Error análisis.");
    } catch (error) { setAiAnalysis("Error IA."); } finally { if (process.env.API_KEY) setIsAnalyzing(false); }
  };

  const handleDecision = (id: string, status: 'Approved' | 'Rejected') => {
      setVerifications(verifications.map(v => v.id === id ? {...v, status} : v));
      setSelectedVerification(null);
  };

  const pendingList = verifications.filter(v => v.status === 'Pending');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="bg-slate-950 border-b border-slate-900 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500 w-5 h-5" />
          <h1 className="text-white font-bold">Panel Verificador</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm"><LogOut size={16} /> Salir</button>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <aside className="w-80 border-r border-slate-900 overflow-y-auto bg-slate-950/50">
          <div className="p-4 border-b border-slate-900 sticky top-0 bg-slate-950 z-10 flex justify-between">
             <h3 className="font-semibold text-white text-sm">Solicitudes ({pendingList.length})</h3>
          </div>
          <div>
            {pendingList.map(req => (
              <div key={req.id} onClick={() => { setSelectedVerification(req); setAiAnalysis(null); }} className={`p-4 border-b border-slate-900 cursor-pointer hover:bg-slate-900/80 ${selectedVerification?.id === req.id ? 'bg-slate-900 border-l-2 border-l-blue-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800"><img src={req.user.publicPhoto} className="w-full h-full object-cover" /></div>
                  <div><h4 className="font-medium text-white text-sm">{req.user.nickname}</h4><span className="text-[10px] text-slate-500">{req.submittedAt.split('T')[0]}</span></div>
                </div>
              </div>
            ))}
            {pendingList.length === 0 && <div className="p-8 text-center text-slate-600 text-xs">No hay solicitudes pendientes.</div>}
          </div>
        </aside>

        <main className="flex-1 bg-black p-8 overflow-y-auto custom-scrollbar">
          {selectedVerification ? (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <h2 className="text-xl font-bold text-white">Solicitud #{selectedVerification.id}</h2>
                <div className="flex gap-3">
                  <button onClick={() => handleDecision(selectedVerification.id, 'Rejected')} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-bold">RECHAZAR</button>
                  <button onClick={() => handleDecision(selectedVerification.id, 'Approved')} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold">APROBAR</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Private */}
                <div className="bg-[#0f1115] rounded-xl border border-red-900/30 overflow-hidden">
                   <div className="p-3 border-b border-red-900/20 bg-red-950/10 flex items-center gap-2 text-red-400"><Lock size={14} /><span className="font-bold text-xs">DATOS PRIVADOS</span></div>
                   <div className="p-5 space-y-6">
                      {selectedVerification.user.privateIdentity?.map((member, idx) => (
                          <div key={idx} className="flex gap-4 p-3 bg-black/40 rounded-lg border border-slate-800/50">
                             <div className="space-y-1">
                                 <span className="text-white font-mono text-sm block">{member.fullName}</span>
                                 <span className={`font-mono text-sm block font-bold ${calculateAge(member.dateOfBirth) < 18 ? 'text-red-500' : 'text-green-400'}`}>{calculateAge(member.dateOfBirth)} años ({member.dateOfBirth})</span>
                                 <span className="text-slate-300 font-mono text-sm block">ID: {member.idNumber}</span>
                             </div>
                          </div>
                      ))}
                      {!selectedVerification.user.privateIdentity?.length && <p className="text-slate-500 italic">Sin datos privados (Error)</p>}
                   </div>
                </div>

                {/* Public */}
                <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                   <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2 text-blue-400"><Eye size={14} /><span className="font-bold text-xs">PERFIL PÚBLICO</span></div>
                   <div className="p-5">
                      <div className="flex items-start gap-4 mb-4">
                          <img src={selectedVerification.user.publicPhoto} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" />
                          <div><h3 className="text-lg font-bold text-white">{selectedVerification.user.nickname}</h3><span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{selectedVerification.user.profileType}</span></div>
                      </div>
                      <div className="bg-black/30 p-3 rounded-lg text-sm text-slate-300 italic mb-4 border border-slate-800/50">"{selectedVerification.user.description}"</div>
                   </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
                  <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-indigo-100 text-sm flex items-center gap-2"><BrainCircuit size={16}/> Agente IA</h3>
                      <button onClick={() => analyzeIdentity(selectedVerification.user)} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded">Analizar</button>
                  </div>
                  <div className="text-sm text-slate-300 font-mono bg-black/30 p-3 rounded">{aiAnalysis || "Esperando análisis..."}</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600/50"><Shield size={64} /><p className="mt-4">Selecciona una solicitud</p></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VerifierPanel;
import React, { useState } from 'react';
import { User, VerificationRequest, VerificationTier } from '../types';
import { LogOut, CheckCircle, XCircle, Shield, Eye, Lock, BrainCircuit, Key, FileText, Smartphone, Camera, Video, AlertTriangle, TrendingUp, ChevronRight } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { VERIFICATIONS } from '../data';

interface VerifierPanelProps {
  user: User | null;
  onLogout: () => void;
}

// Trust Score Logic
const calculateTrustScore = (user: User, tier: VerificationTier): { score: number, breakdown: { label: string, val: number }[] } => {
    let score = 10; // Base Score
    const breakdown = [{ label: 'Base', val: 10 }];

    // 1. Verification Tier
    if (tier.includes('L1')) { score += 10; breakdown.push({ label: 'L1: Datos Contacto', val: 10 }); }
    if (tier.includes('L2')) { score += 25; breakdown.push({ label: 'L2: ID Documental', val: 25 }); }
    if (tier.includes('L3')) { score += 15; breakdown.push({ label: 'L3: Revisión Humana', val: 15 }); }
    if (tier.includes('L4')) { score += 20; breakdown.push({ label: 'L4: Video Call', val: 20 }); }

    // 2. Account Age
    const joined = new Date(user.joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joined.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 30) { score += 10; breakdown.push({ label: '> 30 días antigüedad', val: 10 }); }
    if (diffDays > 180) { score += 10; breakdown.push({ label: '> 6 meses antigüedad', val: 10 }); }

    // 3. Premium
    if (user.isPremium) { score += 10; breakdown.push({ label: 'Membresía Premium', val: 10 }); }

    // 4. Reports (Penalty)
    const reports = user.reportsReceived || 0;
    if (reports > 0) { 
        const penalty = reports * 20;
        score -= penalty; 
        breakdown.push({ label: `Reportes (${reports})`, val: -penalty }); 
    }

    return { score: Math.min(100, Math.max(0, score)), breakdown };
};

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
  const [aiAnalysis, setAiAnalysis] = useState<{text: string, risk: 'Low'|'Medium'|'High'} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false); 

  // New State for Tier Selection
  const [proposedTier, setProposedTier] = useState<VerificationTier>('L2: Identidad (ID+Selfie)');

  const analyzeIdentity = async (targetUser: User, req: VerificationRequest) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      // --- SYSTEM INSTRUCTION FOR GEMINI ---
      const systemInstruction = `
        Eres un experto Analista de Identidad y Fraude para una plataforma comunitaria.
        Tu objetivo es detectar inconsistencias, menores de edad, o documentos falsos.
        
        Analiza los siguientes puntos de datos:
        1. COHERENCIA BIOMÉTRICA: Compara la descripción de la 'Selfie' (simulada) con la 'Foto ID'. ¿Coinciden edad y rasgos?
        2. ANÁLISIS DOCUMENTAL: Busca patrones de Photoshop, fuentes inconsistentes en el ID.
        3. EDAD APARENTE: Estima la edad visual. ¿Es > 18?
        4. PERFIL: ¿La descripción pública coincide con la demografía privada?

        Responde en formato JSON:
        {
            "match_confidence": "0-100%",
            "apparent_age_check": "PASS/FAIL",
            "red_flags": ["lista", "de", "alertas"],
            "risk_level": "LOW/MEDIUM/HIGH",
            "recommendation": "Texto breve"
        }
      `;

      // Simulating context passed to AI
      const promptContext = `
        DATOS PRIVADOS: ${targetUser.privateIdentity?.map(m => `Nombre: ${m.fullName}, Nacimiento: ${m.dateOfBirth}, ID: ${m.idNumber}`).join(' | ')}.
        PERFIL PÚBLICO: ${targetUser.nickname}, Tipo: ${targetUser.profileType}.
        IMAGEN ID: [Base64 Simulada]
        SELFIE USUARIO: [Base64 Simulada]
      `;

      if (!process.env.API_KEY) {
        // --- SIMULATED RESPONSE (MOCK) ---
        setTimeout(() => { 
            const age = calculateAge(targetUser.privateIdentity?.[0].dateOfBirth || '2000-01-01');
            const isAdult = age >= 18;
            
            setAiAnalysis({
                risk: isAdult ? 'Low' : 'High',
                text: JSON.stringify({
                    match_confidence: "98%",
                    apparent_age_check: isAdult ? "PASS" : "FAIL",
                    estimated_visual_age: `${age-2}-${age+2} años`,
                    red_flags: isAdult ? [] : ["Posible menor de edad"],
                    risk_level: isAdult ? "LOW" : "HIGH",
                    recommendation: isAdult ? "Aprobar Nivel 2. Proceder a L3 si se requiere." : "RECHAZAR INMEDIATAMENTE."
                }, null, 2)
            }); 
            setIsAnalyzing(false); 
        }, 2000);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Note: In a real implementation, we would pass the images as InlineData parts
      const response = await ai.models.generateContent({ 
          model: 'gemini-3-flash-preview', 
          contents: promptContext,
          config: { systemInstruction: systemInstruction }
      });
      setAiAnalysis({ text: response.text || "Error", risk: 'Medium' });
    } catch (error) { setAiAnalysis({ text: "Error de conexión IA.", risk: 'High' }); } finally { if (process.env.API_KEY) setIsAnalyzing(false); }
  };

  const handleDecision = (id: string, status: 'Approved' | 'Rejected') => {
      // Update User Level based on decision
      const updatedUser = { ...selectedVerification!.user };
      if (status === 'Approved') {
          updatedUser.verificationTier = proposedTier;
          if (proposedTier.includes('L2')) updatedUser.verificationLevel = 'Verificado';
          if (proposedTier.includes('L3') || proposedTier.includes('L4')) updatedUser.verificationLevel = 'Alta Confianza';
          
          // Recalculate Trust Score
          const { score } = calculateTrustScore(updatedUser, proposedTier);
          updatedUser.trustScore = score;
      }

      setVerifications(verifications.map(v => v.id === id ? {...v, status, user: updatedUser} : v));
      setSelectedVerification(null);
      setIsDecrypted(false);
  };

  const handleSelectVerification = (req: VerificationRequest) => {
      setSelectedVerification(req);
      setAiAnalysis(null);
      setIsDecrypted(false);
      // Default next tier
      if (req.user.verificationTier === 'L0: Unverified') setProposedTier('L2: Identidad (ID+Selfie)');
      else if (req.user.verificationTier.includes('L2')) setProposedTier('L3: Humano (Revisión)');
  };

  const pendingList = verifications.filter(v => v.status === 'Pending');

  // Visualization helper for Trust Score
  const ScoreVisualizer = ({ user, tier }: { user: User, tier: VerificationTier }) => {
      const { score, breakdown } = calculateTrustScore(user, tier);
      return (
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mt-4">
              <div className="flex justify-between items-end mb-3">
                  <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Trust Score Simulado</h4>
                  <span className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-500'}`}>{score}/100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                  <div className={`h-full transition-all duration-500 ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{width: `${score}%`}}></div>
              </div>
              <div className="space-y-1">
                  {breakdown.map((b, i) => (
                      <div key={i} className="flex justify-between text-[10px]">
                          <span className="text-slate-500">{b.label}</span>
                          <span className={b.val > 0 ? 'text-green-400' : 'text-red-400'}>{b.val > 0 ? '+' : ''}{b.val}</span>
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      <header className="bg-slate-950 border-b border-slate-900 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Shield className="text-blue-500 w-5 h-5" />
          <h1 className="text-white font-bold">Panel Verificador Inteligente (SVIC)</h1>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm"><LogOut size={16} /> Salir</button>
      </header>

      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <aside className="w-80 border-r border-slate-900 overflow-y-auto bg-slate-950/50">
          <div className="p-4 border-b border-slate-900 sticky top-0 bg-slate-950 z-10 flex justify-between">
             <h3 className="font-semibold text-white text-sm">Cola de Verificación ({pendingList.length})</h3>
          </div>
          <div>
            {pendingList.map(req => (
              <div key={req.id} onClick={() => handleSelectVerification(req)} className={`p-4 border-b border-slate-900 cursor-pointer hover:bg-slate-900/80 ${selectedVerification?.id === req.id ? 'bg-slate-900 border-l-2 border-l-blue-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800"><img src={req.user.publicPhoto} className="w-full h-full object-cover" /></div>
                  <div>
                      <h4 className="font-medium text-white text-sm">{req.user.nickname}</h4>
                      <span className="text-[10px] text-slate-500 block">{req.submittedAt.split('T')[0]}</span>
                      <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">{req.user.verificationTier.split(':')[0]}</span>
                  </div>
                </div>
              </div>
            ))}
            {pendingList.length === 0 && <div className="p-8 text-center text-slate-600 text-xs">No hay solicitudes pendientes.</div>}
          </div>
        </aside>

        <main className="flex-1 bg-black p-8 overflow-y-auto custom-scrollbar">
          {selectedVerification ? (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Header Actions */}
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <div>
                    <h2 className="text-xl font-bold text-white">Solicitud #{selectedVerification.id}</h2>
                    <p className="text-xs text-slate-400">Nivel Actual: <span className="text-white font-bold">{selectedVerification.user.verificationTier}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg border border-slate-700">
                      <span className="text-xs text-slate-400">Asignar Nivel:</span>
                      <select 
                        value={proposedTier} 
                        onChange={(e) => setProposedTier(e.target.value as VerificationTier)}
                        className="bg-transparent text-white text-sm font-bold outline-none"
                      >
                          <option value="L2: Identidad (ID+Selfie)">L2: Identidad</option>
                          <option value="L3: Humano (Revisión)">L3: Humano</option>
                          <option value="L4: Premium (Video)">L4: Premium</option>
                      </select>
                  </div>
                  <button onClick={() => handleDecision(selectedVerification.id, 'Rejected')} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition">RECHAZAR</button>
                  <button onClick={() => handleDecision(selectedVerification.id, 'Approved')} className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition shadow-lg shadow-green-900/20">APROBAR</button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                
                {/* LEFT COLUMN: DATA (8 cols) */}
                <div className="col-span-8 space-y-6">
                    {/* Private Data Section */}
                    <div className="bg-[#0f1115] rounded-xl border border-red-900/30 overflow-hidden relative">
                        <div className="p-3 border-b border-red-900/20 bg-red-950/10 flex items-center justify-between text-red-400">
                            <div className="flex items-center gap-2"><Lock size={14} /><span className="font-bold text-xs">DATOS PRIVADOS (E2EE)</span></div>
                            {isDecrypted && <span className="text-[10px] bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">DESENCRIPTADO EN RAM</span>}
                        </div>
                        
                        {!isDecrypted ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="bg-slate-900 p-4 rounded-full border border-slate-800">
                                    <FileText className="w-8 h-8 text-slate-600" />
                                </div>
                                <div className="text-center">
                                    <h4 className="text-white font-bold text-sm">Información Encriptada</h4>
                                    <p className="text-slate-500 text-xs mt-1">Requiere llave de sesión verificador.</p>
                                </div>
                                <button onClick={() => setIsDecrypted(true)} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition border border-slate-700">
                                    <Key size={14} className="text-amber-500" /> Desencriptar
                                </button>
                            </div>
                        ) : (
                            <div className="p-5 space-y-6 animate-fade-in">
                                {selectedVerification.user.privateIdentity?.map((member, idx) => (
                                    <div key={idx} className="flex gap-4 p-3 bg-black/40 rounded-lg border border-slate-800/50">
                                        {/* Mock ID Image */}
                                        <div className="w-24 h-16 bg-slate-800 rounded overflow-hidden shrink-0 relative group cursor-pointer">
                                            <img src={member.idPhotoUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition" />
                                            <div className="absolute inset-0 flex items-center justify-center"><Eye size={16} className="text-white opacity-0 group-hover:opacity-100"/></div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-white font-mono text-sm block">{member.fullName}</span>
                                            <span className={`font-mono text-sm block font-bold ${calculateAge(member.dateOfBirth) < 18 ? 'text-red-500' : 'text-green-400'}`}>{calculateAge(member.dateOfBirth)} años ({member.dateOfBirth})</span>
                                            <span className="text-slate-300 font-mono text-sm block">ID: {member.idNumber}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex gap-4 mt-4 pt-4 border-t border-slate-800/50">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <Smartphone size={14}/> <span>{selectedVerification.user.email || 'email@hidden.com'}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* AI Analysis Box */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 rounded-xl border border-indigo-500/20 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-indigo-100 text-sm flex items-center gap-2"><BrainCircuit size={16}/> Gemini AI Analysis</h3>
                            <button 
                                onClick={() => analyzeIdentity(selectedVerification.user, selectedVerification)} 
                                disabled={isAnalyzing}
                                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded disabled:opacity-50 transition flex items-center gap-1"
                            >
                                {isAnalyzing ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <BrainCircuit size={12}/>}
                                {isAnalyzing ? 'Procesando...' : 'Ejecutar Análisis L2'}
                            </button>
                        </div>
                        {aiAnalysis ? (
                            <div className="animate-fade-in">
                                <pre className={`text-[10px] font-mono p-3 rounded overflow-x-auto whitespace-pre-wrap ${aiAnalysis.risk === 'High' ? 'bg-red-900/20 text-red-200 border border-red-500/30' : 'bg-green-900/20 text-green-200 border border-green-500/30'}`}>
                                    {aiAnalysis.text}
                                </pre>
                                {aiAnalysis.risk === 'High' && <div className="mt-2 flex items-center gap-2 text-red-500 text-xs font-bold"><AlertTriangle size={14} /> RIESGO ALTO DETECTADO</div>}
                            </div>
                        ) : (
                            <div className="text-sm text-slate-500 font-mono bg-black/30 p-3 rounded min-h-[60px] flex items-center justify-center">
                                Esperando ejecución de análisis...
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: SCORING & PUBLIC (4 cols) */}
                <div className="col-span-4 space-y-6">
                    {/* Public Profile Card */}
                    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2 text-blue-400"><Eye size={14} /><span className="font-bold text-xs">PERFIL PÚBLICO</span></div>
                        <div className="p-5 flex flex-col items-center">
                            <img src={selectedVerification.user.publicPhoto} className="w-20 h-20 rounded-full object-cover border-2 border-slate-700 mb-3" />
                            <h3 className="text-lg font-bold text-white text-center leading-none mb-1">{selectedVerification.user.nickname}</h3>
                            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full mb-4">{selectedVerification.user.profileType}</span>
                            <div className="w-full bg-black/30 p-3 rounded-lg text-xs text-slate-300 italic border border-slate-800/50 text-center">"{selectedVerification.user.description}"</div>
                        </div>
                    </div>

                    {/* Trust Score Simulator */}
                    <ScoreVisualizer user={selectedVerification.user} tier={proposedTier} />
                    
                    {/* Level 4 Action */}
                    <div className="bg-slate-900/50 rounded-xl border border-dashed border-slate-700 p-4 text-center">
                        <h4 className="text-slate-400 text-xs font-bold uppercase mb-2">Verificación L4</h4>
                        <button className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition">
                            <Video size={14} /> Agendar Videollamada
                        </button>
                    </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600/50"><Shield size={64} /><p className="mt-4">Selecciona una solicitud para auditar</p></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VerifierPanel;
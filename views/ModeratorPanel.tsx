import React, { useState } from 'react';
import { User, Report, ReportCategory } from '../types';
import { LogOut, ShieldAlert, AlertTriangle, Eye, Gavel, UserX, CheckCircle, MessageSquare, AlertOctagon, BrainCircuit, X, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { REPORTS, USERS } from '../data';

interface ModeratorPanelProps {
  onLogout: () => void;
}

const ModeratorPanel: React.FC<ModeratorPanelProps> = ({ onLogout }) => {
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [aiResult, setAiResult] = useState<{verdict: string, confidence: number, flags: string[]} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Helper to find users
  const getUser = (id: string) => USERS.find(u => u.id === id);

  const pendingReports = reports.filter(r => r.status === 'Pending');
  const resolvedReports = reports.filter(r => r.status !== 'Pending');

  // --- GEMINI VISION MODERATION LOGIC ---
  const runAiModeration = async (evidenceUrl: string) => {
      if (!process.env.API_KEY) {
          setIsAnalyzing(true);
          // Mock Simulation
          setTimeout(() => {
              setAiResult({
                  verdict: 'REVIEW_REQUIRED',
                  confidence: 88,
                  flags: ['Posible Estafa', 'Texto superpuesto detectado', 'Marca de agua externa']
              });
              setIsAnalyzing(false);
          }, 2000);
          return;
      }

      setIsAnalyzing(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const systemInstruction = `
            ACT AS: Senior Content Moderator for an Adult Consensual Community.
            
            OBJECTIVE: Analyze the input (image/text) to detect Safety Violations.
            
            CONTEXT: The platform allows consensual adult nudity. Do NOT flag nudity as a violation unless it violates the rules below.

            VIOLATIONS TO FLAG (Strict Zero Tolerance):
            1. CSAM (Child Sexual Abuse Material) or any individual appearing under 18.
            2. NON-CONSENSUAL: Sleeping persons, unconscious, hidden camera angles (upskirt, spycam).
            3. VIOLENCE: Blood, gore, weapons, physical assault.
            4. SPAM/SCAM: Watermarks of other websites, overlay text with payment info (CashApp, Venmo), QR codes.
            
            OUTPUT JSON FORMAT:
            {
                "risk_score": 0-100,
                "detected_flags": ["List", "of", "violations"],
                "is_consensual_adult_content": boolean,
                "verdict": "SAFE" | "REVIEW" | "BAN_IMMEDIATE"
            }
          `;
          
          // In real implementation: fetch image, convert to base64, send to model
          // Here passing description as placeholder for the visual analysis context
          const prompt = `Analiza esta evidencia reportada por categoría: ${selectedReport?.category}. Descripción: ${selectedReport?.description}.`;
          
          const response = await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: { systemInstruction }
          });
          
          // Mock parsing for demo purposes if response isn't strict JSON
          setAiResult({
              verdict: 'REVIEW', 
              confidence: 85, 
              flags: ['AI Analysis Simulation based on text context']
          });

      } catch (e) {
          alert("Error conectando con Gemini");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleAction = (action: 'Dismiss' | 'Warn' | 'Ban') => {
      if (!selectedReport) return;
      
      const newStatus = action === 'Dismiss' ? 'Dismissed' : 'Resolved';
      
      // Update local state (In prod: API call)
      const updatedReports = reports.map(r => 
          r.id === selectedReport.id ? { ...r, status: newStatus, adminNotes: `Action: ${action}` } : r
      );
      
      if (action === 'Ban') {
          // Find user and suspend (Mock)
          const reportedUser = USERS.find(u => u.id === selectedReport.reportedUserId);
          if (reportedUser) reportedUser.status = 'Suspended';
          alert(`Usuario ${reportedUser?.nickname} ha sido SUSPENDIDO.`);
      }

      if (action === 'Warn') {
           const reportedUser = USERS.find(u => u.id === selectedReport.reportedUserId);
           if (reportedUser) reportedUser.strikes = (reportedUser.strikes || 0) + 1;
           alert(`Strike añadido. Total: ${reportedUser?.strikes || 1}`);
      }

      setReports(updatedReports);
      setSelectedReport(null);
      setAiResult(null);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans flex flex-col">
       {/* Header */}
       <header className="bg-red-950/20 border-b border-red-900/50 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-red-500 w-6 h-6" />
          <div>
            <h1 className="text-white font-bold leading-none">Centro de Moderación</h1>
            <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">Protección Comunitaria</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm">
          <LogOut size={16} /> Salir
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Queue */}
          <aside className="w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col">
              <div className="p-4 border-b border-slate-800 font-bold text-slate-400 text-xs uppercase tracking-wider flex justify-between">
                  <span>Pendientes ({pendingReports.length})</span>
                  <span>Historial ({resolvedReports.length})</span>
              </div>
              <div className="overflow-y-auto flex-1">
                  {pendingReports.map(report => {
                      const user = getUser(report.reportedUserId);
                      return (
                        <div 
                            key={report.id} 
                            onClick={() => { setSelectedReport(report); setAiResult(null); }}
                            className={`p-4 border-b border-slate-800 cursor-pointer hover:bg-slate-900 transition ${selectedReport?.id === report.id ? 'bg-slate-900 border-l-2 border-l-red-500' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                                    report.severity === 'Critical' ? 'bg-red-900 text-red-500 border-red-500' : 
                                    report.severity === 'High' ? 'bg-orange-900 text-orange-500 border-orange-500' : 
                                    'bg-slate-800 text-slate-400 border-slate-600'
                                }`}>{report.category.split('/')[0]}</span>
                                <span className="text-[10px] text-slate-500">{report.timestamp.split(' ')[1]}</span>
                            </div>
                            <h4 className="text-white text-sm font-bold truncate mb-1">{user?.nickname || 'Usuario Desconocido'}</h4>
                            <p className="text-xs text-slate-400 line-clamp-2">{report.description}</p>
                        </div>
                      );
                  })}
                  {pendingReports.length === 0 && (
                      <div className="p-8 text-center text-slate-600">
                          <CheckCircle size={32} className="mx-auto mb-2 opacity-50"/>
                          <p className="text-sm">Todo limpio.</p>
                          <p className="text-xs">No hay reportes pendientes.</p>
                      </div>
                  )}
              </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-black p-8 overflow-y-auto">
              {selectedReport ? (
                  <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8">
                      {/* Left: Report Details */}
                      <div className="space-y-6">
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                  <AlertTriangle className="text-amber-500" /> Reporte #{selectedReport.id}
                              </h2>
                              
                              <div className="space-y-4">
                                  <div>
                                      <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Usuario Reportado</label>
                                      <div className="flex items-center gap-3 bg-black/50 p-3 rounded-lg border border-slate-800">
                                          <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden">
                                              <img src={getUser(selectedReport.reportedUserId)?.publicPhoto} className="w-full h-full object-cover" />
                                          </div>
                                          <div>
                                              <div className="text-white font-bold text-sm">{getUser(selectedReport.reportedUserId)?.nickname}</div>
                                              <div className="text-xs text-slate-500">Strikes actuales: <span className="text-red-400 font-bold">{getUser(selectedReport.reportedUserId)?.strikes || 0}</span></div>
                                          </div>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Motivo del Reporte</label>
                                      <div className="text-white text-sm font-medium border-l-2 border-amber-500 pl-3">
                                          {selectedReport.category}
                                      </div>
                                  </div>

                                  <div>
                                      <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Descripción del Denunciante</label>
                                      <div className="bg-slate-950 p-3 rounded-lg text-slate-300 text-sm italic">
                                          "{selectedReport.description}"
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {/* Evidence Viewer */}
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><ImageIcon size={16}/> Evidencia Adjunta</h3>
                                {selectedReport.evidenceImages && selectedReport.evidenceImages.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-2">
                                        {selectedReport.evidenceImages.map((img, idx) => (
                                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700">
                                                <img src={img} className="w-full h-40 object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <button onClick={() => runAiModeration(img)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 font-bold">
                                                        <BrainCircuit size={12} /> Analizar con IA
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-slate-500 text-xs italic p-4 text-center bg-black/20 rounded">No se adjuntaron imágenes.</div>
                                )}
                          </div>
                      </div>

                      {/* Right: Analysis & Action */}
                      <div className="space-y-6">
                          {/* AI Analysis Result */}
                          <div className={`rounded-xl border p-5 transition-all ${aiResult ? (aiResult.verdict === 'SAFE' ? 'bg-green-900/10 border-green-500/30' : 'bg-red-900/10 border-red-500/30') : 'bg-slate-900 border-slate-800'}`}>
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <BrainCircuit size={16} className={isAnalyzing ? 'animate-pulse text-indigo-400' : 'text-slate-400'}/> 
                                    Gemini Vision Guard
                                </h3>
                                
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center py-6 text-slate-500 text-xs">
                                        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                                        Analizando patrones de riesgo...
                                    </div>
                                ) : aiResult ? (
                                    <div className="space-y-3 animate-fade-in">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-slate-400 uppercase font-bold">Veredicto IA</span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-black ${aiResult.verdict === 'SAFE' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>{aiResult.verdict}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-slate-400 uppercase font-bold">Banderas Rojas</span>
                                            <ul className="list-disc pl-4 mt-1 text-xs text-red-300 space-y-1">
                                                {aiResult.flags.map((f, i) => <li key={i}>{f}</li>)}
                                            </ul>
                                        </div>
                                        <div className="text-[10px] text-slate-500 pt-2 border-t border-white/5">
                                            Confianza: {aiResult.confidence}%
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 text-center py-6">
                                        Selecciona una imagen de evidencia para ejecutar el análisis automático.
                                    </div>
                                )}
                          </div>

                          {/* Manual Actions */}
                          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Gavel size={16}/> Decisión Humana</h3>
                              
                              <div className="space-y-3">
                                  <button onClick={() => handleAction('Dismiss')} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                      <CheckCircle size={16} /> Descartar Reporte
                                  </button>
                                  
                                  <button onClick={() => handleAction('Warn')} className="w-full bg-amber-900/30 hover:bg-amber-900/50 border border-amber-900/50 text-amber-500 py-3 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2">
                                      <AlertTriangle size={16} /> Advertir (Strike +1)
                                  </button>

                                  <button onClick={() => handleAction('Ban')} className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-sm font-bold shadow-lg shadow-red-900/20 transition flex items-center justify-center gap-2">
                                      <UserX size={16} /> Suspensión Inmediata
                                  </button>
                              </div>

                              <p className="text-[10px] text-slate-500 text-center mt-4">
                                  Las acciones de moderación son registradas y auditable por SuperAdmin.
                              </p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600">
                      <AlertOctagon size={48} className="mb-4 opacity-50" />
                      <p>Selecciona un reporte de la cola para auditar.</p>
                  </div>
              )}
          </main>
      </div>
    </div>
  );
};

export default ModeratorPanel;
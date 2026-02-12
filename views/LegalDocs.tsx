import React, { useState } from 'react';
import { Shield, Lock, FileText, AlertTriangle, X, Check } from 'lucide-react';

interface LegalDocsProps {
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'liability';
}

const LegalDocs: React.FC<LegalDocsProps> = ({ onClose, initialTab = 'terms' }) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'liability'>(initialTab);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-slate-900 w-full max-w-2xl h-[85vh] rounded-3xl border border-slate-800 flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-amber-900/20 p-2 rounded-lg border border-amber-900/50">
                <FileText className="text-amber-500 w-5 h-5" />
            </div>
            <div>
                <h2 className="text-white font-bold text-lg">Marco Legal y Privacidad</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Cumplimiento Normativo - Colombia</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50">
          <button 
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'terms' ? 'border-amber-500 text-amber-500 bg-amber-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Términos y Condiciones
          </button>
          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'privacy' ? 'border-blue-500 text-blue-500 bg-blue-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Política de Privacidad
          </button>
          <button 
            onClick={() => setActiveTab('liability')}
            className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'liability' ? 'border-red-500 text-red-500 bg-red-500/5' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Eventos y Responsabilidad
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black text-slate-300 text-sm leading-relaxed space-y-6">
            
            {/* TABS CONTENT */}
            {activeTab === 'terms' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-amber-900/10 border border-amber-900/30 p-4 rounded-xl mb-6">
                        <h3 className="text-amber-500 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={16}/> Advertencia Importante</h3>
                        <p className="text-xs text-amber-200/80">Esta plataforma es exclusivamente para mayores de 18 años. El acceso o intento de acceso por menores de edad constituye una violación grave de nuestros términos y será reportado a las autoridades competentes (Ley 679 de 2001).</p>
                    </div>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">1. Aceptación de Términos</h4>
                        <p>Al registrarse en Kitana, el usuario declara bajo juramento ser mayor de edad y tener capacidad legal plena según las leyes de la República de Colombia.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">2. Verificación de Identidad</h4>
                        <p>Para garantizar la seguridad de la comunidad, Kitana exige una verificación obligatoria. El usuario acepta proporcionar documentos de identidad veraces. La falsificación de documentos resultará en la expulsión inmediata y reporte a autoridades (Falsedad en documento público/privado).</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">3. Conducta y Contenido (UGC)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-400">
                            <li>Queda estrictamente prohibido el contenido ilegal, incluyendo explotación sexual infantil, violencia, o actos no consensuados.</li>
                            <li><strong>Política de Cero Tolerancia:</strong> Cualquier reporte de acoso o divulgación de contenido íntimo sin consentimiento (Sexting no consensuado) resultará en el bloqueo definitivo y preservación de evidencia para procesos legales (Ley 1257 de 2008).</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">4. Derecho de Admisión Digital</h4>
                        <p>Kitana se reserva el derecho de suspender cuentas que violen el "Trust Score" o reciban múltiples reportes negativos, sin derecho a reembolso de suscripciones activas.</p>
                    </section>
                </div>
            )}

            {activeTab === 'privacy' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-xl mb-6">
                        <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><Lock size={16}/> Tratamiento de Datos Sensibles</h3>
                        <p className="text-xs text-blue-200/80">En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, solicitamos su autorización explícita para tratar datos biométricos y sensibles.</p>
                    </div>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">1. Responsable del Tratamiento</h4>
                        <p>Kitana Platform actúa como responsable. Los datos se almacenan en servidores encriptados y no se venden a terceros.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">2. Uso de Inteligencia Artificial</h4>
                        <p>Utilizamos sistemas de IA (Google Gemini) para el análisis de riesgo y verificación de edad. <strong>Protocolo de Privacidad:</strong> Los datos enviados a la IA son anonimizados previamente (Protocolo Zero-Knowledge). La IA no almacena las imágenes de sus documentos.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">3. Retención de Datos (Data Minimization)</h4>
                        <ul className="list-disc pl-5 space-y-2 text-slate-400">
                            <li><strong>Documentos de ID:</strong> Se eliminan automáticamente de nuestros servidores 24 horas después de la aprobación/rechazo de la verificación. Solo conservamos un "hash" criptográfico para evitar re-registros fraudulentos.</li>
                            <li><strong>Chats:</strong> Los mensajes pueden configurarse como efímeros. Una vez borrados, no son recuperables (Borrado seguro).</li>
                        </ul>
                    </section>
                </div>
            )}

            {activeTab === 'liability' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-xl mb-6">
                        <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Shield size={16}/> Deslinde de Responsabilidad</h3>
                        <p className="text-xs text-red-200/80">Kitana actúa como intermediario tecnológico para la venta de entradas y conexión entre usuarios.</p>
                    </div>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">1. Eventos Físicos</h4>
                        <p>Kitana no organiza directamente todos los eventos listados. Los establecimientos (Perfil Business) son los únicos responsables de la seguridad física, cumplimiento de aforo y licencias de funcionamiento de sus locales.</p>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">2. Interacciones entre Usuarios</h4>
                        <p>Kitana verifica identidades digitales, pero no garantiza el comportamiento de los usuarios en el mundo físico. Recomendamos:</p>
                        <ul className="list-disc pl-5 space-y-1 mt-2 text-slate-400">
                            <li>Encuentros iniciales en lugares públicos.</li>
                            <li>Informar a terceros de confianza sobre su ubicación.</li>
                            <li>Uso del sentido común y consentimiento explícito en todo momento.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="text-white font-bold text-base mb-2">3. Política de Reembolsos</h4>
                        <p>Las entradas a eventos (Tickets) son transferibles pero no reembolsables, salvo cancelación del evento por parte del organizador (Estatuto del Consumidor).</p>
                    </section>
                </div>
            )}

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 rounded-b-3xl flex justify-end">
            <button onClick={onClose} className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition">
                Entendido
            </button>
        </div>

      </div>
    </div>
  );
};

export default LegalDocs;
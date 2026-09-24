import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as sketchService from '../services/sketchService';
import SketchPreview from './SketchPreview';

interface PreviewModalProps {
  sketchId: number | string;
  authorName?: string;
  onClose: () => void;
}

export default function PreviewModal({ sketchId, authorName, onClose }: PreviewModalProps) {
  const { isGuest, username } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [sketchPath, setSketchPath] = useState<string>('');
  const [author, setAuthor] = useState<string>(authorName || 'Autore Anonimo');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [solution, setSolution] = useState<string | undefined>(undefined);
  const [isAuthor, setIsAuthor] = useState(false);

  useEffect(() => {
    sketchService.getSketch(sketchId)
      .then((data) => {
        setSketchPath(data.path || '');
        setAuthor(data.User?.username || 'Autore Anonimo');
        
        if (data.createdAt) {
          setCreatedAt(new Date(data.createdAt).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }));
        }

        const isCurrentAuthor = !!(username && data.User?.username === username);
        setIsAuthor(isCurrentAuthor);

        if (data.Word?.text) {
          setSolution(data.Word.text);
        }
      })
      .catch((err) => {
        console.error("Errore caricamento anteprima:", err);
        setError(err.message || "Si è verificato un errore");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sketchId, username]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="max-w-4xl w-full bg-background-2 bg-sketch-grid border-4 border-on-background p-6 md:p-8 rounded-xl shadow-[12px_12px_0px_0px_#1c1b1b] relative flex flex-col md:flex-row gap-6 my-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-on-background rounded-full bg-secondary-container hover:bg-secondary-fixed active:translate-y-[2px] transition-all cursor-pointer font-black text-sm z-10"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 gap-4 w-full">
            <span className="material-symbols-outlined text-primary text-5xl animate-bounce">search</span>
            <p className="text-lg font-bold text-on-surface-variant animate-pulse">Caricamento disegno...</p>
          </div>
        ) : (
          <>
            {/* Left Column: Sketch View */}
            <div className="flex-6 flex flex-col gap-4">
              <div className="border-4 border-on-background rounded-lg p-3 bg-white aspect-4/3 flex items-center justify-center overflow-hidden shadow-[8px_8px_0px_0px_#fcdf46] min-h-[280px]">
                {sketchPath ? (
                  <SketchPreview pathJson={sketchPath} animated={true} />
                ) : (
                  <div className="text-sm font-semibold text-on-surface-variant">Nessun tracciato disponibile</div>
                )}
              </div>
            </div>

            {/* Right Column: Details Panel */}
            <div className="flex-4 flex flex-col gap-5 bg-white border-4 border-on-background p-6 rounded-lg shadow-[8px_8px_0px_0px_#8b5cf6] justify-between">
              
              <div className="flex flex-col gap-4">
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight">Anteprima Sketch</h1>
                  <span className="inline-block bg-primary-fixed text-on-primary-fixed border-2 border-on-background text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_#1c1b1b] mt-1">
                    Visualizzazione
                  </span>
                </div>

                <div className="flex flex-col gap-2 font-bold text-sm">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">person</span>
                    <span>Disegnato da: <strong className="text-on-background uppercase">{author}</strong></span>
                  </div>
                  {createdAt && (
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <span className="material-symbols-outlined text-lg">calendar_month</span>
                      <span>Creato il: {createdAt}</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-800 border-2 border-red-300 p-3 rounded font-bold text-xs">
                    {error}
                  </div>
                )}

                {/* Secret Word Badge (If Solved or Author) */}
                {solution ? (
                  <div className="bg-green-50 text-green-800 border-2 border-green-300 p-4 rounded font-black text-sm shadow-[3px_3px_0px_0px_rgba(22,163,74,0.15)]">
                    <span className="block text-xs uppercase font-black opacity-80 mb-0.5">Parola Segreta:</span>
                    <span className="text-lg tracking-wider uppercase">{solution}</span>
                    {isAuthor && <span className="block mt-1 text-[11px] font-normal italic">Hai creato tu questo disegno</span>}
                  </div>
                ) : (
                  <div className="bg-secondary-container text-on-secondary-fixed border-2 border-on-background p-4 rounded font-black text-sm shadow-[3px_3px_0px_0px_rgba(28,27,27,0.15)] flex flex-col gap-2">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">lock</span>
                      <span className="text-xs uppercase font-black">Parola Nascosta</span>
                    </div>
                    {isGuest ? (
                      <p className="text-xs font-semibold text-on-surface-variant">
                        Registrati o accedi per provare ad indovinare questo disegno!
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-on-surface-variant">
                        Non hai ancora risolto questo disegno. Clicca sul pulsante "Indovina Parola!" nella galleria per inserire le tue risposte.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={onClose}
                className="w-full border-2 border-on-background py-2 rounded-lg font-bold text-sm bg-background hover:bg-surface-variant active:translate-y-1px active:translate-x-1px transition-all shadow-[2px_2px_0px_0px_#1c1b1b] hover:shadow-none cursor-pointer text-center"
              >
                Chiudi anteprima
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

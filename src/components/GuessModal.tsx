import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as sketchService from '../services/sketchService';
import SketchPreview from './SketchPreview';
import type { BackendAttempt } from '../types';

interface GuessModalProps {
  sketchId: number | string;
  authorName?: string;
  onClose: () => void;
}

export default function GuessModal({ sketchId, authorName, onClose }: GuessModalProps) {
  const { isGuest, username } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [sketchPath, setSketchPath] = useState<string>('');
  const [author, setAuthor] = useState<string>(authorName || 'Autore Anonimo');
  const [userAttempts, setUserAttempts] = useState<BackendAttempt[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(10);
  const [solution, setSolution] = useState<string | undefined>(undefined);
  const [isAuthor, setIsAuthor] = useState(false);

  const [guessInput, setGuessInput] = useState('');

  useEffect(() => {
    sketchService.getSketch(sketchId)
      .then((data) => {
        setSketchPath(data.path || '');
        setAuthor(data.User?.username || 'Autore Anonimo');
        
        const attempts = data.user_attempts || [];
        setUserAttempts(attempts);
        
        const hasCorrect = attempts.some((a) => a.is_correct);
        setIsCorrect(hasCorrect);
        setAttemptsRemaining(10 - attempts.length);

        const isCurrentAuthor = !!(username && data.User?.username === username);
        setIsAuthor(isCurrentAuthor);

        if (data.Word?.text) {
          setSolution(data.Word.text);
        }
      })
      .catch((err) => {
        console.error("Errore caricamento dettagli sketch:", err);
        setError(err.message || "Si è verificato un errore");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [sketchId, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guessInput.trim() || submitLoading || isCorrect || attemptsRemaining <= 0) return;

    setError(null);
    setSubmitLoading(true);

    if (isGuest) {
      setError("Devi effettuare l'accesso per poter indovinare.");
      setSubmitLoading(false);
      return;
    }

    try {
      const data = await sketchService.submitAttempt(sketchId, guessInput);

      setUserAttempts(prev => [...prev, { guess: guessInput.trim(), is_correct: data.is_correct }]);
      setIsCorrect(data.is_correct);
      setAttemptsRemaining(data.attempts_remaining);
      
      if (data.solution) {
        setSolution(data.solution);
      }
      setGuessInput('');
    } catch (err: any) {
      setError(err.message || "Errore sconosciuto");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="max-w-7xl w-full bg-background-2 bg-sketch-grid border-4 border-on-background p-4 sm:p-6 md:p-8 rounded-xl shadow-[8px_8px_0px_0px_#1c1b1b] md:shadow-[12px_12px_0px_0px_#1c1b1b] relative flex flex-col md:flex-row gap-4 md:gap-6 my-4 md:my-8">
        
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
              <div className="border-4 border-on-background rounded-lg p-3 bg-white aspect-4/3 flex items-center justify-center overflow-hidden shadow-[8px_8px_0px_0px_#fcdf46] min-h-[200px] sm:min-h-[280px]">
                {sketchPath ? (
                  <SketchPreview pathJson={sketchPath} animated={true} />
                ) : (
                  <div className="text-sm font-semibold text-on-surface-variant">Nessun tracciato disponibile</div>
                )}
              </div>
              <div className="flex justify-between items-center px-1 bg-white border-2 border-on-background rounded p-2.5 shadow-[3px_3px_0px_0px_#1c1b1b]">
                <span className="text-sm font-black uppercase text-on-background flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-lg font-bold">person</span>
                  Disegnato da: {author}
                </span>
              </div>
            </div>

            {/* Right Column: Interaction Panel */}
            <div className="flex-5 flex flex-col gap-4 bg-white border-4 border-on-background p-6 rounded-lg shadow-[8px_8px_0px_0px_#8b5cf6]">
              
              {/* Header Title */}
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tight">Indovina la Parola</h1>
                {isGuest ? (
                  <span className="inline-block bg-red-100 text-red-800 border-2 border-red-800 text-[11px] font-black uppercase px-2.5 py-1 rounded shadow-[2px_2px_0px_0px_rgba(186,26,26,0.2)] mt-1">
                    Modalità Spettatore (Ospite)
                  </span>
                ) : isAuthor ? (
                  <span className="inline-block bg-secondary-container text-on-secondary-fixed border-2 border-on-background text-[11px] font-black uppercase px-2.5 py-1 rounded shadow-[2px_2px_0px_0px_#1c1b1b] mt-1">
                    Tuo disegno
                  </span>
                ) : (
                  <span className="inline-block bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background text-[11px] font-black uppercase px-2.5 py-1 rounded shadow-[2px_2px_0px_0px_#1c1b1b] mt-1">
                    Tentativi Rimasti: {attemptsRemaining}/10
                  </span>
                )}
              </div>

              {/* Status Alert Banners */}
              {isCorrect && (
                <div className="bg-green-50 text-green-800 border-2 border-green-300 p-3 rounded font-black text-sm">
                  ✓ Complimenti! Hai indovinato!
                  {solution && <span className="block mt-1 text-xs">La parola era: <strong className="uppercase">{solution}</strong></span>}
                </div>
              )}

              {!isCorrect && attemptsRemaining === 0 && !isGuest && (
                <div className="bg-red-50 text-red-800 border-2 border-red-300 p-3 rounded font-black text-sm">
                  ✕ Tentativi esauriti per questo disegno!
                  {solution && <span className="block mt-1 text-xs">La soluzione era: <strong className="uppercase">{solution}</strong></span>}
                </div>
              )}

              {isAuthor && solution && (
                <div className="bg-secondary-container text-on-secondary-fixed border-2 border-on-background p-3 rounded font-black text-sm">
                  Hai creato questo disegno. La parola da indovinare è: <strong className="uppercase">{solution}</strong>
                </div>
              )}

              {isGuest && (
                <div className="bg-secondary-container text-on-secondary-fixed border-2 border-on-background p-3 rounded font-semibold text-xs text-center">
                  Gli ospiti possono solo visualizzare i disegni. Registrati o accedi per giocare e indovinare!
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-800 border-2 border-red-300 p-3 rounded font-bold text-xs">
                  {error}
                </div>
              )}

              {/* Scrollable list of past attempts */}
              {!isAuthor && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase text-on-surface-variant">Cronologia Tentativi</span>
                  <div className="flex-1 overflow-y-auto min-h-[160px] max-h-[220px] sm:min-h-[260px] sm:max-h-[300px] border-2 border-on-background rounded p-2 bg-[#fcf7eb] flex flex-col gap-1.5">
                    {isGuest ? (
                      <p className="text-xs font-semibold text-on-surface-variant italic text-center my-auto px-4">
                        Registrati per vedere la tua cronologia e fare tentativi.
                      </p>
                    ) : userAttempts.length === 0 ? (
                      <p className="text-xs font-semibold text-on-surface-variant italic text-center my-auto">
                        Nessun tentativo inserito ancora.
                      </p>
                    ) : (
                      userAttempts.map((att, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between px-3 py-1.5 border-2 border-on-background rounded font-bold text-xs shadow-[2px_2px_0px_0px_#1c1b1b] ${att.is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800 line-through'}`}
                        >
                          <span>{att.guess}</span>
                          <span className="material-symbols-outlined text-[16px] font-bold">
                            {att.is_correct ? 'check_circle' : 'cancel'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Input Form */}
              {!isGuest && !isAuthor && !isCorrect && attemptsRemaining > 0 && (
                <form onSubmit={handleSubmit} className="flex gap-2 mt-auto">
                  <input 
                    type="text" 
                    placeholder="Scrivi la tua risposta..."
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    disabled={submitLoading}
                    className="flex-1 border-2 border-on-background p-2.5 rounded font-bold text-sm bg-background focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_#1c1b1b] transition-shadow disabled:opacity-50" 
                  />
                  <button 
                    type="submit"
                    disabled={submitLoading || !guessInput.trim()}
                    className="bg-secondary-container text-on-background border-2 border-on-background rounded-lg px-4 py-2.5 font-bold text-sm shadow-[2px_2px_0px_0px_#1c1b1b] hover:translate-y-1px hover:translate-x-1px hover:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? 'Invio...' : 'Invia'}
                  </button>
                </form>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}

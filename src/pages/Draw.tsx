import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCanvas } from '../hooks/useCanvas';
import * as sketchService from '../services/sketchService';
import type { WordChoice } from '../types';

export default function Draw() {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  // Flow states
  const [words, setWords] = useState<WordChoice[]>([]);
  const [wordsToken, setWordsToken] = useState<string>('');
  const [selectedWord, setSelectedWord] = useState<WordChoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Inizializzazione Custom Hook Canvas
  // Il canvas è disabilitato se il tempo è scaduto o se stiamo caricando il salvataggio
  const {
    canvasRef,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    isEraser,
    setIsEraser,
    paths,
    redoStack,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    handleTouchStart,
    handleTouchMove,
    handleUndo,
    handleRedo,
    handleClear,
    initCanvas,
    getSketchJson
  } = useCanvas({ isDisabled: isTimeUp || submitLoading });

  // Available colors
  const colorPresets = [
    { name: 'Nero', hex: '#1c1b1b' },
    { name: 'Grigio', hex: '#4b5563' },
    { name: 'Rosso', hex: '#ba1a1a' },
    { name: 'Rosa', hex: '#db2777' },
    { name: 'Blu', hex: '#2563eb' },
    { name: 'Azzurro', hex: '#38bdf8' },
    { name: 'Turchese', hex: '#0d9488' },
    { name: 'Verde', hex: '#16a34a' },
    { name: 'Verde Chiaro', hex: '#a3e635' },
    { name: 'Giallo', hex: '#fcdf46' },
    { name: 'Arancione', hex: '#ea580c' },
    { name: 'Marrone', hex: '#78350f' },
    { name: 'Beige / Pesca', hex: '#f5d0a9' },
    { name: 'Viola', hex: '#8b5cf6' }
  ];

  // Check auth and load words
  useEffect(() => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    sketchService.getRandomWords()
      .then((data) => {
        setWords(data.words || []);
        setWordsToken(data.token || '');
      })
      .catch((err) => {
        console.error(err);
        setError("Impossibile caricare le parole dal backend.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isGuest]);

  // Timer countdown
  useEffect(() => {
    if (!selectedWord || isTimeUp || submitLoading) return;

    if (timeLeft <= 0) {
      setIsTimeUp(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedWord, timeLeft, isTimeUp, submitLoading]);

  // Setup white canvas background when selectedWord changes
  useEffect(() => {
    if (selectedWord) {
      initCanvas();
    }
  }, [selectedWord]);

  // Submit sketch to backend
  const handleSubmitSketch = async () => {
    if (!selectedWord || paths.length === 0 || submitLoading) return;
    setSubmitLoading(true);
    setError(null);

    const sketchPathJson = getSketchJson();

    try {
      await sketchService.createSketch({
        id_word: selectedWord.id_word,
        path: sketchPathJson,
        words_token: wordsToken
      });

      // Successful draw, redirect to Home gallery
      navigate('/home');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Errore sconosciuto");
      setSubmitLoading(false);
    }
  };

  return (
    <>
      {/* Title Section */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-on-background">Area Disegno</h1>
        <p className="text-lg font-semibold text-on-surface-variant mt-1">Crea un disegno e mettilo alla prova</p>
      </div>

      {/* Guest Lock Banner */}
      {isGuest ? (
        <div className="w-full max-w-2xl bg-secondary-container border-4 border-on-background rounded-xl p-8 shadow-[8px_8px_0px_0px_#111111] flex flex-col items-center gap-6 mt-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">lock</span>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase">Area di disegno bloccata</h2>
            <p className="text-sm font-semibold text-on-surface-variant mt-2 max-w-md">
              Devi essere registrato per pubblicare disegni. Accedi al tuo account o creane uno gratuito in pochi secondi per iniziare a disegnare!
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <span className="material-symbols-outlined text-primary text-5xl animate-bounce">sync</span>
          <p className="text-lg font-bold text-on-surface-variant animate-pulse">Generazione parole in corso...</p>
        </div>
      ) : error && !selectedWord ? (
        <div className="bg-red-50 text-red-800 border-4 border-on-background p-6 rounded-xl shadow-[4px_4px_0px_0px_#111111] font-bold max-w-xl">
          {error}
        </div>
      ) : !selectedWord ? (
        
        /* Step 1: Word Selection Screen */
        <div className="w-full max-w-3xl flex flex-col gap-6 mt-4">
          <div className="bg-white border-4 border-on-background p-6 rounded-xl shadow-[6px_6px_0px_0px_#111111]">
            <h2 className="text-2xl font-black uppercase tracking-tight">Scegli una parola</h2>
            <p className="text-sm font-semibold text-on-surface-variant mt-1">
              Seleziona una delle 3 parole offerte dal sistema. Avrai 120 secondi per rappresentarla!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {words.map((word, idx) => {
              const colors = ['bg-primary-fixed hover:shadow-[#fcdf46]', 'bg-secondary-container hover:shadow-[#8b5cf6]', 'bg-tertiary-fixed-dim hover:shadow-[#1c1b1b]'];
              return (
                <button
                  key={word.id_word}
                  onClick={() => setSelectedWord(word)}
                  className={`border-4 border-on-background rounded-xl p-8 text-center font-black text-xl uppercase tracking-wider shadow-[6px_6px_0px_0px_#1c1b1b] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_#1c1b1b] transition-all cursor-pointer ${colors[idx % colors.length]}`}
                >
                  {word.text}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        
        /* Step 2: Canvas Drawing Board */
        <div className="w-full flex flex-col lg:flex-row gap-6 mt-2 max-w-6xl">
          
          {/* Left Column: Canvas View */}
          <div className="flex-6 flex flex-col gap-4">
            
            {/* Header Canvas status bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white border-4 border-on-background p-4 rounded-xl shadow-[6px_6px_0px_0px_#1c1b1b] gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-black uppercase text-on-surface-variant">Parola da disegnare:</span>
                <span className="bg-secondary-container border-2 border-on-background px-4 py-1.5 rounded-lg text-lg font-black uppercase tracking-wide shadow-[2px_2px_0px_0px_#1c1b1b]">
                  {selectedWord.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl font-bold text-on-surface-variant">timer</span>
                <span className={`text-2xl font-black tabular-nums border-2 border-on-background px-3 py-1 rounded shadow-[2px_2px_0px_0px_#1c1b1b] ${timeLeft <= 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-800'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Canvas Block */}
            <div className="relative border-4 border-on-background rounded-xl overflow-hidden bg-white shadow-[8px_8px_0px_0px_#1c1b1b] md:shadow-[12px_12px_0px_0px_#1c1b1b] aspect-4/3 w-full flex items-center justify-center min-h-[220px] sm:min-h-[300px]">
              <canvas
                ref={canvasRef}
                width={600}
                height={450}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUpOrLeave}
                className={`w-full h-full object-contain cursor-crosshair bg-white touch-none ${isTimeUp || submitLoading ? 'pointer-events-none opacity-90' : ''}`}
              />

              {/* Time Up Overlays */}
              {isTimeUp && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-white z-10 animate-fade-in">
                  <span className="material-symbols-outlined text-6xl text-error mb-2 animate-bounce">timer_off</span>
                  <h2 className="text-3xl font-black uppercase">Tempo Scaduto!</h2>
                  <p className="text-sm font-semibold max-w-sm text-gray-300 mt-2">
                    I 120 secondi a disposizione sono terminati. Invia ora il tuo disegno per caricarlo in galleria!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Controls & Actions */}
          <div className="flex-4 flex flex-col gap-5 bg-white border-4 border-on-background p-6 rounded-xl shadow-[8px_8px_0px_0px_#8b5cf6] justify-between">
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center bg-background border-2 border-on-background p-3 rounded-lg shadow-[2px_2px_0px_0px_#1c1b1b]">
                <div className="flex flex-col">
                  <h3 className="text-lg font-black uppercase tracking-tight">Strumenti</h3>
                  <span className="text-[10px] font-bold text-on-surface-variant">Configura il tuo pennello</span>
                </div>
                {/* Brush Preview Circle */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant mb-1">Tratto</span>
                  <div className="w-12 h-12 border-2 border-on-background bg-white rounded flex items-center justify-center shadow-[1px_1px_0px_0px_#1c1b1b] overflow-hidden">
                    <div 
                      style={{ 
                        width: `${brushSize}px`, 
                        height: `${brushSize}px`, 
                        backgroundColor: isEraser ? '#ffffff' : brushColor,
                        border: isEraser ? '1px dashed #4b5563' : 'none'
                      }} 
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
              
              {/* Color Presets */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase text-on-surface-variant">Seleziona Colore</span>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.hex}
                      disabled={isTimeUp || submitLoading}
                      onClick={() => {
                        setBrushColor(c.hex);
                        setIsEraser(false);
                      }}
                      style={{ backgroundColor: c.hex }}
                      className={`w-8 h-8 rounded border-2 border-on-background cursor-pointer hover:scale-110 active:scale-95 transition-transform disabled:opacity-50 ${(!isEraser && brushColor === c.hex) ? 'ring-4 ring-primary ring-offset-2' : ''}`}
                      title={c.name}
                    />
                  ))}
                  
                  {/* Eraser button */}
                  <button
                    disabled={isTimeUp || submitLoading}
                    onClick={() => setIsEraser(true)}
                    className={`w-8 h-8 rounded border-2 border-on-background cursor-pointer hover:scale-110 active:scale-95 transition-transform flex items-center justify-center bg-gray-100 text-on-background disabled:opacity-50 ${isEraser ? 'ring-4 ring-primary ring-offset-2 bg-secondary-container' : ''}`}
                    title="Gomma"
                  >
                    <span className="material-symbols-outlined text-lg">ink_eraser</span>
                  </button>
                </div>
              </div>

              {/* Stroke Size */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase text-on-surface-variant">Spessore Pennello</span>
                <div className="grid grid-cols-2 gap-2">
                  {[2, 5, 10, 20].map((size) => {
                    const labels = ['Fine', 'Medio', 'Grosso', 'Super'];
                    const sizes = [2, 5, 10, 20];
                    const idx = sizes.indexOf(size);
                    return (
                      <button
                        key={size}
                        disabled={isTimeUp || submitLoading}
                        onClick={() => setBrushSize(size)}
                        className={`border-2 border-on-background px-3 py-1.5 rounded font-black text-xs cursor-pointer hover:bg-surface-variant active:translate-y-1px disabled:opacity-50 ${brushSize === size ? 'bg-secondary-container text-on-background' : 'bg-background'}`}
                      >
                        {labels[idx]} ({size}px)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Canvas Undo/Redo/Clear actions */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase text-on-surface-variant">Azioni Disegno</span>
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleUndo}
                    disabled={paths.length === 0 || isTimeUp || submitLoading}
                    className="flex-1 border-2 border-on-background py-2 rounded bg-background hover:bg-surface-variant disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1 font-bold text-xs"
                    title="Annulla ultimo tratto (Undo)"
                  >
                    <span className="material-symbols-outlined text-base">undo</span>
                    Undo
                  </button>
                  <button
                    onClick={handleRedo}
                    disabled={redoStack.length === 0 || isTimeUp || submitLoading}
                    className="flex-1 border-2 border-on-background py-2 rounded bg-background hover:bg-surface-variant disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1 font-bold text-xs"
                    title="Ripristina tratto (Redo)"
                  >
                    <span className="material-symbols-outlined text-base">redo</span>
                    Redo
                  </button>
                  <button
                    onClick={handleClear}
                    disabled={paths.length === 0 || isTimeUp || submitLoading}
                    className="flex-1 border-2 border-on-background py-2 rounded bg-red-50 text-red-800 hover:bg-red-100 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1 font-bold text-xs"
                    title="Cancella tutto"
                  >
                    <span className="material-symbols-outlined text-base">delete_sweep</span>
                    Pulisci
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-800 border-2 border-red-300 p-3 rounded font-bold text-xs mt-2">
                  {error}
                </div>
              )}
            </div>

            {/* Submission Section */}
            <div className="flex flex-col gap-3 border-t-2 border-dashed border-gray-200 pt-3">
              <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                <span>Tratti disegnati:</span>
                <span className="font-bold bg-background px-2 py-0.5 border border-on-background rounded">{paths.length}</span>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <button
                  onClick={() => navigate('/home')}
                  disabled={submitLoading}
                  className="w-full border-2 border-on-background py-2.5 rounded-lg font-bold text-sm bg-background hover:bg-surface-variant disabled:opacity-50 cursor-pointer text-center"
                >
                  Abbandona
                </button>
                <button
                  onClick={handleSubmitSketch}
                  disabled={paths.length === 0 || submitLoading}
                  className="w-full bg-primary text-white border-4 border-on-background rounded-lg py-3 font-bold text-sm shadow-[2px_2px_0px_0px_#1c1b1b] hover:translate-y-1px hover:translate-x-1px hover:shadow-none active:translate-y-[2px] active:translate-x-[2px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-lg">publish</span>
                  {submitLoading ? 'Salvataggio...' : 'Invia Disegno'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </>
  );
}

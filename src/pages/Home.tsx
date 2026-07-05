import { Link } from 'react-router-dom';
import { useGallery } from '../hooks/useGallery';
import SketchPreview from '../components/SketchPreview';
import GuessModal from '../components/GuessModal';
import PreviewModal from '../components/PreviewModal';

export default function Home() {
  const {
    sketches,
    filteredSketches,
    isLoading,
    hasError,
    activeFilter,
    setActiveFilter,
    selectedSketchId,
    selectedSketchAuthor,
    isGuessModalOpen,
    handleOpenGuessModal,
    handleCloseGuessModal,
    selectedPreviewSketchId,
    selectedPreviewAuthor,
    isPreviewModalOpen,
    handleOpenPreviewModal,
    handleClosePreviewModal
  } = useGallery();

  return (
    <>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-on-background">Galleria</h1>
          <p className="text-lg font-semibold text-on-surface-variant mt-1">Check out these masterpieces. Can you guess what they are?</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <div className="flex gap-2">
            <Link 
              to="/leaderboard" 
              state={{ tab: 'artists' }}
              className="bg-primary text-white border-2 border-on-background rounded-lg px-4 py-2 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active whitespace-nowrap cursor-pointer flex items-center justify-center"
            >
              Best Sketchers
            </Link>
            <button className="bg-surface text-on-background border-2 border-on-background rounded-lg px-4 py-2 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active whitespace-nowrap hover:bg-surface-variant transition-colors cursor-pointer">
              Most Guessed
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar Group */}
      {!hasError && !isLoading && sketches.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 bg-white border-4 border-on-background p-3 rounded-xl shadow-[4px_4px_0px_0px_#1c1b1b]">
          <span className="text-xs font-black uppercase text-on-surface-variant self-center mr-1.5 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm font-bold">filter_alt</span>
            Filtra:
          </span>
          {[
            { id: 'all', label: 'Tutti' },
            { id: 'to_guess', label: 'Da Indovinare' },
            { id: 'mine', label: 'Miei Disegni' },
            { id: 'solved', label: 'Risolti / Falliti' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as typeof activeFilter)}
              className={`border-2 border-on-background px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide cursor-pointer active:translate-y-1px shadow-[2px_2px_0px_0px_#1c1b1b] transition-all hover:translate-y-[0.5px] hover:shadow-[1px_1px_0px_0px_#1c1b1b] ${activeFilter === f.id ? 'bg-secondary-container text-on-background shadow-none translate-y-1px' : 'bg-background'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="col-span-full flex flex-col items-center justify-center py-12 gap-4 w-full">
          <span className="material-symbols-outlined text-primary text-5xl animate-bounce">brush</span>
          <p className="text-lg font-bold text-on-surface-variant animate-pulse">Caricamento capolavori in corso...</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border-4 border-on-background rounded-xl p-4 bg-white/40 h-[280px] flex flex-col gap-4 animate-pulse shadow-[4px_4px_0px_0px_#111111]">
                <div className="w-full aspect-4/3 bg-background-2 border-2 border-on-background rounded-lg flex-1"></div>
                <div className="h-4 bg-background-2 rounded w-2/3"></div>
                <div className="h-6 bg-background-2 rounded w-1/3 self-end"></div>
              </div>
            ))}
          </div>
        </div>
      ) : filteredSketches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-4 border-dashed border-on-background/30 rounded-2xl bg-white/50 w-full text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-2">draw</span>
          <h3 className="text-xl font-black text-on-background">Nessun disegno trovato</h3>
          <p className="text-sm text-on-surface-variant font-semibold mt-1">Non ci sono sketch disponibili al momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSketches.map((sketch) => (
            <div 
              key={sketch.id} 
              className={`sketch-card ${sketch.bgClass} border-4 border-on-background rounded-xl p-4 flex flex-col gap-2 hard-shadow relative`}
            >
              <div 
                onClick={() => handleOpenPreviewModal(sketch.id, sketch.author)}
                className="w-full aspect-4/3 bg-white border-2 border-on-background rounded-lg overflow-hidden relative group cursor-pointer flex items-center justify-center"
              >
                <SketchPreview pathJson={sketch.pathJson} />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="material-symbols-outlined text-white text-[48px] drop-shadow-md">zoom_in</span>
                </div>
              </div>
              <div className="flex justify-between items-end mt-1">
                <div>
                  <div className="text-sm font-bold text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                    {sketch.author}
                  </div>
                  <div className="text-[12px] opacity-80">{sketch.date}</div>
                </div>
                {sketch.author === selectedPreviewAuthor ? (
                  <button 
                    onClick={() => handleOpenPreviewModal(sketch.id, sketch.author)}
                    className="bg-secondary-container text-on-secondary-fixed border-2 border-on-background rounded-lg px-2 py-1 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active text-[12px] cursor-pointer whitespace-nowrap"
                  >
                    Vedi Opera
                  </button>
                ) : (
                  <button 
                    onClick={() => handleOpenGuessModal(sketch.id, sketch.author)}
                    className={`${sketch.btnBgClass} border-2 border-on-background rounded-lg px-2 py-1 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active text-[12px] cursor-pointer whitespace-nowrap`}
                  >
                    Guess Word!
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isGuessModalOpen && selectedSketchId !== null && (
        <GuessModal 
          sketchId={selectedSketchId}
          isReal={true}
          imageUrl=""
          authorName={selectedSketchAuthor}
          onClose={handleCloseGuessModal}
        />
      )}

      {isPreviewModalOpen && selectedPreviewSketchId !== null && (
        <PreviewModal 
          sketchId={selectedPreviewSketchId}
          isReal={true}
          imageUrl=""
          authorName={selectedPreviewAuthor}
          onClose={handleClosePreviewModal}
        />
      )}
    </>
  );
}

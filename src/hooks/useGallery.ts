import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as sketchService from '../services/sketchService';
import type { BackendSketch } from '../types';

// ============================================
// Hook per la galleria (Home page).
// Gestisce fetching sketch, filtraggio,
// e stato dei modali Guess/Preview.
// ============================================

const bgColors = ['bg-primary-fixed', 'bg-secondary-container', 'bg-tertiary-fixed-dim'];
const btnColors = ['bg-tertiary-fixed-dim text-white', 'bg-primary text-white', 'bg-secondary-fixed text-on-secondary-fixed'];

export type GalleryFilter = 'all' | 'to_guess' | 'mine' | 'solved';

export interface DisplaySketch {
  id: number;
  author: string;
  date: string;
  bgClass: string;
  btnBgClass: string;
  pathJson: string;
  userAttempts: { guess: string; is_correct: boolean }[];
}

interface UseGalleryReturn {
  // Data
  sketches: BackendSketch[];
  displaySketches: DisplaySketch[];
  filteredSketches: DisplaySketch[];
  isLoading: boolean;
  hasError: boolean;
  // Filters
  activeFilter: GalleryFilter;
  setActiveFilter: (filter: GalleryFilter) => void;
  // Preview Modal
  selectedPreviewSketchId: number | null;
  selectedPreviewAuthor: string;
  isPreviewModalOpen: boolean;
  handleOpenPreviewModal: (id: number, author?: string) => void;
  handleClosePreviewModal: () => void;
  // Actions
  refetchSketches: () => void;
}

export function useGallery(): UseGalleryReturn {
  const { username } = useAuth();

  // Data state
  const [sketches, setSketches] = useState<BackendSketch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all');

  // Preview Modal state
  const [selectedPreviewSketchId, setSelectedPreviewSketchId] = useState<number | null>(null);
  const [selectedPreviewAuthor, setSelectedPreviewAuthor] = useState<string>('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const fetchSketches = useCallback(() => {
    sketchService.getSketches()
      .then((data) => {
        if (Array.isArray(data)) {
          setSketches(data);
        }
      })
      .catch((err) => {
        console.error("Errore nel collegamento al backend:", err);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchSketches();
  }, [fetchSketches]);

  // Trasforma i dati per le card
  const displaySketches: DisplaySketch[] = sketches.map((s) => ({
    id: s.id_sketch,
    author: s.User?.username || 'Autore Anonimo',
    date: new Date(s.createdAt).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }),
    bgClass: bgColors[s.id_sketch % bgColors.length],
    btnBgClass: btnColors[s.id_sketch % btnColors.length],
    pathJson: s.path,
    userAttempts: s.user_attempts || [],
  }));

  // Filtra
  const filteredSketches = displaySketches.filter((sketch) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'mine') return sketch.author === username;

    if (activeFilter === 'to_guess') {
      if (sketch.author === username) return false;
      const attempts = sketch.userAttempts || [];
      const hasCorrect = attempts.some((a) => a.is_correct);
      const hasFailed = attempts.length >= 10;
      return !hasCorrect && !hasFailed;
    }

    if (activeFilter === 'solved') {
      const attempts = sketch.userAttempts || [];
      const hasCorrect = attempts.some((a) => a.is_correct);
      const hasFailed = attempts.length >= 10;
      return hasCorrect || hasFailed;
    }

    return true;
  });

  const handleOpenPreviewModal = (id: number, author?: string) => {
    setSelectedPreviewSketchId(id);
    setSelectedPreviewAuthor(author || '');
    setIsPreviewModalOpen(true);
  };

  const handleClosePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setSelectedPreviewSketchId(null);
  };

  return {
    sketches,
    displaySketches,
    filteredSketches,
    isLoading,
    hasError,
    activeFilter,
    setActiveFilter,
    selectedPreviewSketchId,
    selectedPreviewAuthor,
    isPreviewModalOpen,
    handleOpenPreviewModal,
    handleClosePreviewModal,
    refetchSketches: fetchSketches,
  };
}

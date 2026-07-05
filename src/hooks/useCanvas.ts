import { useState, useRef } from 'react';
import type { PathObjectWithPoints } from '../types';

// ============================================
// Canvas drawing hook
// Estrae tutta la logica di disegno, coordinate,
// undo/redo, timer e submit dalla pagina Draw.
// ============================================

interface UseCanvasOptions {
  /** Se il canvas è bloccato (es. tempo scaduto o invio in corso) */
  isDisabled: boolean;
}

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  // Brush state
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  isEraser: boolean;
  setIsEraser: (val: boolean) => void;
  // Paths state
  paths: PathObjectWithPoints[];
  redoStack: PathObjectWithPoints[];
  // Event handlers da collegare al <canvas>
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUpOrLeave: () => void;
  handleTouchStart: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  handleTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
  // Canvas actions
  handleUndo: () => void;
  handleRedo: () => void;
  handleClear: () => void;
  /** Inizializza il canvas con sfondo bianco */
  initCanvas: () => void;
  /** Genera la stringa JSON del disegno per il backend */
  getSketchJson: () => string;
}

export function useCanvas({ isDisabled }: UseCanvasOptions): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#1c1b1b');
  const [brushSize, setBrushSize] = useState(5);
  const [paths, setPaths] = useState<PathObjectWithPoints[]>([]);
  const [redoStack, setRedoStack] = useState<PathObjectWithPoints[]>([]);
  const [isEraser, setIsEraser] = useState(false);

  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);
  const currentPathStrRef = useRef<string>('');

  // ---- Helpers ----

  const initCanvas = () => {
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }, 50);
  };

  const redrawCanvas = (pathsList: PathObjectWithPoints[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pathsList.forEach((pathObj) => {
      if (pathObj.points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = pathObj.stroke;
      ctx.lineWidth = pathObj.strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const firstPoint = pathObj.points[0];
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < pathObj.points.length; i++) {
        ctx.lineTo(pathObj.points[i].x, pathObj.points[i].y);
      }
      ctx.stroke();
    });
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const cssX = clientX - rect.left;
    const cssY = clientY - rect.top;

    return {
      x: (cssX / rect.width) * canvas.width,
      y: (cssY / rect.height) * canvas.height,
    };
  };

  // ---- Inizio tratto (Mouse) ----
  const startStroke = (coords: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = isEraser ? '#ffffff' : brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);

    currentPointsRef.current = [{ x: coords.x, y: coords.y }];
    currentPathStrRef.current = `M ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`;
  };

  // ---- Continua tratto ----
  const continueStroke = (coords: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    currentPointsRef.current.push({ x: coords.x, y: coords.y });
    currentPathStrRef.current += ` L ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`;
  };

  // ---- Fine tratto ----
  const endStroke = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPointsRef.current.length > 0) {
      const newPath: PathObjectWithPoints = {
        type: 'path',
        path: currentPathStrRef.current,
        stroke: isEraser ? '#ffffff' : brushColor,
        strokeWidth: brushSize,
        fill: null,
        points: currentPointsRef.current,
      };

      const newPaths = [...paths, newPath];
      setPaths(newPaths);
      setRedoStack([]);
      redrawCanvas(newPaths);
    }
  };

  // ---- Mouse event handlers ----
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDisabled) return;
    const coords = getCoordinates(e);
    if (coords) startStroke(coords);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isDisabled) return;
    const coords = getCoordinates(e);
    if (coords) continueStroke(coords);
  };

  const handleMouseUpOrLeave = () => endStroke();

  // ---- Touch event handlers ----
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDisabled) return;
    const coords = getCoordinates(e);
    if (coords) startStroke(coords);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || isDisabled) return;
    const coords = getCoordinates(e);
    if (coords) continueStroke(coords);
  };

  // ---- Canvas actions ----
  const handleUndo = () => {
    if (paths.length === 0 || isDisabled) return;
    const lastPath = paths[paths.length - 1];
    setRedoStack((prev) => [...prev, lastPath]);
    const remaining = paths.slice(0, -1);
    setPaths(remaining);
    redrawCanvas(remaining);
  };

  const handleRedo = () => {
    if (redoStack.length === 0 || isDisabled) return;
    const restored = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    const newPaths = [...paths, restored];
    setPaths(newPaths);
    redrawCanvas(newPaths);
  };

  const handleClear = () => {
    if (isDisabled) return;
    setPaths([]);
    setRedoStack([]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // ---- Export ----
  const getSketchJson = (): string => {
    const width = canvasRef.current ? canvasRef.current.width : 600;
    const height = canvasRef.current ? canvasRef.current.height : 450;

    const cleanObjects = paths.map(({ type, path, stroke, strokeWidth, fill }) => ({
      type,
      path,
      stroke,
      strokeWidth,
      fill,
    }));

    return JSON.stringify({ objects: cleanObjects, width, height });
  };

  return {
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
    getSketchJson,
  };
}

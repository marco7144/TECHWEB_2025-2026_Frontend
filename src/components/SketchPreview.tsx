import { useState, useEffect } from 'react';

interface PathObject {
  type: string;
  path: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string | null;
}

interface CanvasData {
  objects: PathObject[];
  width?: number;
  height?: number;
}

export default function SketchPreview({ pathJson, animated = false }: { pathJson: string; animated?: boolean }) {
  let parsedData: CanvasData | null = null;
  try {
    parsedData = JSON.parse(pathJson);
  } catch (error) {
    console.error("Errore nel parsing del disegno:", error);
  }

  const totalObjects = parsedData?.objects?.length || 0;
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : 999999);

  useEffect(() => {
    if (!animated) {
      setVisibleCount(999999);
      return;
    }

    setVisibleCount(0);
    let current = 0;
    const intervalDuration = Math.max(25, Math.min(100, Math.floor(1500 / Math.max(1, totalObjects))));

    const timer = setInterval(() => {
      current += 1;
      if (current >= totalObjects) {
        setVisibleCount(totalObjects);
        clearInterval(timer);
      } else {
        setVisibleCount(current);
      }
    }, intervalDuration);

    return () => clearInterval(timer);
  }, [pathJson, animated, totalObjects]);

  if (!parsedData) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-on-surface-variant font-bold p-4 text-center">
        Errore di caricamento disegno
      </div>
    );
  }

  const data = parsedData;

  if (!data || !Array.isArray(data.objects) || data.objects.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-on-surface-variant font-bold p-4 text-center">
        Disegno vuoto
      </div>
    );
  }

  // Calcoliamo i limiti geometrici (bounding box) dei tratti disegnati
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  data.objects.forEach((obj) => {
    if (obj.type === 'path' && typeof obj.path === 'string') {
      // Estrae tutti i numeri (coordinate) presenti nella stringa del tracciato
      const numbers = obj.path.match(/[-+]?[0-9]*\.?[0-9]+/g);
      if (numbers) {
        // Le coordinate si alternano in X e Y (es. M X Y Q X Y X Y...)
        for (let i = 0; i < numbers.length; i += 2) {
          const x = parseFloat(numbers[i]);
          const y = parseFloat(numbers[i + 1]);
          
          if (!isNaN(x)) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
          }
          if (!isNaN(y)) {
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    }
  });

  // Verifichiamo se abbiamo trovato delle coordinate valide per il ritaglio
  const hasBounds = minX !== Infinity && maxX !== -Infinity && minY !== Infinity && maxY !== -Infinity;
  
  let viewBox = `0 0 ${data.width || 400} ${data.height || 400}`;

  if (hasBounds) {
    const padding = 10; // Margine di spazio intorno al disegno per evitare che tocchi i bordi della card
    const width = (maxX - minX) + padding * 2;
    const height = (maxY - minY) + padding * 2;
    
    // Centriamo l'inquadratura (viewBox) sulla porzione realmente disegnata
    viewBox = `${minX - padding} ${minY - padding} ${width} ${height}`;
  }

  return (
    <svg 
      viewBox={viewBox}
      className="w-full h-full object-contain bg-white"
    >
      {data.objects.slice(0, visibleCount).map((obj, index) => {
        if (obj.type === 'path') {
          return (
            <path
              key={index}
              d={obj.path}
              stroke={obj.stroke || '#000000'}
              strokeWidth={obj.strokeWidth || 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        }
        return null;
      })}
    </svg>
  );
}

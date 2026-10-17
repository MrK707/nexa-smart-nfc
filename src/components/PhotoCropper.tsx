import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, Check, X, Loader2 } from 'lucide-react';

interface PhotoCropperProps {
  file: File;
  onCancel: () => void;
  onDone: (blob: Blob) => void;
}

const OUTPUT_SIZE = 640; // final photo is 640 x 640
const MAX_ZOOM = 4;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const PhotoCropper: React.FC<PhotoCropperProps> = ({ file, onCancel, onDone }) => {
  const [src, setSrc] = useState('');
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  const [box] = useState(() => Math.max(220, Math.min(320, window.innerWidth - 72)));
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const imgRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number } | null>(null);

  // show the chosen file
  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // stop the page behind from scrolling
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // the photo always fills the whole square (no empty gaps)
  const baseScale = natural ? Math.max(box / natural.w, box / natural.h) : 1;
  const scale = baseScale * zoom;

  const clampOffset = (o: { x: number; y: number }, z: number) => {
    if (!natural) return o;
    const s = baseScale * z;
    const maxX = Math.max(0, (natural.w * s - box) / 2);
    const maxY = Math.max(0, (natural.h * s - box) / 2);
    return { x: clamp(o.x, -maxX, maxX), y: clamp(o.y, -maxY, maxY) };
  };

  const changeZoom = (value: number) => {
    const z = clamp(value, 1, MAX_ZOOM);
    setZoom(z);
    setOffset((o) => clampOffset(o, z));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = Array.from(pointers.current.values());
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.dist > 0) changeZoom(pinch.current.zoom * (dist / pinch.current.dist));
    } else if (pointers.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setOffset((o) => clampOffset({ x: o.x + dx, y: o.y + dy }, zoom));
    }
  };

  const onPointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    pinch.current = null;
  };

  const handleDone = () => {
    const img = imgRef.current;
    if (!img || !natural || busy) return;
    setBusy(true);
    setError('');
    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUTPUT_SIZE;
      canvas.height = OUTPUT_SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      ctx.imageSmoothingQuality = 'high';

      // which part of the original photo is inside the square
      const imgLeft = box / 2 + offset.x - (natural.w * scale) / 2;
      const imgTop = box / 2 + offset.y - (natural.h * scale) / 2;
      const size = box / scale;
      const sx = clamp(-imgLeft / scale, 0, Math.max(0, natural.w - size));
      const sy = clamp(-imgTop / scale, 0, Math.max(0, natural.h - size));

      ctx.drawImage(img, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onDone(blob);
          } else {
            setError('Could not crop this photo. Please try another one.');
            setBusy(false);
          }
        },
        'image/jpeg',
        0.88
      );
    } catch {
      setError('Could not crop this photo. Please try another one.');
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-[#1f1b2e]">Adjust your photo</h3>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full text-[#6b6478] hover:bg-[#f3f1fb] cursor-pointer"
            aria-label="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* crop area */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden rounded-2xl bg-black select-none"
            style={{ width: box, height: box, touchAction: 'none', cursor: 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onWheel={(e) => changeZoom(zoom - e.deltaY * 0.002)}
          >
            {src && (
              <img
                ref={imgRef}
                src={src}
                alt="Crop preview"
                draggable={false}
                onLoad={(e) =>
                  setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                }
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  maxWidth: 'none',
                  width: natural ? natural.w * scale : 'auto',
                  height: natural ? natural.h * scale : 'auto',
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            )}
            {/* circle guide: the photo shows as a circle on most card designs */}
            <div
              className="absolute inset-0 pointer-events-none rounded-full"
              style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)', border: '2px solid rgba(255,255,255,0.9)' }}
            />
          </div>
        </div>

        {/* zoom */}
        <div className="flex items-center gap-3 mt-4 px-1">
          <ZoomOut className="w-4 h-4 text-[#6b6478] shrink-0" />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => changeZoom(Number(e.target.value))}
            className="w-full accent-[#7c3aed]"
            aria-label="Zoom"
          />
          <ZoomIn className="w-4 h-4 text-[#6b6478] shrink-0" />
        </div>
        <p className="text-[11px] text-[#6b6478] font-medium text-center mt-2">
          Drag to move. Pinch or use the slider to zoom.
        </p>

        {error && <p className="text-xs font-bold text-rose-600 text-center mt-2">{error}</p>}

        <div className="flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl text-sm font-bold text-[#6b6478] bg-[#f3f1fb] hover:bg-[#ebe7f8] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDone}
            disabled={!natural || busy}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-[#7c3aed] to-[#22d3ee] disabled:opacity-60 cursor-pointer"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>Use Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

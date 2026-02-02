"use client";

import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Trash2 } from "lucide-react";

export interface KanaCanvasHandle {
  clearCanvas: () => void;
}

interface KanaCanvasProps {
  strokes?: string[]; // Array of SVG path data
}

const KanaCanvas = forwardRef<KanaCanvasHandle, KanaCanvasProps>(
  ({ strokes }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);
    const [animating, setAnimating] = useState(false);

    // Animation refs
    const animationRef = useRef<number | null>(null);

    // When strokes change, restart the animation
    useEffect(() => {
      // Clear user drawing when character changes
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setHasDrawing(false);

      if (strokes && strokes.length > 0) {
        setAnimating(true);
        // Stop animation after it plays out
        // Duration = length * time per stroke?
        // Let's rely on CSS or JS animation state
        // For simplicity, we'll let CSS handle the animation and just show/hide the layer
        // But to animate sequentially, CSS requires complex delays.
        // We'll use a simple CSS keyframe approach with delays if possible,
        // or just let them all draw.
        // Better: Set a timeout to "finish" animating so the dark lines disappear, leaving stencil.
        // Total duration approx: 1s per stroke?
        const duration = strokes.length * 1000 + 500;
        const timer = setTimeout(() => {
          setAnimating(false);
        }, duration);
        return () => clearTimeout(timer);
      } else {
        setAnimating(false);
      }
    }, [strokes]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set initial canvas properties
      ctx.strokeStyle = "#2c2c2c"; // Dark ink
      ctx.lineWidth = 12; // Thicker for aesthetics
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Handle resizing to match display size
      const resizeCanvas = () => {
        const parent = canvas.parentElement;
        if (parent) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          // Re-apply styles after resize
          ctx.strokeStyle = "#2c2c2c"; // Dark ink
          ctx.lineWidth = 12;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
        }
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas);

      return () => window.removeEventListener("resize", resizeCanvas);
    }, []);

    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawing(false);

      // Re-trigger animation if desired? Or just clear.
      // User might want to try again.
      // Let's re-trigger animation if we have strokes.
      if (strokes && strokes.length > 0) {
        setAnimating(false);
        // Small delay to restart
        setTimeout(() => setAnimating(true), 50);
        const duration = strokes.length * 1000 + 500;
        setTimeout(() => setAnimating(false), duration);
      }
    };

    useImperativeHandle(ref, () => ({
      clearCanvas,
    }));

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsDrawing(true);
      setHasDrawing(true);
      // Stop animation if user starts drawing
      setAnimating(false);

      const { x, y } = getCoordinates(e, canvas);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const { x, y } = getCoordinates(e, canvas);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.closePath();
      }
    };

    const getCoordinates = (
      e: React.MouseEvent | React.TouchEvent,
      canvas: HTMLCanvasElement,
    ) => {
      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if ("touches" in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
      }

      return {
        // Simple scaling if canvas resolution matches client size
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    return (
      <div className="relative w-full h-64 sm:h-80 paper-card rounded-2xl overflow-hidden touch-none group">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
          <div className="border-r border-b border-gray-300 border-dashed"></div>
          <div className="border-b border-gray-300 border-dashed"></div>
          <div className="border-r border-gray-300 border-dashed"></div>
          <div></div>
        </div>

        {/* Stencil Layer (Light Gray) */}
        {strokes && strokes.length > 0 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none p-4"
            viewBox="0 0 109 109"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              style={{
                fill: "none",
                stroke: "#e5e7eb", // gray-200
                strokeWidth: 3,
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }}
            >
              {strokes.map((d, i) => (
                <path key={`stencil-${i}`} d={d} />
              ))}
            </g>
          </svg>
        )}

        {/* Animation Layer (Dark Ink) */}
        {strokes && strokes.length > 0 && animating && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none p-4"
            viewBox="0 0 109 109"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              style={{
                fill: "none",
                stroke: "#2c2c2c",
                strokeWidth: 3,
                strokeLinecap: "round",
                strokeLinejoin: "round",
              }}
            >
              {strokes.map((d, i) => (
                <path
                  key={`anim-${i}`}
                  d={d}
                  className="animate-draw-stroke"
                  style={{
                    // Stagger animations
                    animationDelay: `${i * 0.8}s`,
                  }}
                />
              ))}
            </g>
          </svg>
        )}

        {/* Drawing Canvas */}
        {/* Note: we might need to adjust canvas coordinate system to match SVG 109x109 if we want 1:1 match, 
            but canvas is freeform. For now we keep canvas as is (pixel based on size). 
            The SVG is scaled to fit. User just traces visually. 
            Paper card padding might interfere if SVG has p-4. Removed p-4 from SVG to match canvas area? 
            Or add matching padding to canvas? 
            Actually, the SVG viewBox 0 0 109 109 usually is full square. 
            If I add p-4 to SVG, I should ensure the drawing area roughly matches. 
            Let's keep SVG full size (inset-0) and use padding p-8 inside SVG or just let it fill.
            KanjiVG 109x109 fills the square.
            Our canvas is w-full h-80 (rect). 
            SVGs will be centered.
            We need to make sure the user draws in the same area.
            The canvas coordinates are full width/height.
            The visual stencil is centered.
            If user draws in corner, it won't match.
            Ideally canvas resolution should match visualization.
            However, we won't overengineer the coordinate mapping yet.
        */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair opacity-90"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Controls */}
        {hasDrawing && (
          <button
            onClick={clearCanvas}
            className="absolute top-4 right-4 p-2 bg-white/80 border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all shadow-sm z-10"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}

        {!hasDrawing && !animating && strokes && (
          <div className="absolute bottom-4 left-4 text-gray-400 text-xs pointer-events-none select-none font-bold uppercase tracking-wider">
            Trace the characters
          </div>
        )}
      </div>
    );
  },
);

KanaCanvas.displayName = "KanaCanvas";

export default KanaCanvas;

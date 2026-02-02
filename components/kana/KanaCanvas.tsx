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

const KanaCanvas = forwardRef<KanaCanvasHandle>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);

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
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return (
    <div className="relative w-full h-64 sm:h-80 paper-card rounded-2xl overflow-hidden touch-none group">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-20">
        <div className="border-r border-b border-gray-300 border-dashed"></div>
        <div className="border-b border-gray-300 border-dashed"></div>
        <div className="border-r border-gray-300 border-dashed"></div>
        <div></div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair opacity-90"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      {hasDrawing && (
        <button
          onClick={clearCanvas}
          className="absolute top-4 right-4 p-2 bg-white/80 border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-all shadow-sm"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      )}

      <div className="absolute bottom-4 left-4 text-gray-400 text-xs pointer-events-none select-none font-bold uppercase tracking-wider">
        Draw here
      </div>
    </div>
  );
});

KanaCanvas.displayName = "KanaCanvas";

export default KanaCanvas;

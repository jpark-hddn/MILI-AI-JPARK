import { useEffect, useRef } from 'react';

type PixelBlastProps = { color?: string; pixelSize?: number; speed?: number; className?: string };

export default function PixelBlast({ color = '#AAFF19', pixelSize = 7, speed = 0.6, className = '' }: PixelBlastProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    let raf = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: -1000, y: -1000, active: false };
    const ripples: Array<{ x: number; y: number; age: number }> = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const move = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; };
    const leave = () => { pointer.active = false; };
    const click = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, age: 0 }); if (ripples.length > 8) ripples.shift(); };
    const draw = () => {
      frame += speed;
      ctx.fillStyle = '#080a0b'; ctx.fillRect(0, 0, w, h);
      const cols = Math.ceil(w / pixelSize), rows = Math.ceil(h / pixelSize);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const px = x * pixelSize, py = y * pixelSize;
        const wave = Math.sin(x * .16 + frame * .025) + Math.cos(y * .13 - frame * .018);
        const distance = pointer.active ? Math.hypot(px - pointer.x, py - pointer.y) : 9999;
        let alpha = 0.035 + Math.max(0, 1 - distance / 260) * 0.16 + (wave + 2) * 0.012;
        ripples.forEach(r => { const d = Math.abs(Math.hypot(px-r.x, py-r.y) - r.age * 8); alpha += Math.max(0, 1 - d / 28) * Math.max(0, .22 - r.age * .004); });
        if (alpha > .04) { ctx.globalAlpha = Math.min(alpha, .34); ctx.fillStyle = color; ctx.fillRect(px, py, pixelSize - 1, pixelSize - 1); }
      }
      ctx.globalAlpha = 1;
      ripples.forEach(r => { r.age += 1; });
      while (ripples[0]?.age > 64) ripples.shift();
      raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerleave', leave); canvas.addEventListener('click', click);
    return () => { cancelAnimationFrame(raf); observer.disconnect(); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', leave); canvas.removeEventListener('click', click); };
  }, [color, pixelSize, speed]);
  return <canvas ref={canvasRef} className={`pixel-blast-container ${className}`} aria-hidden="true" />;
}


import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WaveVisualizerProps {
  isPlaying: boolean;
  className?: string;
}

export function WaveVisualizer({ isPlaying, className }: WaveVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 初始化波形条
    const barCount = 64;
    barsRef.current = new Array(barCount).fill(0);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount;
      const gap = 2;

      barsRef.current.forEach((value, index) => {
        let targetValue = isPlaying ? Math.random() * 0.8 + 0.2 : 0;
        barsRef.current[index] += (targetValue - value) * 0.2;
        
        const barHeight = height * barsRef.current[index];
        const x = index * barWidth;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#ec4899');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + gap / 2, y, barWidth - gap, barHeight);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <canvas 
      ref={canvasRef}
      className={cn('w-full h-24', className)}
    />
  );
}


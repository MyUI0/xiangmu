import React, { useEffect, useRef } from 'react';

interface WeatherAnimationProps {
  weatherType: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'drizzle' | 'thunderstorm';
}

export default function WeatherAnimation({ weatherType }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let particles: any[] = [];

    class Particle {
      x: number;
      y: number;
      speed: number;
      size: number;
      color: string;
      opacity: number;
      rotation?: number;
      drift?: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.speed = Math.random() * 2 + 1;
        this.size = Math.random() * 3 + 1;
        this.color = 'white';
        this.opacity = Math.random() * 0.8 + 0.2;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Snowflake extends Particle {
      drift: number;

      constructor() {
        super();
        this.speed = Math.random() * 1 + 0.5;
        this.size = Math.random() * 4 + 2;
        this.drift = Math.random() * 2 - 1;
      }

      update() {
        this.y += this.speed;
        this.x += this.drift;
        if (this.y > canvas.height) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.moveTo(this.x - this.size * 0.7, this.y - this.size * 0.7);
        ctx.lineTo(this.x + this.size * 0.7, this.y + this.size * 0.7);
        ctx.moveTo(this.x + this.size * 0.7, this.y - this.size * 0.7);
        ctx.lineTo(this.x - this.size * 0.7, this.y + this.size * 0.7);
        ctx.stroke();
      }
    }

    class Cloud {
      x: number;
      y: number;
      speed: number;
      size: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.4;
        this.speed = Math.random() * 0.3 + 0.1;
        this.size = Math.random() * 80 + 60;
        this.opacity = Math.random() * 0.3 + 0.2;
      }

      update() {
        this.x += this.speed;
        if (this.x > canvas.width + this.size) {
          this.x = -this.size;
        }
      }

      draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.3, this.y - this.size * 0.1, this.size * 0.35, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.7, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.4, this.y + this.size * 0.1, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      if (weatherType === 'rainy' || weatherType === 'drizzle' || weatherType === 'thunderstorm') {
        for (let i = 0; i < 150; i++) {
          particles.push(new Particle());
        }
      } else if (weatherType === 'snowy') {
        for (let i = 0; i < 100; i++) {
          particles.push(new Snowflake());
        }
      } else if (weatherType === 'cloudy' || weatherType === 'foggy') {
        for (let i = 0; i < 10; i++) {
          particles.push(new Cloud());
        }
      }
    };

    const getGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      switch (weatherType) {
        case 'sunny':
          gradient.addColorStop(0, '#87CEEB');
          gradient.addColorStop(1, '#E0F6FF');
          break;
        case 'cloudy':
        case 'foggy':
          gradient.addColorStop(0, '#8E9EAB');
          gradient.addColorStop(1, '#D3DCE1');
          break;
        case 'rainy':
        case 'drizzle':
        case 'thunderstorm':
          gradient.addColorStop(0, '#37474F');
          gradient.addColorStop(1, '#607D8B');
          break;
        case 'snowy':
          gradient.addColorStop(0, '#B0BEC5');
          gradient.addColorStop(1, '#ECEFF1');
          break;
        default:
          gradient.addColorStop(0, '#87CEEB');
          gradient.addColorStop(1, '#E0F6FF');
      }
      return gradient;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = getGradient();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [weatherType]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}

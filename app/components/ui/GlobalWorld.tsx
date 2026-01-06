"use client";

import { useEffect, useRef } from "react";

interface GlobeProps {
  className?: string;
  size?: number;
}

export function GlobalWorld({ className = "", size = 400 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Configuración de la esfera
    const GLOBE_RADIUS = size * 0.4; // Radio del globo (40% del canvas)
    const DOT_RADIUS = 1.0; // Puntos más finos para mayor detalle
    
    // Lista de puntos a renderizar (mutable)
    let globePoints: { x: number; y: number; z: number; phi: number; theta: number }[] = [];

    // --- FALLBACK: Generación matemática de continentes ---
    const generateMathPoints = () => {
        const points = [];
        const TOTAL_POINTS_MATH = 4000;
        
        // Data de polígonos simplificados para los continentes (Lat, Lon)
        const continents: number[][][] = [
            [[70, -170], [70, -55], [55, -55], [30, -80], [15, -95], [8, -80], [15, -105], [60, -165]], // N. America
            [[13, -75], [10, -60], [-5, -35], [-25, -40], [-55, -70], [-20, -75], [-5, -80]], // S. America
            [[71, -10], [71, 40], [40, 45], [36, -5], [43, -10]], // Europe
            [[37, -5], [37, 12], [30, 32], [10, 50], [-35, 30], [-35, 15], [5, 8], [15, -18]], // Africa
            [[75, 50], [75, 175], [50, 140], [20, 110], [8, 105], [5, 80], [25, 60]], // Asia
            [[-10, 113], [-10, 153], [-39, 150], [-35, 113]], // Australia
            [[5, 95], [5, 140], [-10, 140], [-10, 95]] // Indonesia
        ];

        const isInside = (lat: number, lon: number, polygon: number[][]) => {
            let inside = false;
            for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
                const xi = polygon[i][1], yi = polygon[i][0];
                const xj = polygon[j][1], yj = polygon[j][0];
                const intersect = ((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi);
                if (intersect) inside = !inside;
            }
            return inside;
        };

        const isLand = (phi: number, theta: number) => {
            const lat = 90 - (phi * 180 / Math.PI);
            let lon = (theta % (2 * Math.PI)) * 180 / Math.PI;
            if (lon > 180) lon -= 360;
            return continents.some(polygon => isInside(lat, lon, polygon));
        };

        for (let i = 0; i < TOTAL_POINTS_MATH; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / TOTAL_POINTS_MATH);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
            
            if (isLand(phi, theta)) {
                // Invertimos Y para que coincida con el sistema de coordenadas de pantalla (Y arriba es negativo)
                const y = -GLOBE_RADIUS * Math.cos(phi); 
                const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
                const z = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
                points.push({ x, y, z, theta, phi });
            }
        }
        return points;
    };

    // --- MAIN: Carga de mapa desde SVG/Imagen ---
    const initPoints = () => {
        const img = new Image();
        // Importante: Ruta absoluta desde public
        img.src = '/images/world-map.svg'; 
        img.crossOrigin = "Anonymous";

        img.onload = () => {
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            if (!tempCtx) return;

            // Resolución de escaneo: Mayor = más detalle pero más pesado
            const W = 360; 
            const H = 180;
            tempCanvas.width = W;
            tempCanvas.height = H;
            // Dibujar imagen estirada para cubrir coordenadas lat/lon completas
            tempCtx.drawImage(img, 0, 0, W, H);
            
            const imgData = tempCtx.getImageData(0, 0, W, H).data;
            const newPoints = [];
            
            // Densidad de puntos (Scanning Fibonacci sphere)
            const SAMPLES = 10000; 

            for (let i = 0; i < SAMPLES; i++) {
                const phi = Math.acos(1 - 2 * (i + 0.5) / SAMPLES);
                const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

                // Mapeo esférico (Phi, Theta) a coordenadas UV rectangulares (X, Y)
                const y = Math.floor((phi / Math.PI) * H);
                const x = Math.floor(((theta % (2 * Math.PI)) / (2 * Math.PI)) * W);
                
                const pX = Math.max(0, Math.min(W - 1, x));
                const pY = Math.max(0, Math.min(H - 1, y));
                const index = (pY * W + pX) * 4;

                // Detección de "tierra":
                // Asumimos que el SVG tiene contenido negro/oscuro para tierra y transparente para mar.
                // Verificamos canal Alpha (> 100)
                const alpha = imgData[index + 3]; 
                
                if (alpha > 100) { 
                    // Convertir a 3D
                    // Invertimos Y para que el Norte apunte "arriba" en el canvas (Y negativo)
                    const pY_pos = -GLOBE_RADIUS * Math.cos(phi); 
                    const pX_pos = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
                    const pZ_pos = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
                    newPoints.push({ x: pX_pos, y: pY_pos, z: pZ_pos, phi, theta });
                }
            }
            globePoints = newPoints;
        };

        img.onerror = () => {
            console.log("No custom map found (world-map.svg), using fallback.");
            globePoints = generateMathPoints();
        };

        // Estado inicial
        globePoints = generateMathPoints();
    };

    initPoints();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const rotatedPoints = globePoints.map(p => {
        // Rotación continua sobre eje Y (Polar)
        const x2 = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const z2 = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);
        
        // Inclinación Axial de la Tierra (~23.5 grados)
        const tilt = 0.41; // radianes
        const x3 = x2 * Math.cos(tilt) - p.y * Math.sin(tilt);
        const y3 = x2 * Math.sin(tilt) + p.y * Math.cos(tilt);
        
        return { ...p, currentX: x3, currentZ: z2, currentY: y3 };
      });
      
      rotatedPoints.sort((a, b) => a.currentZ - b.currentZ);

      rotatedPoints.forEach(p => {
        const scale = (800 + p.currentZ) / 800;
        const alpha = Math.max(0.1, (p.currentZ + GLOBE_RADIUS) / (2 * GLOBE_RADIUS));
        
        if (p.currentZ < -GLOBE_RADIUS * 0.8) return;

        ctx.beginPath();
        const px = centerX + p.currentX;
        const py = centerY + p.currentY;
        
        ctx.arc(px, py, DOT_RADIUS * scale, 0, Math.PI * 2);
        
        // Color Soft UI (Azul Corporativo)
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`; 
        ctx.fill();
      });

      rotation += 0.002; // Velocidad de rotación suave
      animationFrameId = requestAnimationFrame(render);
    };

    // Ajustar resolución retina
    canvas.width = size;
    canvas.height = size;
    
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="opacity-90" />
      {/* Glow effect detrás */}
      <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transform scale-75 -z-10" />
    </div>
  );
}

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  
  // Create 5000 random particles in a sphere
  const [positions, mathColors] = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    const colors = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Emerald color variations
      colors[i * 3] = 0.05 + Math.random() * 0.1; // R
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.4; // G
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.3; // B
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={mathColors} stride={3} frustumCulled={false}>
      <PointMaterial transparent vertexColors size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

export const ThreeBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 bg-neutral-950">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={['#050505', 10, 25]} />
        <ParticleField />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

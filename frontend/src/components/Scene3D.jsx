import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Floating star field
function StarField() {
  const ref = useRef();

  const positions = useMemo(() => {
    const count = 3000;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02;
      ref.current.rotation.y -= delta * 0.01;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.018}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Pulsing orb
function PulsingOrb({ position, speed = 0.8 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.getElapsedTime();
      ref.current.scale.setScalar(1 + Math.sin(t * speed) * 0.15);
      ref.current.position.y = position[1] + Math.sin(t * speed * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.6}
        transparent
        opacity={0.15}
        wireframe={false}
      />
    </mesh>
  );
}

// Rotating torus ring
function TorusRing({ position, speed = 0.5 }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * speed;
      ref.current.rotation.y += delta * speed * 0.6;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.8, 0.02, 16, 100]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.8}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

// Floating octahedron
function FloatingGem({ position }) {
  const ref = useRef();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3;
      ref.current.rotation.y += delta * 0.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 0.7) * 0.4;
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
        wireframe
      />
    </mesh>
  );
}

export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 60 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#aaaaaa" />

      <StarField />

      <PulsingOrb position={[-3, 1, -2]} speed={0.7} />
      <PulsingOrb position={[3.5, -1.5, -3]} speed={0.9} />
      <PulsingOrb position={[0, 2.5, -4]} speed={0.5} />

      <TorusRing position={[-2.5, -0.5, -2]} speed={0.4} />
      <TorusRing position={[2, 1, -3]} speed={0.6} />

      <FloatingGem position={[-1, -2, -1]} />
      <FloatingGem position={[1.5, 1.5, -2]} />
      <FloatingGem position={[-3, 2, -3]} />
      <FloatingGem position={[3, -2.5, -2]} />
    </Canvas>
  );
}

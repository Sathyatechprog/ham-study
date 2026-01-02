import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type * as THREE from "three";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";

function GenericAntenna() {
  return (
    <group position={[-2, 0, 0]}>
       <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1, 1, 0.5]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
       <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 1, 16]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
}

function WaveParticles({ ampY, ampZ, phaseShift }: { ampY: number, ampZ: number, phaseShift: number }) {
    const particleCount = 600;
    
    // Initial state
    const [initialData] = useState(() => {
        const initialOffsets = [];
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            initialOffsets.push(Math.random() * 20); // Spread along X axis
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }
        return { initialOffsets, positions };
    });

    const particlesRef = useRef<THREE.Points>(null);
    const offsetsRef = useRef([...initialData.initialOffsets]);

    useFrame(({ clock }) => {
        if (!particlesRef.current) return;
        
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const t = clock.getElapsedTime() * 4; 
        
        const k = 1.0; 
        const phaseShiftRad = (phaseShift * Math.PI) / 180;

        for (let i = 0; i < particleCount; i++) {
            // Move particle along X
            offsetsRef.current[i] += 0.05; 
            
            if (offsetsRef.current[i] > 15) {
                offsetsRef.current[i] = -2; // Reset
            }
            
            const x = offsetsRef.current[i];
            
            // Wave equation
            const angle = k * x - t;
            
            const y = ampY * Math.cos(angle);
            const z = ampZ * Math.cos(angle + phaseShiftRad); // Apply phase shift to Z component relative to Y
            
            if (x < -2) {
                positions[i * 3] = x;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = 0;
            } else {
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;
            }
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    args={[initialData.positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#a855f7" // Purple
                size={0.15}
                transparent
                opacity={0.8}
            />
        </points>
    );
}

export default function EllipticalPolarizationScene() {
    const [ampY, setAmpY] = useState(1.5);
    const [ampZ, setAmpZ] = useState(0.8);
    const [phaseShift, setPhaseShift] = useState(90); // Degrees

    return (
        <div className="relative w-full h-[450px] md:h-[600px] border rounded-lg overflow-hidden bg-black touch-none">
            <Canvas camera={{ position: [10, 5, 10], fov: 45 }}>
                <color attach="background" args={["#111111"]} />
                <fog attach="fog" args={["#111111", 10, 50]} />
                
                <OrbitControls enableDamping dampingFactor={0.05} />
                
                <ambientLight intensity={0.5} color={0x404040} />
                <directionalLight position={[10, 10, 10]} intensity={1} color={0xffffff} />
                
                <axesHelper args={[5]} />
                <gridHelper args={[20, 20, 0x333333, 0x222222]} position={[0,-2,0]} />

                <GenericAntenna />
                <WaveParticles ampY={ampY} ampZ={ampZ} phaseShift={phaseShift} />
            </Canvas>

            {/* Overlay UI */}
             <div className="absolute top-4 left-4 right-4 md:right-auto md:w-auto p-3 md:p-4 bg-black/70 text-white rounded-lg max-w-full md:max-w-xs pointer-events-none select-none">
                <h1 className="text-xl font-bold text-purple-400 mb-2">椭圆极化 (Elliptical Polarization)</h1>
                 <p className="text-sm mb-2">
                    最普遍的极化形式。垂直和水平分量的幅度和相位不完美时形成。
                </p>
                 <div className="text-xs text-gray-300">
                     调整下方参数观察波形变化。当幅度相等且相位差90度时为圆极化。
                 </div>
            </div>

            <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 flex flex-col gap-4 pointer-events-auto bg-black/70 p-4 rounded-lg backdrop-blur-sm w-full md:w-80">
                <div className="space-y-2">
                    <div className="flex justify-between text-white text-xs">
                        <Label>垂直幅度 (Y)</Label>
                        <span>{ampY.toFixed(1)}</span>
                    </div>
                    <Slider
                        value={[ampY]}
                        min={0}
                        max={3}
                        step={0.1}
                        onValueChange={(vals: number[]) => setAmpY(vals[0])}
                    />
                </div>
                
                <div className="space-y-2">
                    <div className="flex justify-between text-white text-xs">
                        <Label>水平幅度 (Z)</Label>
                        <span>{ampZ.toFixed(1)}</span>
                    </div>
                    <Slider
                        value={[ampZ]}
                        min={0}
                        max={3}
                        step={0.1}
                        onValueChange={(vals: number[]) => setAmpZ(vals[0])}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-white text-xs">
                        <Label>相位差 (Phase)</Label>
                        <span>{phaseShift}°</span>
                    </div>
                    <Slider
                        value={[phaseShift]}
                        min={0}
                        max={180}
                        step={15}
                        onValueChange={(vals: number[]) => setPhaseShift(vals[0])}
                    />
                </div>
            </div>
        </div>
    );
}

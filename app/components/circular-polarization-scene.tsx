import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

function HelicalAntenna() {
  const points = useMemo(() => {
    const pts = [];
    // Create a spiral/helix shape
    const turns = 6;
    const height = 4;
    const radius = 0.5;
    for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const angle = t * Math.PI * 2 * turns;
        const x = t * height;
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        pts.push(new THREE.Vector3(x, y, z));
    }
    return pts;
  }, []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  /* Helix element */
  const line = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#ef4444", linewidth: 3 });
    return new THREE.Line(lineGeometry, mat);
  }, [lineGeometry]);

  return (
    <group position={[-2, 0, 0]}>
      {/* Reflector */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1, 1, 0.1, 32]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Helix element */}
      <primitive object={line} />
      {/* Boom support (optional, visual only) */}
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
}

function WaveParticles({ isRHCP = true }: { isRHCP: boolean }) {
    const particleCount = 600;
    
    // Initial state
    const [initialData] = useState(() => {
        const initialOffsets = [];
        const speeds = []; // Not really speed, but phase offset speed
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            initialOffsets.push(Math.random() * 20); // Spread along X axis
            speeds.push(0.05); // Uniform speed for coherence
            
            positions[i * 3] = 0;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = 0;
        }
        return { initialOffsets, speeds, positions };
    });

    const particlesRef = useRef<THREE.Points>(null);
    const offsetsRef = useRef([...initialData.initialOffsets]);

    useFrame(({ clock }) => {
        if (!particlesRef.current) return;
        
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        const t = clock.getElapsedTime() * 4; 
        
        // Direction multiplier: 1 for RHCP, -1 for LHCP (or vice versa depending on definition)
        // RHCP: thumb along propagation (+X), fingers curl.
        // Let's visualize rotation.
        const rotationDir = isRHCP ? -1 : 1; 

        for (let i = 0; i < particleCount; i++) {
            // Move particle along X
            offsetsRef.current[i] += 0.05; // propagation speed
            
            if (offsetsRef.current[i] > 15) {
                offsetsRef.current[i] = -2; // Reset to start
            }
            
            const x = offsetsRef.current[i];
            
            // Allow particles to exist only after antenna (x > -2)
            // But we simulate a beam.
            
            // Wave equation:
            // Angle = k*x - w*t
            // For circular:
            // Y = A cos(angle)
            // Z = A sin(angle)
            
            const k = 1.0; // Wave number
            const angle = k * x - t * rotationDir; // Time dependence
            
            const amplitude = 1.5;
            
            // Add some "beam" width or scatter if desired, but keep clean for now.
            // Using a helical path for the particles themselves to show the vector tip?
            // Yes, visualizing the electric field vector tips.
            
            const y = amplitude * Math.cos(angle);
            const z = amplitude * Math.sin(angle);
            
            // Only show if x > -2 (start of antenna)
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
                color={isRHCP ? "#22d3ee" : "#f472b6"} // Cyan for RHCP, Pink for LHCP
                size={0.15}
                transparent
                opacity={0.8}
            />
        </points>
    );
}

export default function CircularPolarizationScene() {
    const [isRHCP, setIsRHCP] = useState(true);

    return (
        <div className="relative w-full h-[450px] md:h-[600px] border rounded-lg overflow-hidden bg-black touch-none">
            <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
                <color attach="background" args={["#111111"]} />
                <fog attach="fog" args={["#111111", 10, 50]} />
                
                <OrbitControls enableDamping dampingFactor={0.05} />
                
                <ambientLight intensity={0.5} color={0x404040} />
                <directionalLight position={[10, 10, 10]} intensity={1} color={0xffffff} />
                
                <axesHelper args={[5]} />
                
                <HelicalAntenna />
                <WaveParticles isRHCP={isRHCP} />
                
                {/* Vectors helper for context */}
                 <gridHelper args={[20, 20, 0x333333, 0x222222]} position={[0,-2,0]} />
            </Canvas>

            {/* Overlay UI */}
             <div className="absolute top-4 left-4 right-4 md:right-auto md:w-auto p-3 md:p-4 bg-black/70 text-white rounded-lg max-w-full md:max-w-xs pointer-events-none select-none">
                <h1 className="text-xl font-bold text-sky-400 mb-2">圆极化 (Circular Polarization)</h1>
                <p className="text-sm mb-2">
                    电场矢量随着传播像螺旋一样旋转。
                    {isRHCP ? " 当前显示：右旋 (RHCP)" : " 当前显示：左旋 (LHCP)"}
                </p>
                <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-red-500 inline-block rounded-full"></span>
                        <span>螺旋天线 (Helical Antenna)</span>
                    </div>
                </div>
                 <p className="text-xs text-gray-400 mt-2">常用于卫星通信 (Satellite Comm)。</p>
            </div>

            <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:right-auto md:-translate-x-1/2 flex justify-center gap-4 md:gap-6 pointer-events-auto bg-black/70 p-3 md:p-4 rounded-lg backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="lhcp-rhcp" className={`text-sm font-medium cursor-pointer ${!isRHCP ? "text-white" : "text-gray-400"}`}>
                        LHCP
                    </Label>
                    <Switch
                        id="lhcp-rhcp"
                        checked={isRHCP}
                        onCheckedChange={setIsRHCP}
                    />
                    <Label htmlFor="lhcp-rhcp" className={`text-sm font-medium cursor-pointer ${isRHCP ? "text-white" : "text-gray-400"}`}>
                        RHCP
                    </Label>
                </div>
            </div>
        </div>
    );
}

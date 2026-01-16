import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { type InstancedMesh, SphereGeometry } from "three";
import ElectricFieldWorker from "./electric-field.worker?worker";

interface ElectricFieldInstancedProps {
  antennaType: string;
  polarizationType: "vertical" | "horizontal" | "circular" | "elliptical";
  speed?: number;
  amplitudeScale?: number;
  isRHCP?: boolean;
  axialRatio?: number;
  antennaLength?: number;
  radialAngle?: "60" | "135" | string;
  activeHarmonic?: number;
  isInvertedV?: boolean;
  rotation?: [number, number, number];
}

export function ElectricFieldInstanced(props: ElectricFieldInstancedProps) {
  const {
    antennaType,
    polarizationType,
    speed = 1.0,
    amplitudeScale = 1.0,
    isRHCP = true,
    antennaLength = 2.5,
    radialAngle,
    activeHarmonic,
    isInvertedV = false,
    rotation = [0, 0, 0],
  } = props;

  const { invalidate } = useThree();

  // Dense Grid for "Field Fabric"
  const gridSize = 100; // 100x100 = 10,000 particles
  const spacing = 40 / gridSize; // Cover 40 units
  const count = gridSize * gridSize;

  const meshRef = useRef<InstancedMesh>(null);
  const workerRef = useRef<Worker>(null);
  const isWorkerBusy = useRef(false);

  // Time tracking
  const timeRef = useRef(0);

  // Buffer management for Worker (Ping-Pong buffers)
  // These are the "working" buffers that travel between threads
  // Initial size allocation
  const workMatrixBuffer = useRef<Float32Array>(new Float32Array(count * 16));
  const workColorBuffer = useRef<Float32Array>(new Float32Array(count * 3));

  // Buffers for Initial Render (Static)
  const initialColorArray = useMemo(() => new Float32Array(count * 3), [count]);

  // Small Spheres
  const geometry = useMemo(
    () => new SphereGeometry(0.05, 6, 6), // Low poly spheres
    []
  );

  const hasReceivedFirstFrame = useRef(false);

  useEffect(() => {
    // Initialize Worker
    try {
      workerRef.current = new ElectricFieldWorker();
    } catch (err) {
      console.error("Worker init failed", err);
    }

    if (workerRef.current) {
      workerRef.current.onmessage = (e) => {
        const { matrixBuffer, colorBuffer } = e.data;

        // Update Mesh with returned data
        if (meshRef.current) {
          meshRef.current.instanceMatrix.array.set(matrixBuffer);
          meshRef.current.instanceMatrix.needsUpdate = true;

          if (meshRef.current.instanceColor) {
            meshRef.current.instanceColor.array.set(colorBuffer);
            meshRef.current.instanceColor.needsUpdate = true;
          }

          hasReceivedFirstFrame.current = true;

          // Trigger a re-render because we modified Three.js objects directly
          // This is crucial for frameloop="demand"
          invalidate();
        }

        // Reclaim ownership of buffers for next frame
        workMatrixBuffer.current = matrixBuffer;
        workColorBuffer.current = colorBuffer;
        isWorkerBusy.current = false;
      };

      workerRef.current.onerror = (err) => {
        console.error("Worker error:", err);
      };
    }

    // Force an initial invalidation to ensure useFrame runs at least once
    // (needed because useFrame might skip if workerRef was null on first render)
    invalidate();

    return () => {
      workerRef.current?.terminate();
    };
  }, [invalidate]);

  useFrame((_state, delta) => {
    if (!workerRef.current) return;

    // Optimization for demand mode:
    // If speed is 0 (static thumbnail) and we already have one frame, stop the loop.
    if (speed === 0 && hasReceivedFirstFrame.current) return;

    if (isWorkerBusy.current) return;

    timeRef.current += delta * 1.0 * speed;

    // Prepare Transferable Buffers
    const matrixBuf = workMatrixBuffer.current;
    const colorBuf = workColorBuffer.current;

    // Safety check: if buffers are detached (length 0), we can't send them.
    if (matrixBuf.byteLength === 0 || colorBuf.byteLength === 0) {
      return;
    }

    isWorkerBusy.current = true;

    // Send to Worker
    workerRef.current.postMessage(
      {
        props: {
          antennaType,
          polarizationType,
          speed,
          amplitudeScale,
          isRHCP,
          antennaLength,
          radialAngle,
          activeHarmonic,
          isInvertedV,
        },
        time: timeRef.current,
        gridSize,
        spacing,
        matrixBuffer: matrixBuf,
        colorBuffer: colorBuf,
      },
      // Transfer ownership
      [matrixBuf.buffer, colorBuf.buffer]
    );
  });

  // Manual cleanup for useMemo resources
  useMemo(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, count]}
      rotation={rotation}
    >
      <meshBasicMaterial toneMapped={false} />
      <instancedBufferAttribute
        attach="instanceColor"
        args={[initialColorArray, 3]}
      />
    </instancedMesh>
  );
}

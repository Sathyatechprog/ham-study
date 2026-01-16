// Numerical Integration for Windom Pattern (Handles Inverted V geometry)
// Copied from original component to run in worker
function calculateWindomFactor(
  angle: number, // angle in X-Z plane (from X axis)
  n: number,
  isInvertedV: boolean,
): number {
  // Normalize wire length L=1.
  // kL = n * pi
  const k = n * Math.PI;

  const segments = 40;
  let Ex_real = 0,
    Ex_imag = 0;
  let Ey_real = 0,
    Ey_imag = 0;
  let Ez_real = 0,
    Ez_imag = 0;

  // Observer direction (Far Field in X-Z Plane)
  // angle is atan2(z, x).
  // x = cos(angle), z = sin(angle).
  // dir = (cos, 0, sin).
  const dx = Math.cos(angle);
  const dy = 0;
  const dz = Math.sin(angle);

  // Wire Geometry
  // Windom Feed is at 33%. Place Feed (Apex) at (0,0,0).
  // Left Arm (Length 1/3): Direction -Z (roughly).
  // Right Arm (Length 2/3): Direction +Z (roughly).

  // Droop Angle (for Inverted V)
  // 120 deg included -> Arms droop 30 deg from horizontal
  const droop = isInvertedV ? Math.PI / 6 : 0;
  const cosD = Math.cos(droop);
  const sinD = Math.sin(droop); // Y component (downwards usually, let's say negative Y)

  for (let i = 0; i < segments; i++) {
    const t = (i + 0.5) / segments; // 0..1 along wire
    // Current Standing Wave (Sinusoidal, 0 at ends)
    const I = Math.sin(k * t);

    // Position & Tangent
    // Feed is at t_feed = 1/3 = 0.3333.
    const distFromFeed = t - 1 / 3; // Negative on Left Arm, Positive on Right

    let px = 0,
      py = 0,
      pz = 0;
    let tx = 0,
      ty = 0,
      tz = 0;

    if (distFromFeed < 0) {
      // Left Arm (Visual: Apex -> Left)
      const d = -distFromFeed; // Dist from Apex
      // Direction: -Z, and Droop (-Y).
      // vector = (0, -sinD, -cosD)
      px = 0;
      py = d * -sinD;
      pz = d * -cosD;
      // Tangent is along +t direction (Left -> Right).
      // Left arm grows from Left(End) to Apex(Feed).
      // Vector End->Apex is (+Z).
      tx = 0;
      ty = sinD;
      tz = cosD;
    } else {
      // Right Arm
      const d = distFromFeed;
      // Direction: +Z, and Droop (-Y).
      px = 0;
      py = d * -sinD;
      pz = d * cosD;
      // Tangent
      tx = 0;
      ty = -sinD;
      tz = cosD;
    }

    // Phase k * (r . dir)
    // k normalized to Length=1 is n*PI.
    // Coordinate r is normalized to Length=1.
    const phase = k * (px * dx + py * dy + pz * dz);
    const cp = Math.cos(phase);
    const sp = Math.sin(phase);

    // Vector Current J = I * Tangent
    const Jx = I * tx;
    const Jy = I * ty;
    const Jz = I * tz;

    // Vector Potential Contribution dA = J * exp(j phase)
    Ex_real += Jx * cp;
    Ex_imag += Jx * sp;
    Ey_real += Jy * cp;
    Ey_imag += Jy * sp;
    Ez_real += Jz * cp;
    Ez_imag += Jz * sp;
  }

  // Far Field E = A - (A.r)r  (Projection onto plane perpendicular to r) (Transverse)
  // A dot r
  const AdotR_real = Ex_real * dx + Ey_real * dy + Ez_real * dz;
  const AdotR_imag = Ex_imag * dx + Ey_imag * dy + Ez_imag * dz;

  const Eperpx_real = Ex_real - AdotR_real * dx;
  const Eperpy_real = Ey_real - AdotR_real * dy;
  const Eperpz_real = Ez_real - AdotR_real * dz;

  const Eperpx_imag = Ex_imag - AdotR_imag * dx;
  const Eperpy_imag = Ey_imag - AdotR_imag * dy;
  const Eperpz_imag = Ez_imag - AdotR_imag * dz;

  const magSq =
    Eperpx_real ** 2 +
    Eperpy_real ** 2 +
    Eperpz_real ** 2 +
    Eperpx_imag ** 2 +
    Eperpy_imag ** 2 +
    Eperpz_imag ** 2;

  // Normalize: A half-wave dipole max gain is ~ something.
  // With 40 segments, expected sum is ~25.
  // Tuning factor 0.5
  return Math.sqrt(magSq) / (segments * 0.5); // Tuning factor
}

// Helper: HSL to RGB conversion
// h, s, l are in [0, 1]
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r, g, b];
}

interface WorkerProps {
  antennaType: string;
  polarizationType: string;
  speed: number;
  amplitudeScale: number;
  isRHCP: boolean;
  antennaLength: number;
  radialAngle: string | undefined;
  activeHarmonic: number | undefined;
  isInvertedV: boolean;
}

interface WorkerMessageData {
  props: WorkerProps;
  time: number;
  gridSize: number;
  spacing: number;
  matrixBuffer: Float32Array;
  colorBuffer: Float32Array;
}

self.onmessage = (e: MessageEvent<WorkerMessageData>) => {
  const { props, time, gridSize, spacing, matrixBuffer, colorBuffer } = e.data;
  const {
    antennaType,
    polarizationType,
    amplitudeScale,
    isRHCP,
    antennaLength,
    radialAngle,
    activeHarmonic,
    isInvertedV,
  } = props;

  const centerOffset = (gridSize * spacing) / 2;
  let i = 0;

  // Re-use buffers passed via Transferable Objects
  // matrixBuffer should be gridSize * gridSize * 16
  // colorBuffer should be gridSize * gridSize * 3

  for (let x = 0; x < gridSize; x++) {
    for (let z = 0; z < gridSize; z++) {
      const index = i; // Save current index

      const posX = x * spacing - centerOffset;
      const posZ = z * spacing - centerOffset;

      // Static Position logic
      const dist = Math.sqrt(posX * posX + posZ * posZ);

      if (dist < 1.0) {
        // Zero scale
        // Matrix: Identity with scale 0
        setMatrixAt(matrixBuffer, index, 0, 0, 0, 0);
        i++;
        continue;
      }

      // Conical Slope Logic for GP 60
      let yOffset = 0;
      if (antennaType === "gp" && radialAngle === "60") {
        // 45 degree slope upwards
        yOffset = dist * 1.2;
      }

      // Phase Calculation (The Wave travels, particles don't)
      const k = 2.0;
      const phase = k * dist - time * 6.0;

      // Direction & Handedness
      const angle = Math.atan2(posZ, posX);
      const cosDir = Math.cos(angle);

      // Polarization Logic
      let yScale = 1.0;
      let hScale = 1.0;
      let dirGain = 1.0;

      if (
        polarizationType === "circular" ||
        polarizationType === "elliptical"
      ) {
        const rotDir = isRHCP ? 1 : -1;
        hScale = rotDir * cosDir;
        if (polarizationType === "elliptical") hScale *= 0.6;

        const front = Math.max(0, cosDir);
        const back = Math.max(0, -cosDir);

        dirGain = front ** 1.5 + 0.3 * back + 0.1;
      } else if (
        antennaType === "yagi" ||
        antennaType === "quad" ||
        antennaType === "moxon" ||
        antennaType === "hb9cv" ||
        antennaType === "magnetic-loop"
      ) {
        if (antennaType === "magnetic-loop") {
          const cosA = Math.cos(angle);
          dirGain = Math.abs(cosA) + 0.05;
        } else if (antennaType === "yagi" || antennaType === "quad") {
          const front = Math.max(0, cosDir);
          dirGain = front ** 2.0 + 0.1;
        } else if (antennaType === "moxon") {
          const sinDir = Math.sin(angle);
          const front = Math.max(0, sinDir);
          dirGain = front ** 2.0 + 0.1;
        } else if (antennaType === "hb9cv") {
          const kd = Math.PI / 4;
          const delta = (5 * Math.PI) / 4;
          const psi = kd * cosDir + delta;
          const mag = Math.sqrt(2 + 2 * Math.cos(psi));
          dirGain = (mag / Math.SQRT2) ** 2;
        }

        if (polarizationType === "vertical") {
          hScale = 0;
        } else {
          yScale = 0;
          hScale = 1.0;
        }
      } else if (antennaType === "long-wire") {
        const L = antennaLength;
        const lobeArg = 2.5 * Math.PI * L * Math.cos(angle);
        const baseLobe = Math.abs(Math.sin(lobeArg));
        const num = baseLobe ** 2;
        const den = Math.abs(Math.sin(angle));
        const val = den > 0.1 ? num / den : num * 10.0;
        dirGain = val * 0.5 + 0.05;
      } else if (antennaType === "windom") {
        const n = activeHarmonic ? activeHarmonic : 1;
        const isInv = isInvertedV;
        let val = calculateWindomFactor(angle, n, isInv);
        val = val ** 1.5;
        dirGain = val * 0.5 + 0.05;
        if (polarizationType === "vertical") {
          yScale = 1.0;
          hScale = 0.0;
        } else {
          yScale = 0.0;
          hScale = 1.0;
        }
      } else if (antennaType === "end-fed") {
        const n = activeHarmonic ? activeHarmonic : 1;
        const cosTheta = Math.cos(angle);
        const sinTheta = Math.abs(Math.sin(angle));
        const safeSinTheta = Math.max(0.001, sinTheta);

        let val = 0;
        if (n % 2 === 1) {
          const num = Math.cos(((n * Math.PI) / 2) * cosTheta);
          val = Math.abs(num / safeSinTheta);
        } else {
          const num = Math.sin(((n * Math.PI) / 2) * cosTheta);
          val = Math.abs(num / safeSinTheta);
        }
        val = val ** 1.5;
        dirGain = val * 0.5 + 0.05;
        if (polarizationType === "vertical") {
          yScale = 1.0;
          hScale = 0.0;
        } else {
          yScale = 0.0;
          hScale = 1.0;
        }
      } else if (
        antennaType === "vertical" ||
        antennaType === "gp" ||
        antennaType === "dp"
      ) {
        if (antennaType === "dp") {
          const L_lambda = antennaLength;
          const cosTheta = Math.sin(angle);
          const sinTheta = Math.cos(angle);
          const safeSinTheta = Math.max(0.001, Math.abs(sinTheta));
          const kL_2 = (Math.PI * 2 * L_lambda) / 2;
          const num = Math.cos(kL_2 * cosTheta) - Math.cos(kL_2);
          dirGain = Math.abs(num / safeSinTheta);
          yScale = 0;
          hScale = 1.0;
        } else if (antennaType === "vertical" || antennaType === "gp") {
          hScale = 0;
          dirGain = 1.0;
        }
      } else if (polarizationType === "horizontal") {
        yScale = 0;
        hScale = Math.sin(angle);
        dirGain = Math.abs(Math.sin(angle)) + 0.1;
      }

      const amp = amplitudeScale * dirGain;
      const decay = Math.max(0, 1.0 - dist / 22.0);
      const effectiveAmp = amp * decay;

      const valY = Math.sin(phase);
      const valH = Math.cos(phase);

      const dispY = valY * yScale * effectiveAmp;
      const dispH = valH * hScale * effectiveAmp;

      const tanX = -Math.sin(angle);
      const tanZ = Math.cos(angle);

      const finalX = posX + tanX * dispH;
      const finalY = dispY + yOffset;
      const finalZ = posZ + tanZ * dispH;

      const s = decay > 0.01 ? 1.0 : 0.0;

      // Update Matrix
      setMatrixAt(matrixBuffer, index, finalX, finalY, finalZ, s);

      // Color Logic
      let normalizedGain = 0;
      let useHeatMap = false;

      const isVariableGain =
        antennaType === "yagi" ||
        antennaType === "quad" ||
        antennaType === "moxon" ||
        antennaType === "hb9cv" ||
        antennaType === "magnetic-loop" ||
        polarizationType === "horizontal";

      if (
        polarizationType === "circular" ||
        polarizationType === "elliptical"
      ) {
        useHeatMap = true;
        normalizedGain = (cosDir + 1.0) * 0.5;
      } else if (isVariableGain) {
        useHeatMap = true;
        normalizedGain = Math.min(1.0, Math.max(0, (dirGain - 0.1) / 1.0));
      }

      let r = 0,
        g = 0,
        b = 0;
      if (useHeatMap) {
        const hue = (1.0 - normalizedGain) * 0.66;
        [r, g, b] = hslToRgb(hue, 1.0, 0.5);
      } else {
        [r, g, b] = hslToRgb(0.55, 0.9, 0.5);
      }

      const wavePulse = (Math.sin(phase) + 1.0) * 0.5;
      const sharpness = wavePulse ** 2.0;

      const effectiveGain = Math.max(0.3, dirGain);
      const brightness = sharpness * decay * 2.0 * effectiveGain + 0.2;

      r *= brightness;
      g *= brightness;
      b *= brightness;

      // Update Color
      colorBuffer[index * 3] = r;
      colorBuffer[index * 3 + 1] = g;
      colorBuffer[index * 3 + 2] = b;

      i++;
    }
  }

  // Send back
  self.postMessage(
    { matrixBuffer, colorBuffer },
    // @ts-expect-error
    [matrixBuffer.buffer, colorBuffer.buffer],
  );
};

// Helper to set matrix at index (translates + uniform scale)
// Three.js matrices are column-major
// [ sx, 0,  0,  0 ]
// [ 0,  sy, 0,  0 ]
// [ 0,  0,  sz, 0 ]
// [ ox, oy, oz, 1 ]
function setMatrixAt(
  buffer: Float32Array,
  index: number,
  x: number,
  y: number,
  z: number,
  scale: number,
) {
  const offset = index * 16;
  buffer[offset + 0] = scale;
  buffer[offset + 1] = 0;
  buffer[offset + 2] = 0;
  buffer[offset + 3] = 0;

  buffer[offset + 4] = 0;
  buffer[offset + 5] = scale;
  buffer[offset + 6] = 0;
  buffer[offset + 7] = 0;

  buffer[offset + 8] = 0;
  buffer[offset + 9] = 0;
  buffer[offset + 10] = scale;
  buffer[offset + 11] = 0;

  buffer[offset + 12] = x;
  buffer[offset + 13] = y;
  buffer[offset + 14] = z;
  buffer[offset + 15] = 1;
}

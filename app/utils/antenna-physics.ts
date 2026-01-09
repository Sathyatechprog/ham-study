// Constants
const PI = Math.PI;
const K = 2 * PI; // Normalized wavenumber k = 2pi (lambda = 1)

// Complex number multiplication: (a + bi) * (c + di) = (ac - bd) + (ad + bc)i
function multiplyComplex(
  a: number,
  b: number,
  c: number,
  d: number,
): { re: number; im: number } {
  return {
    re: a * c - b * d,
    im: a * d + b * c,
  };
}

/**
 * Calculates the electric field intensity E_theta for a given angle and length.
 * Uses numerical integration method, logic consistent with Balanis Antenna Theory.
 *
 * @param {number} theta - Angle off the axis (radians)
 * @param {number} L - Antenna length (in wavelengths lambda)
 * @param {string} type - 'traveling' | 'standing'
 * @returns {number} Normalized electric field magnitude
 */
export function calculateField(
  theta: number,
  L: number,
  type: "traveling" | "standing",
): number {
  const N = 200; // Integration steps
  const dz = L / N;

  let sumRe = 0;
  let sumIm = 0;

  // Pre-calculate cos(theta)
  const cosTheta = Math.cos(theta);

  for (let i = 0; i <= N; i++) {
    const z = i * dz;

    // 1. Calculate current I(z) = Ir + j*Ii
    let Ir = 0,
      Ii = 0;

    if (type === "traveling") {
      // I(z) = exp(-j * k * z)
      const kz = K * z;
      Ir = Math.cos(kz);
      Ii = -Math.sin(kz);
    } else {
      // I(z) = sin(k * (L - z)) (Purely real for standing wave assumption)
      Ir = Math.sin(K * (L - z));
      Ii = 0;
    }

    // 2. Calculate phase Kernel = exp(j * k * z * cos(theta))
    const phaseArg = K * z * cosTheta;
    const Kr = Math.cos(phaseArg);
    const Ki = Math.sin(phaseArg);

    // 3. Integration integrand = I(z) * Kernel
    const prod = multiplyComplex(Ir, Ii, Kr, Ki);

    sumRe += prod.re;
    sumIm += prod.im;
  }

  // Multiply by dz (step size)
  sumRe *= dz;
  sumIm *= dz;

  // Magnitude of the integral |Integral|
  const integralMag = Math.sqrt(sumRe * sumRe + sumIm * sumIm);

  // 4. Calculate final Electric Field |E|
  // Factor: sin(theta) (element factor for dipole/wire) * Array Factor (Integral)
  return Math.abs(Math.sin(theta) * integralMag);
}

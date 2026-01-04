export type BoomShape = "round" | "square";
export type MountMethod =
  | "through_bonded"
  | "through_insulated"
  | "above_bonded"
  | "above_insulated"
  | "non_metal"
  | "bonded"
  | "insulated"
  | "above"
  | "none";

// Mapping new mount types to old ones if necessary or just supporting all
// The new HTML uses: bonded, insulated, above, none for Pro mode.
// And preset uses calculated BC factors directly.
// We will support the "Pro" keys: "bonded" | "insulated" | "above" | "none"

export type DrivenElementType = "folded" | "straight";
export type SpacingType = "dl6wu" | "uniform";

export interface YagiConfig {
  frequency: number; // MHz
  elementCount: number; // count
  elementDiameter: number; // mm
  boomDiameter: number; // mm
  boomShape: BoomShape;
  mountMethod: MountMethod;
  feedGap: number; // mm
  // New Pro features
  drivenElementType: DrivenElementType;
  spacingType: SpacingType;
  manualSpacing: number; // in lambda
  manualBCFactor?: number; // Optional override for K factor
}

export interface YagiElement {
  type: "REF" | "DE" | "DIR";
  name: string;
  position: number; // cumulative from 0 (mm)
  spacing: number; // dist from previous (mm)
  length: number; // total length (mm)
  halfLength: number; // (mm)
  cutLength: number; // length after gap adjustment (for DE) (mm)
  gap?: number; // (mm)
  style?: DrivenElementType; // "folded" or "straight"
}

export interface YagiDesign {
  config: YagiConfig;
  elements: YagiElement[];
  totalBoomLength: number;
  estimatedGain: number;
  boomCorrection: number; // mm
  bcFactor: number; // k
  wavelength: number;
}

/**
 * Calculates Yagi-Uda antenna dimensions based on DL6WU and VK5DJ models.
 * Ported from yargi.html reference implementation.
 */
export function calculateYagi(config: YagiConfig): YagiDesign {
  const {
    frequency,
    elementCount,
    elementDiameter,
    boomDiameter,
    // boomShape, // Unused in calculation logic but kept in config
    mountMethod,
    feedGap,
    drivenElementType,
    spacingType,
    manualSpacing,
    manualBCFactor,
  } = config;

  // 1. Constants
  // Speed of light / frequency
  const lambda = 299792.458 / frequency;

  // 2. Boom Correction (BC) Calculation
  let bcFactor = 0;

  // Check if manual override is provided (simulate the UI input override)
  if (manualBCFactor !== undefined && manualBCFactor !== null) {
    bcFactor = manualBCFactor;
  } else {
    // Dynamic calculation logic from updateProPhysics in yargi.html
    const d = elementDiameter || 0;
    const B = boomDiameter || 0;
    const ratio = d > 0 ? B / d : 0;

    switch (mountMethod) {
      case "non_metal":
      case "none":
        bcFactor = 0;
        break;
      case "above_insulated":
      case "above": // "Above" in pro mode
        bcFactor = 0.05;
        break;
      case "through_insulated":
      case "insulated": // "Insulated" in pro mode
        bcFactor = 0.3;
        break;
      case "through_bonded":
      case "bonded": // "Bonded" in pro mode
        // VK5DJ dynamic logic
        if (ratio > 1) {
          bcFactor = 0.35 + 0.23 * Math.log(ratio);
          if (bcFactor > 1) bcFactor = 1.0;
        } else {
          // Fallback for ratio <= 1 or undefined behavior in HTML, default to old static or 0?
          // HTML code only updates k if ratio > 1 inside the "bonded" block.
          // If boom <= element, this is weird, but let's assume 0 or small.
          // Old logic was 0.7 for round. Let's stick to the dynamic one but maybe min cap?
          // The HTML code initializes k=0. So if ratio <= 1, it stays 0 for bonded in that specific logic block?
          // Wait, "let k = 0". Then if mount is bonded, and ratio > 1, update k.
          // So if ratio <= 1, k=0. That seems wrong for bonded, but it's what the reference code does.
          // However, typical Yagis have Boom >> Element.
          bcFactor = 0;
        }
        break;
      default:
        bcFactor = 0;
    }

    // Legacy support for the specific static BC logic from previous version if needed,
    // but we are fully replacing with the new dynamic logic.
  }

  const boomCorrection = bcFactor * boomDiameter;

  // 3. Calculate Elements
  const elements: YagiElement[] = [];
  let currentPos = 0;

  // --- Reflector ---
  // Length: 0.495 * lambda + BC
  const refLen = 0.495 * lambda + boomCorrection;
  elements.push({
    type: "REF",
    name: "Reflector",
    position: 0,
    spacing: 0,
    length: refLen,
    halfLength: refLen / 2,
    cutLength: refLen,
  });

  // --- Driven Element (DE) ---
  // Spacing Ref -> DE
  let spaceRefToDE = 0.2 * lambda;
  if (spacingType === "uniform") {
    spaceRefToDE = manualSpacing * lambda;
  }
  currentPos += spaceRefToDE;

  // DE Length calculation
  // Base: 0.473 * lambda
  const baseLen = 0.473 * lambda;
  // Total: Base + BC - (elDia * 0.5)
  const deTotalLen = baseLen + boomCorrection - elementDiameter * 0.5;

  let deCutLen = deTotalLen;
  if (drivenElementType === "straight") {
    deCutLen = deTotalLen - feedGap;
  }
  // If folded, usually the total length is the loop length tip-to-tip effectively,
  // but physical construction varies. The HTML logic sets cutLen = len if folded (no gap subtraction).

  elements.push({
    type: "DE",
    name: "Driven Element",
    position: currentPos,
    spacing: spaceRefToDE,
    length: deTotalLen,
    halfLength: deTotalLen / 2,
    cutLength: deCutLen,
    gap: feedGap,
    style: drivenElementType,
  });

  // --- Directors ---
  for (let i = 1; i <= elementCount - 2; i++) {
    let spacing = 0;

    if (spacingType === "uniform") {
      spacing = manualSpacing * lambda;
    } else {
      // DL6WU Spacing Model
      if (i === 1) spacing = 0.075 * lambda;
      else if (i === 2) spacing = 0.18 * lambda;
      else if (i === 3) spacing = 0.215 * lambda;
      else if (i === 4) spacing = 0.25 * lambda;
      else {
        let factor = 0.28 + (i - 5) * 0.01;
        if (factor > 0.35) factor = 0.35;
        spacing = factor * lambda;
      }
    }
    currentPos += spacing;

    // DL6WU Length Model
    let lenFactor = 0.455 - (i - 1) * 0.005;
    if (lenFactor < 0.405) lenFactor = 0.405;

    const dirLen = lenFactor * lambda + boomCorrection;

    elements.push({
      type: "DIR",
      name: `Director ${i}`,
      position: currentPos,
      spacing: spacing,
      length: dirLen,
      halfLength: dirLen / 2,
      cutLength: dirLen,
    });
  }

  // 4. Final Estimates
  const estimatedGain = elementCount * 1.2 + 2.15;

  return {
    config,
    elements,
    totalBoomLength: currentPos,
    estimatedGain,
    boomCorrection,
    bcFactor,
    wavelength: lambda,
  };
}

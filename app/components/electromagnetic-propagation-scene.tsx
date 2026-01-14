import { useEffect, useRef } from "react";
import * as THREE from "three";

// --- 核心配置常量 ---
const EARTH_RADIUS = 50;
const MAX_HOPS = 3;
const CRITICAL_FREQUENCY_FOF2 = 7;

// --- 纹理生成器 ---

function createHexGridTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = "rgba(0, 240, 255, 0.4)"; // 赛博青
  ctx.lineWidth = 2;

  const step = 64;
  ctx.beginPath();
  for (let x = 0; x <= size; x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size);
  }
  for (let y = 0; y <= size; y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
  }
  ctx.stroke();

  ctx.fillStyle = "rgba(0, 240, 255, 0.15)";
  for (let i = 0; i < 10; i++) {
    const rx = Math.floor(Math.random() * (size / step)) * step;
    const ry = Math.floor(Math.random() * (size / step)) * step;
    ctx.fillRect(rx + 2, ry + 2, step - 4, step - 4);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  return tex;
}

function createFiberTexture() {
  const width = 1024;
  const height = 64;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, width, height);

  const beamGrad = ctx.createLinearGradient(0, 0, width, 0);
  beamGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
  beamGrad.addColorStop(0.1, "rgba(255, 255, 255, 0.8)");
  beamGrad.addColorStop(0.5, "rgba(255, 255, 255, 1.0)");
  beamGrad.addColorStop(0.9, "rgba(255, 255, 255, 0.8)");
  beamGrad.addColorStop(1.0, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = beamGrad;
  ctx.fillRect(0, 28, width, 8);

  ctx.fillStyle = "rgba(0, 255, 255, 1.0)";
  ctx.fillRect(width * 0.2, 26, width * 0.05, 12);
  ctx.fillStyle = "rgba(255, 165, 0, 1.0)";
  ctx.fillRect(width * 0.6, 28, width * 0.02, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createWiFiTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, 64, size);

  const gradient = ctx.createLinearGradient(0, 0, 0, size);
  gradient.addColorStop(0, "rgba(0, 255, 255, 0)");
  gradient.addColorStop(0.1, "rgba(0, 255, 255, 0.8)");
  gradient.addColorStop(0.5, "rgba(0, 255, 255, 0.1)");
  gradient.addColorStop(1.0, "rgba(0, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, size);

  ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
  for (let i = 0; i < size; i += 20) {
    ctx.fillRect(0, i, 64, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 4);
  return tex;
}

function createGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, "rgba(255, 255, 255, 1)");
  grad.addColorStop(0.4, "rgba(100, 200, 255, 0.5)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function createImpactWaveTexture() {
  const w = 64;
  const h = 256;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, w, h);

  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
  gradient.addColorStop(0.1, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(0.8, "rgba(255, 255, 255, 0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// --- 数学工具 ---

function intersectSphere(
  rayOrigin: THREE.Vector3,
  rayDir: THREE.Vector3,
  sphereCenter: THREE.Vector3,
  sphereRadius: number,
): THREE.Vector3 | null {
  const L = new THREE.Vector3().subVectors(sphereCenter, rayOrigin);
  const tca = L.dot(rayDir);
  const d2 = L.dot(L) - tca * tca;
  const r2 = sphereRadius * sphereRadius;
  if (d2 > r2) return null;
  const thc = Math.sqrt(r2 - d2);
  const t1 = L.dot(rayDir) - thc;
  const t2 = L.dot(rayDir) + thc;
  if (t1 > 0.001)
    return rayOrigin.clone().add(rayDir.clone().multiplyScalar(t1));
  if (t2 > 0.001)
    return rayOrigin.clone().add(rayDir.clone().multiplyScalar(t2));
  return null;
}

function createSphericalSurfaceGeometry(
  radius: number,
  maxAngle: number,
  spreadAngle: number,
) {
  const segmentsR = 64;
  const segmentsW = 64;
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const uvs = [];
  const indices = [];

  for (let i = 0; i <= segmentsR; i++) {
    const phi = (i / segmentsR) * maxAngle;
    for (let j = 0; j <= segmentsW; j++) {
      const theta = (j / segmentsW - 0.5) * spreadAngle;
      const x = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.cos(theta);
      vertices.push(x, y, z);
      uvs.push(j / segmentsW, i / segmentsR);
    }
  }
  for (let i = 0; i < segmentsR; i++) {
    for (let j = 0; j < segmentsW; j++) {
      const a = i * (segmentsW + 1) + j;
      const b = (i + 1) * (segmentsW + 1) + j;
      const c = (i + 1) * (segmentsW + 1) + (j + 1);
      const d = i * (segmentsW + 1) + (j + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  geometry.setIndex(indices);
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  return geometry;
}

interface ElectromagneticPropagationSceneProps {
  mode?: "HF" | "UV";
  frequency?: number;
  angle?: number;
  ionoHeight?: number;
  isThumbnail?: boolean;
  isHovered?: boolean;
}

export default function ElectromagneticPropagationScene({
  mode = "HF",
  frequency = 14.1,
  angle = 15,
  ionoHeight = 300,
  isThumbnail = false,
  isHovered = false,
}: ElectromagneticPropagationSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const paramsRef = useRef({
    mode,
    angle,
    frequency,
    ionoHeight,
    isHovered,
  });

  useEffect(() => {
    paramsRef.current = { mode, angle, frequency, ionoHeight, isHovered };
  }, [mode, angle, frequency, ionoHeight, isHovered]);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 初始化 ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050b14);
    scene.fog = new THREE.FogExp2(0x050b14, 0.002);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 2000);
    const initialRadius = 160;
    camera.position.setFromSphericalCoords(initialRadius, Math.PI / 2.1, 0.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    // Disable interactions if in thumbnail mode
    if (isThumbnail) {
      // Maybe set specific camera view for thumbnail
    }

    // --- 纹理 ---
    const fiberTexture = createFiberTexture();
    const wifiTexture = createWiFiTexture();
    const glowTexture = createGlowTexture();
    const hexGridTexture = createHexGridTexture();
    const impactWaveTexture = createImpactWaveTexture();

    // --- 场景物体 ---
    const earthGroup = new THREE.Group();
    earthGroup.position.set(0, -EARTH_RADIUS + 5, 0);
    scene.add(earthGroup);

    // 地球
    const earthBase = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS - 0.5, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x000205 }),
    );
    earthGroup.add(earthBase);

    const earthWire = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS, 64, 64),
      new THREE.MeshBasicMaterial({
        color: 0x0044aa,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      }),
    );
    earthGroup.add(earthWire);

    const earthPointsGeo = new THREE.SphereGeometry(EARTH_RADIUS, 128, 64);
    const earthPointsMat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.5,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const earthPoints = new THREE.Points(earthPointsGeo, earthPointsMat);
    earthGroup.add(earthPoints);

    // 电离层
    const ionosphere = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS + 15, 64, 64),
      new THREE.MeshBasicMaterial({
        map: hexGridTexture,
        color: 0x00aaff,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    earthGroup.add(ionosphere);

    // 发射塔
    const tower = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 0.5, 5, 8),
      new THREE.MeshBasicMaterial({ color: 0xffaa00, wireframe: true }),
    );
    tower.position.set(0, EARTH_RADIUS + 2.5, 0);
    earthGroup.add(tower);

    const beacon = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        color: 0xffaa00,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    beacon.position.set(0, 3, 0);
    tower.add(beacon);

    const signalGroup = new THREE.Group();
    earthGroup.add(signalGroup);
    const scatterGroup = new THREE.Group();
    earthGroup.add(scatterGroup);
    const groundBounceGroup = new THREE.Group();
    earthGroup.add(groundBounceGroup);

    // --- 粒子系统 ---
    const spawnScatter = (pos: THREE.Vector3, color: number) => {
      const count = 15;
      const geo = new THREE.BufferGeometry();
      const positions = [];
      const velocities = [];
      for (let i = 0; i < count; i++) {
        positions.push(pos.x, pos.y, pos.z);
        const v = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        )
          .normalize()
          .multiplyScalar(Math.random() * 0.8 + 0.2);
        velocities.push(v.x, v.y, v.z);
      }
      geo.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3),
      );
      const pts = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          color: color,
          size: 2,
          transparent: true,
          opacity: 1,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      pts.userData = { life: 1.0, velocities: velocities };
      scatterGroup.add(pts);

      const ringGeo = new THREE.RingGeometry(0.1, 0.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(camera.position);
      ring.userData = { life: 0.5, isRing: true, maxScale: 10 };
      scatterGroup.add(ring);
    };

    const spawnSecondaryGroundWave = (
      pos: THREE.Vector3,
      color: number,
      intensity: number,
    ) => {
      const maxRippleAngle = 0.08;
      const geo = createSphericalSurfaceGeometry(
        EARTH_RADIUS + 0.3,
        maxRippleAngle,
        Math.PI * 2,
      );
      const mat = new THREE.MeshBasicMaterial({
        map: impactWaveTexture,
        color: color,
        transparent: true,
        opacity: 1.0 * intensity,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const mesh = new THREE.Mesh(geo, mat);

      const normal = pos.clone().normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

      mesh.userData = {
        isSecondary: true,
        life: 0,
        speed: 0.5,
        maxScale: 6.0 * intensity,
        intensity: intensity,
      };
      groundBounceGroup.add(mesh);
    };

    // --- 核心路径逻辑 ---
    let lastUpdateParams = {
      mode: "",
      angle: -1,
      frequency: -1,
      ionoHeight: -1,
    };

    const updateSignalPath = () => {
      const { mode, angle, frequency, ionoHeight } = paramsRef.current;
      // Note: We might want slightly looser check or force update if anything changes.
      // But props change triggers this fn in animation loop anyway.
      if (
        mode === lastUpdateParams.mode &&
        angle === lastUpdateParams.angle &&
        frequency === lastUpdateParams.frequency &&
        ionoHeight === lastUpdateParams.ionoHeight
      )
        return;
      lastUpdateParams = { mode, angle, frequency, ionoHeight };

      // Clean up
      while (signalGroup.children.length > 0) {
        const c = signalGroup.children[0] as THREE.Mesh;
        if (c.geometry) c.geometry.dispose();
        signalGroup.remove(c);
      }
      // Keep GroundBounce? Maybe clear them too on major param change?
      // Original code cleared bounces only on logic update I guess.
      // Let's clear ground bounces to interact immediately.
      while (groundBounceGroup.children.length > 0)
        groundBounceGroup.remove(groundBounceGroup.children[0]);

      const ionoR = EARTH_RADIUS + ionoHeight;
      ionosphere.scale.setScalar(ionoR / (EARTH_RADIUS + 15));

      const pts: THREE.Vector3[] = [];
      let currentPos = new THREE.Vector3(0, EARTH_RADIUS, 0);
      pts.push(currentPos);

      const rad = (angle * Math.PI) / 180;
      let direction = new THREE.Vector3(
        Math.cos(rad),
        Math.sin(rad),
        0,
      ).normalize();

      const incidenceAngle = Math.asin((EARTH_RADIUS / ionoR) * Math.cos(rad));
      const currentMUF = CRITICAL_FREQUENCY_FOF2 / Math.cos(incidenceAngle);
      const isPenetrating = mode === "UV" ? true : frequency > currentMUF;

      const baseColor =
        mode === "HF" ? (isPenetrating ? 0xff0055 : 0x00ffff) : 0xaa00ff;

      // 1. 主地波
      if (mode === "HF") {
        const gwStrength = Math.max(0, 15 - frequency * 0.4);
        if (gwStrength > 0) {
          const maxAngle = gwStrength * 0.06;
          const spreadAngle = Math.PI / 3;
          const gwGeo = createSphericalSurfaceGeometry(
            EARTH_RADIUS + 0.3,
            maxAngle,
            spreadAngle,
          );
          const gwMat = new THREE.MeshBasicMaterial({
            map: wifiTexture,
            color: 0xffaa00,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          gwMat.map?.repeat.set(1, 4);
          const gwMesh = new THREE.Mesh(gwGeo, gwMat);
          gwMesh.rotateY(Math.PI / 2);
          gwMesh.userData = { isGroundWave: true };
          signalGroup.add(gwMesh);
        }
      }

      // 2. 天波
      const impactPoints: THREE.Vector3[] = [];
      const bounceEvents: { pos: THREE.Vector3; intensity: number }[] = [];

      if (isPenetrating) {
        const hitIono = intersectSphere(
          currentPos,
          direction,
          new THREE.Vector3(0, 0, 0),
          ionoR,
        );
        if (hitIono) {
          pts.push(hitIono);
          impactPoints.push(hitIono);
          pts.push(hitIono.clone().add(direction.clone().multiplyScalar(80)));
        } else {
          pts.push(currentPos.clone().add(direction.multiplyScalar(80)));
        }
      } else {
        let bounces = 0;
        while (bounces < MAX_HOPS) {
          const hitIono = intersectSphere(
            currentPos,
            direction,
            new THREE.Vector3(0, 0, 0),
            ionoR,
          );
          if (!hitIono) break;
          pts.push(hitIono);
          impactPoints.push(hitIono);

          direction = direction
            .clone()
            .reflect(hitIono.clone().normalize().negate());
          const hitEarth = intersectSphere(
            hitIono,
            direction,
            new THREE.Vector3(0, 0, 0),
            EARTH_RADIUS,
          );
          if (hitEarth) {
            pts.push(hitEarth);
            impactPoints.push(hitEarth);
            currentPos = hitEarth;

            const intensity = 0.5 ** (bounces + 1);
            bounceEvents.push({ pos: hitEarth, intensity });

            direction = direction.clone().reflect(hitEarth.clone().normalize());
            bounces++;
          } else {
            pts.push(hitIono.clone().add(direction.multiplyScalar(60)));
            break;
          }
        }
      }

      if (pts.length >= 2) {
        const curve = new THREE.CatmullRomCurve3(
          pts,
          false,
          "catmullrom",
          0.05,
        );

        const glowGeo = new THREE.TubeGeometry(curve, 100, 0.8, 8, false);
        const glowMat = new THREE.MeshBasicMaterial({
          color: baseColor,
          transparent: true,
          opacity: 0.2,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        signalGroup.add(glowMesh);

        const coreGeo = new THREE.TubeGeometry(curve, 100, 0.3, 8, false);
        const coreMat = new THREE.MeshBasicMaterial({
          map: fiberTexture,
          color: 0xffffff,
          transparent: true,
          opacity: 1.0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.userData = { isBeam: true };
        signalGroup.add(coreMesh);

        impactPoints.forEach((p) => {
          spawnScatter(p, baseColor);
        });
        bounceEvents.forEach((evt) => {
          spawnSecondaryGroundWave(evt.pos, baseColor, evt.intensity);
        });
      }
    };

    // --- Loop ---
    const clock = new THREE.Clock();
    let animationId: number;
    const cameraParams = {
      radius: initialRadius,
      phi: Math.PI / 2.1,
      theta: 0.4,
      targetRadius: initialRadius,
      targetPhi: Math.PI / 2.1,
      targetTheta: 0.4,
    };

    let isDragging = false,
      prevMouse = { x: 0, y: 0 };
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
      isDragging = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };
      cameraParams.targetTheta -= dx * 0.005;
      cameraParams.targetPhi -= dy * 0.005;
      cameraParams.targetPhi = Math.max(
        0.1,
        Math.min(Math.PI / 2 - 0.1, cameraParams.targetPhi),
      );
    };
    const handleWheel = (e: WheelEvent) => {
      cameraParams.targetRadius += e.deltaY * 0.1;
      cameraParams.targetRadius = Math.max(
        60,
        Math.min(400, cameraParams.targetRadius),
      );
    };

    const container = mountRef.current; // capture for cleanup
    if (!isThumbnail) {
      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("wheel", handleWheel, { passive: true });
    }

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // In thumbnail mode, pause if not hovered
      if (isThumbnail && !paramsRef.current.isHovered) {
        return;
      }

      const delta = clock.getDelta();

      cameraParams.phi += (cameraParams.targetPhi - cameraParams.phi) * 0.1;
      cameraParams.theta +=
        (cameraParams.targetTheta - cameraParams.theta) * 0.1;
      cameraParams.radius +=
        (cameraParams.targetRadius - cameraParams.radius) * 0.1;
      camera.position.setFromSphericalCoords(
        cameraParams.radius,
        cameraParams.phi,
        cameraParams.theta,
      );
      camera.lookAt(0, 0, 0);

      earthGroup.rotation.y += delta * 0.02;
      ionosphere.rotation.y -= delta * 0.01;

      updateSignalPath();

      signalGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        // Check if map exists before accessing it
        if (mat?.map) {
          if (child.userData.isGroundWave) mat.map.offset.y -= delta * 1.5;
          else if (child.userData.isBeam) mat.map.offset.x -= delta * 3.0;
        }
      });

      groundBounceGroup.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        const data = mesh.userData;
        data.life += delta * data.speed;
        if (data.life > data.maxScale) data.life = 0;
        const s = Math.max(0.01, data.life);

        mesh.scale.set(s, 1, s);
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          Math.max(0, 1.0 - s / data.maxScale) * data.intensity;
      });

      for (let i = scatterGroup.children.length - 1; i >= 0; i--) {
        const obj = scatterGroup.children[i];
        if (obj.userData.isRing) {
          obj.userData.life -= delta * 1.5;
          const s = (0.5 - obj.userData.life) * 20;
          obj.scale.setScalar(s);
          const mat = (obj as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = obj.userData.life;
          if (obj.userData.life <= 0) scatterGroup.remove(obj);
        } else {
          const pts = obj as THREE.Points;
          pts.userData.life -= delta * 1.5;
          if (pts.userData.life <= 0) {
            scatterGroup.remove(pts);
            continue;
          }
          (pts.material as THREE.PointsMaterial).opacity = pts.userData.life;
          const posArr = pts.geometry.attributes.position.array as Float32Array;
          const vels = pts.userData.velocities;
          for (let k = 0; k < vels.length; k++) {
            posArr[k * 3] += vels[k * 3];
            posArr[k * 3 + 1] += vels[k * 3 + 1];
            posArr[k * 3 + 2] += vels[k * 3 + 2];
          }
          pts.geometry.attributes.position.needsUpdate = true;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (!isThumbnail) {
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("wheel", handleWheel);
      }

      cancelAnimationFrame(animationId);
      if (container) container.innerHTML = "";

      // Basic dispose
      renderer.dispose();
      fiberTexture.dispose();
      wifiTexture.dispose();
      glowTexture.dispose();
      hexGridTexture.dispose();
      impactWaveTexture.dispose();
      // Dispose geos/mats if possible, but keep it simple for now as per React 18 strict mode
      // might re-mount.
    };
  }, [isThumbnail]); // Re-run if thumbnail mode changes

  return (
    <div ref={mountRef} className="w-full h-full cursor-move relative z-0" />
  );
}

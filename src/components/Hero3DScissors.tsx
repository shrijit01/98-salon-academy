import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

interface Hero3DScissorsProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export const Hero3DScissors: React.FC<Hero3DScissorsProps> = ({ scrollProgressRef }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const [isInteractive] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth >= 768
  );

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mainGroupRef = useRef<THREE.Group | null>(null);
  const blade1GroupRef = useRef<THREE.Group | null>(null);
  const blade2GroupRef = useRef<THREE.Group | null>(null);
  const ribbonMeshRef = useRef<THREE.Mesh | null>(null);

  // Mouse tracking
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const animFrameIdRef = useRef<number>(0);

  // Build luxury sculptural shears with realistic crane-handle proportions
  const buildScissors = useCallback(
    (chromeMaterial: THREE.Material, goldMaterial: THREE.Material) => {
      const scissors = new THREE.Group();

      // Extrude bevel settings for razor-sharp, beveled blade appearance
      const extrudeSettings = {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      };

      // 1. Pivot Assembly
      const pivotBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.09, 32),
        goldMaterial
      );
      pivotBase.rotation.x = Math.PI / 2;
      scissors.add(pivotBase);

      const tensionKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.03, 32),
        goldMaterial
      );
      tensionKnob.rotation.x = Math.PI / 2;
      tensionKnob.position.z = 0.055;
      scissors.add(tensionKnob);

      const jewelDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 16, 16),
        new THREE.MeshStandardMaterial({
          color: 0x161514,
          roughness: 0.1,
          metalness: 0.9,
        })
      );
      jewelDot.position.z = 0.075;
      scissors.add(jewelDot);

      // 2. Blade & Handle 1 (Left - moving blade)
      const blade1Group = new THREE.Group();
      blade1GroupRef.current = blade1Group;

      // Precision sword blade shape
      const bladeShape1 = new THREE.Shape();
      bladeShape1.moveTo(0, 0);
      bladeShape1.lineTo(0.09, 0.5);
      bladeShape1.lineTo(0.07, 1.4);
      bladeShape1.lineTo(0.015, 2.3); // Needle-sharp tip
      bladeShape1.lineTo(-0.02, 2.3);
      bladeShape1.lineTo(-0.04, 1.4);
      bladeShape1.lineTo(-0.06, 0.5);
      bladeShape1.closePath();

      const bladeGeo1 = new THREE.ExtrudeGeometry(bladeShape1, extrudeSettings);
      const bladeMesh1 = new THREE.Mesh(bladeGeo1, chromeMaterial);
      blade1Group.add(bladeMesh1);

      // Offset ergonomic handle shank 1
      const shankShape1 = new THREE.Shape();
      shankShape1.moveTo(0, 0);
      shankShape1.lineTo(-0.07, -0.4);
      shankShape1.lineTo(-0.16, -0.9);
      shankShape1.lineTo(-0.07, -0.9);
      shankShape1.lineTo(0.03, -0.4);
      shankShape1.closePath();

      const shankGeo1 = new THREE.ExtrudeGeometry(shankShape1, extrudeSettings);
      const shankMesh1 = new THREE.Mesh(shankGeo1, chromeMaterial);
      blade1Group.add(shankMesh1);

      // Finger Ring 1
      const ringGeo1 = new THREE.TorusGeometry(0.28, 0.04, 16, 36);
      const ringMesh1 = new THREE.Mesh(ringGeo1, chromeMaterial);
      ringMesh1.position.set(-0.24, -1.18, 0.018);
      blade1Group.add(ringMesh1);

      // Pinky rest (tang) curving from ring 1
      const tangCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.48, -1.25, 0.018),
        new THREE.Vector3(-0.62, -1.35, 0.018),
        new THREE.Vector3(-0.70, -1.50, 0.018),
      ]);
      const tangGeo = new THREE.TubeGeometry(tangCurve, 16, 0.025, 12, false);
      const tangMesh = new THREE.Mesh(tangGeo, chromeMaterial);
      blade1Group.add(tangMesh);

      // 3. Blade & Handle 2 (Right - opposing blade)
      const blade2Group = new THREE.Group();
      blade2GroupRef.current = blade2Group;

      const bladeMesh2 = new THREE.Mesh(bladeGeo1, chromeMaterial);
      bladeMesh2.scale.set(-1, 1, 1);
      blade2Group.add(bladeMesh2);

      const shankMesh2 = new THREE.Mesh(shankGeo1, chromeMaterial);
      shankMesh2.scale.set(-1, 1, 1);
      blade2Group.add(shankMesh2);

      // Offset thumb ring 2 (angled for ergonomic crane style)
      const ringGeo2 = new THREE.TorusGeometry(0.26, 0.04, 16, 36);
      const ringMesh2 = new THREE.Mesh(ringGeo2, chromeMaterial);
      ringMesh2.position.set(0.22, -1.05, 0.018);
      ringMesh2.rotation.z = -0.15;
      blade2Group.add(ringMesh2);

      // Initial poised open angle (8 degrees)
      blade1Group.rotation.z = -0.12;
      blade2Group.rotation.z = 0.12;

      scissors.add(blade1Group);
      scissors.add(blade2Group);

      // Optimal scale for desktop right-side framing
      scissors.scale.set(1.35, 1.35, 1.35);

      return scissors;
    },
    []
  );

  // Build flowing 3D silk ribbon / hair curves
  const buildSilkRibbon = useCallback((ribbonMaterial: THREE.Material) => {
    const points = [
      new THREE.Vector3(-1.8, -2.2, -0.6),
      new THREE.Vector3(-0.9, -1.0, 0.4),
      new THREE.Vector3(0.1, 0.2, 0.6),
      new THREE.Vector3(1.2, 1.1, 0.1),
      new THREE.Vector3(2.0, 2.2, -0.5),
    ];
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const tubeGeo = new THREE.TubeGeometry(curve, 72, 0.035, 16, false);
    const ribbon = new THREE.Mesh(tubeGeo, ribbonMaterial);
    ribbonMeshRef.current = ribbon;
    return ribbon;
  }, []);

  useEffect(() => {
    if (!isInteractive) return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 700;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);
    cameraRef.current = camera;

    // 2. High-DPI WebGL Renderer with Alpha Channel
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Studio Environment Map for Chrome Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const grad = envCtx.createLinearGradient(0, 0, 512, 256);
      grad.addColorStop(0, '#161514');
      grad.addColorStop(0.3, '#f5efe6');
      grad.addColorStop(0.5, '#ffffff');
      grad.addColorStop(0.7, '#d6c4aa');
      grad.addColorStop(1, '#1a1918');
      envCtx.fillStyle = grad;
      envCtx.fillRect(0, 0, 512, 256);

      // Studio softbox highlights
      envCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      envCtx.fillRect(180, 20, 160, 90);
      envCtx.fillStyle = 'rgba(230, 210, 180, 0.7)';
      envCtx.fillRect(360, 120, 90, 80);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    const studioEnvMap = pmremGenerator.fromEquirectangular(envTexture).texture;
    scene.environment = studioEnvMap;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.0);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffeedd, 1.2, 10);
    fillLight.position.set(0, 3, 2);
    scene.add(fillLight);

    // 5. Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
      envMapIntensity: 2.0,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.16,
      envMapIntensity: 1.6,
    });

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xc5a880,
      metalness: 0.7,
      roughness: 0.28,
      envMapIntensity: 1.4,
    });

    // 6. Master Composition
    const mainGroup = new THREE.Group();
    mainGroupRef.current = mainGroup;
    scene.add(mainGroup);

    const shears = buildScissors(chromeMat, goldMat);
    shears.position.set(0, 0.1, 0.2);
    shears.rotation.set(-0.25, -0.35, 0.22);
    mainGroup.add(shears);

    const ribbon = buildSilkRibbon(ribbonMat);
    ribbon.position.set(0, 0, -0.2);
    mainGroup.add(ribbon);

    // Subtle floating satellite spheres
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1,
      transparent: true,
      roughness: 0.08,
      ior: 1.5,
      thickness: 1.0,
      envMapIntensity: 1.5,
    });
    const orb1 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), orbMat);
    orb1.position.set(-1.2, 1.2, -0.4);
    mainGroup.add(orb1);

    const orb2 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 32), goldMat);
    orb2.position.set(1.4, -1.1, 0.3);
    mainGroup.add(orb2);

    // 7. Mouse tracking & Hover handlers
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const nx = (e.clientX - centerX) / (window.innerWidth / 2);
      const ny = -(e.clientY - centerY) / (window.innerHeight / 2);
      mouseRef.current.targetX = Math.max(-1.5, Math.min(1.5, nx));
      mouseRef.current.targetY = Math.max(-1.5, Math.min(1.5, ny));
    };

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      mouseRef.current.targetX = 0;
      mouseRef.current.targetY = 0;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 700;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 9. 60 FPS Render Loop
    const startTime = performance.now();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Lerp pointer position
      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.05;

      const progress = scrollProgressRef.current;

      // Container fade out and drift outward as user scrolls down
      if (mountRef.current) {
        const visualOpacity = Math.max(0, 1 - progress * 2.6);
        mountRef.current.style.opacity = visualOpacity.toString();
        mountRef.current.style.transform = `translate3d(${progress * 60}px, -${progress * 40}px, 0)`;
        mountRef.current.style.pointerEvents = visualOpacity < 0.1 ? 'none' : 'auto';
      }

      // If user has scrolled past into walkthrough, pause heavy render
      if (progress > 0.4) return;

      // Natural continuous buoyancy floating
      const floatSin = Math.sin(elapsedTime * 1.3);
      const floatCos = Math.cos(elapsedTime * 0.95);

      if (mainGroupRef.current) {
        const grp = mainGroupRef.current;
        grp.rotation.x = -0.25 + m.y * 0.35 + floatCos * 0.03;
        grp.rotation.y = -0.35 + m.x * 0.45 + floatSin * 0.04;
        grp.position.y = floatSin * 0.07;
        grp.position.z = m.y * 0.15;
      }

      // Interactive hover response: scissors gently open and flex on hover
      const targetBladeAngle = isHoveredRef.current ? 0.24 : 0.12;
      if (blade1GroupRef.current && blade2GroupRef.current) {
        blade1GroupRef.current.rotation.z +=
          (-targetBladeAngle - blade1GroupRef.current.rotation.z) * 0.08;
        blade2GroupRef.current.rotation.z +=
          (targetBladeAngle - blade2GroupRef.current.rotation.z) * 0.08;
      }

      // Ribbon undulating movement
      if (ribbonMeshRef.current) {
        ribbonMeshRef.current.rotation.y = elapsedTime * 0.1 + m.x * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      studioEnvMap.dispose();
    };
  }, [buildScissors, buildSilkRibbon, scrollProgressRef, isInteractive]);

  if (!isInteractive) return null;

  return (
    <div
      ref={mountRef}
      className="relative w-full h-[520px] sm:h-[600px] lg:h-[680px] cursor-grab active:cursor-grabbing transition-opacity duration-300 select-none pointer-events-auto"
      style={{
        filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.45))',
      }}
    />
  );
};

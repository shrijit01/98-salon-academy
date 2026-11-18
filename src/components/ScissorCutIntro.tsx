import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface ScissorCutIntroProps {
  onComplete: () => void;
}

export const ScissorCutIntro: React.FC<ScissorCutIntroProps> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const topCurtainRef = useRef<HTMLDivElement | null>(null);
  const bottomCurtainRef = useRef<HTMLDivElement | null>(null);
  const cutLineRef = useRef<HTMLDivElement | null>(null);
  const brandCenterRef = useRef<HTMLDivElement | null>(null);

  const [isDone, setIsDone] = useState(false);

  // References for Three.js scissor blades
  const blade1Ref = useRef<THREE.Group | null>(null);
  const blade2Ref = useRef<THREE.Group | null>(null);
  const scissorsGroupRef = useRef<THREE.Group | null>(null);

  const handleFinish = useCallback(() => {
    setIsDone(true);
    onComplete();
  }, [onComplete]);

  // Build realistic sculptural chrome shears with accurate pro salon proportions
  const buildScissors = useCallback(
    (chromeMaterial: THREE.Material, goldMaterial: THREE.Material) => {
      const scissors = new THREE.Group();

      const extrudeSettings = {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.012,
        bevelThickness: 0.012,
      };

      // 1. Pivot Assembly
      const pivotBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.09, 32),
        goldMaterial
      );
      pivotBase.rotation.x = Math.PI / 2;
      scissors.add(pivotBase);

      const tensionKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.035, 32),
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

      // 2. Blade & Handle 1 (Upper cutting blade)
      const blade1Group = new THREE.Group();
      blade1Ref.current = blade1Group;

      const bladeShape1 = new THREE.Shape();
      bladeShape1.moveTo(0, 0);
      bladeShape1.lineTo(0.08, 0.5);
      bladeShape1.lineTo(0.065, 1.3);
      bladeShape1.lineTo(0.015, 2.2); // Needle-sharp cutting tip
      bladeShape1.lineTo(-0.02, 2.2);
      bladeShape1.lineTo(-0.035, 1.3);
      bladeShape1.lineTo(-0.055, 0.5);
      bladeShape1.closePath();

      const bladeGeo1 = new THREE.ExtrudeGeometry(bladeShape1, extrudeSettings);
      const bladeMesh1 = new THREE.Mesh(bladeGeo1, chromeMaterial);
      blade1Group.add(bladeMesh1);

      // Ergonomic handle shank
      const shankShape1 = new THREE.Shape();
      shankShape1.moveTo(0, 0);
      shankShape1.lineTo(-0.07, -0.4);
      shankShape1.lineTo(-0.16, -0.85);
      shankShape1.lineTo(-0.07, -0.85);
      shankShape1.lineTo(0.03, -0.4);
      shankShape1.closePath();

      const shankGeo1 = new THREE.ExtrudeGeometry(shankShape1, extrudeSettings);
      const shankMesh1 = new THREE.Mesh(shankGeo1, chromeMaterial);
      blade1Group.add(shankMesh1);

      // Finger Ring
      const ringGeo1 = new THREE.TorusGeometry(0.26, 0.038, 16, 36);
      const ringMesh1 = new THREE.Mesh(ringGeo1, chromeMaterial);
      ringMesh1.position.set(-0.24, -1.12, 0.018);
      blade1Group.add(ringMesh1);

      // Curved pinky tang
      const tangCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.46, -1.20, 0.018),
        new THREE.Vector3(-0.60, -1.30, 0.018),
        new THREE.Vector3(-0.68, -1.45, 0.018),
      ]);
      const tangGeo = new THREE.TubeGeometry(tangCurve, 16, 0.022, 12, false);
      const tangMesh = new THREE.Mesh(tangGeo, chromeMaterial);
      blade1Group.add(tangMesh);

      // 3. Blade & Handle 2 (Lower opposing blade)
      const blade2Group = new THREE.Group();
      blade2Ref.current = blade2Group;

      const bladeMesh2 = new THREE.Mesh(bladeGeo1, chromeMaterial);
      bladeMesh2.scale.set(-1, 1, 1);
      blade2Group.add(bladeMesh2);

      const shankMesh2 = new THREE.Mesh(shankGeo1, chromeMaterial);
      shankMesh2.scale.set(-1, 1, 1);
      blade2Group.add(shankMesh2);

      const ringGeo2 = new THREE.TorusGeometry(0.24, 0.038, 16, 36);
      const ringMesh2 = new THREE.Mesh(ringGeo2, chromeMaterial);
      ringMesh2.position.set(0.20, -0.98, 0.018);
      ringMesh2.rotation.z = -0.15;
      blade2Group.add(ringMesh2);

      scissors.add(blade1Group);
      scissors.add(blade2Group);

      // Rotate 90 degrees around Z so blade points right (+X direction)
      scissors.rotation.z = -Math.PI / 2;

      // Refined, sleek scale so shears look realistic and agile across the screen
      scissors.scale.set(0.85, 0.85, 0.85);

      // Initial placement: completely offscreen left
      scissors.position.set(-4.5, 0, 0.8);

      scissorsGroupRef.current = scissors;
      return scissors;
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // Studio Environment Reflections
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

      envCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      envCtx.fillRect(180, 20, 160, 90);
      envCtx.fillStyle = 'rgba(230, 210, 180, 0.7)';
      envCtx.fillRect(360, 120, 90, 80);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = pmremGenerator.fromEquirectangular(envTexture).texture;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.1);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd4af37, 2.4);
    rimLight.position.set(-4, -3, -3);
    scene.add(rimLight);

    // Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.05,
      envMapIntensity: 2.5,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      envMapIntensity: 1.8,
    });

    const scissors = buildScissors(chromeMat, goldMat);
    scene.add(scissors);

    const render = () => {
      renderer.render(scene, camera);
    };

    render();

    // Compute camera frustum at z = 0.8 for responsive world coordinates
    const distToPlane = 6.0 - 0.8;
    const vHeight = 2 * distToPlane * Math.tan((36 * Math.PI) / 360);
    const vWidth = vHeight * (width / height);
    const startX = -(vWidth / 2 + 2.05);
    const endX = vWidth / 2 + 1.25;

    // GSAP Master Timeline for the Scissor Cut Sequence
    // Total Duration: ~2.1s
    const animState = {
      xPos: startX,
      bladeAngle: 0.18,
    };

    const tl = gsap.timeline({
      onUpdate: () => {
        if (scissorsGroupRef.current) {
          scissorsGroupRef.current.position.x = animState.xPos;
          scissorsGroupRef.current.position.y = 0;
          scissorsGroupRef.current.position.z = 0.8;
        }

        if (blade1Ref.current && blade2Ref.current) {
          blade1Ref.current.rotation.z = -animState.bladeAngle;
          blade2Ref.current.rotation.z = animState.bladeAngle;
        }

        // Advance the golden cut line precisely at the advancing scissor tip
        if (cutLineRef.current) {
          const bladeTipX = animState.xPos + 1.87;
          const leftScreenX = -vWidth / 2;
          const cutPercent = Math.max(0, Math.min(100, ((bladeTipX - leftScreenX) / vWidth) * 100));
          cutLineRef.current.style.width = `${cutPercent}%`;
        }

        render();
      },
      onComplete: () => {
        handleFinish();
      },
    });

    // Step 1: Subtle brand fade on the ivory curtain
    tl.to(brandCenterRef.current, {
      opacity: 0,
      duration: 0.35,
      delay: 0.15,
      ease: 'power2.out',
    });

    // Step 2: Shears travel from Left to Right across screen
    tl.to(
      animState,
      {
        xPos: endX,
        duration: 1.4,
        ease: 'power1.inOut',
      },
      '-=0.1'
    );

    // Synchronized rhythmic snip cycles (7 cycles open/close)
    tl.to(
      animState,
      {
        bladeAngle: 0.02, // Snip closed
        duration: 0.175,
        ease: 'power2.in',
        repeat: 7,
        yoyo: true,
      },
      '<'
    );

    // Step 3: Screen separates behind the advancing blade tips (starts halfway through the cut)
    tl.to(
      topCurtainRef.current,
      {
        yPercent: -100,
        rotate: -0.8,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '-=0.8'
    );

    tl.to(
      bottomCurtainRef.current,
      {
        yPercent: 100,
        rotate: 0.8,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      '<'
    );

    // Step 4: Golden cut line fades as curtains separate
    tl.to(
      cutLineRef.current,
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      '-=0.3'
    );

    // Step 5: Container exit
    tl.to(
      containerRef.current,
      {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
      },
      '-=0.15'
    );

    return () => {
      tl.kill();
      renderer.dispose();
      pmremGenerator.dispose();
    };
  }, [buildScissors, handleFinish]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden"
    >
      {/* 
        TOP CURTAIN PANEL (Half 1)
        Warm luxury ivory covering top 50.5% of viewport
      */}
      <div
        ref={topCurtainRef}
        className="absolute top-0 left-0 w-full h-[50.5%] bg-[#FAF8F5] border-b border-[#C5A880]/30 shadow-2xl origin-bottom-left will-change-transform z-10 flex items-end justify-center pb-8"
      >
        <div
          ref={brandCenterRef}
          className="text-center transition-opacity duration-300"
        >
          <span className="text-[10px] sm:text-[11px] tracking-[0.4em] uppercase font-sans text-[#9C7E55] font-medium block mb-2">
            WELCOME TO REWA
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-[-0.02em] text-[#161514]">
            98 SALON &amp; ACADEMY
          </h2>
        </div>
      </div>

      {/* 
        BOTTOM CURTAIN PANEL (Half 2)
        Warm luxury ivory covering bottom 50.5% of viewport
      */}
      <div
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 w-full h-[50.5%] bg-[#FAF8F5] border-t border-[#C5A880]/30 shadow-2xl origin-top-left will-change-transform z-10 flex items-start justify-center pt-8"
      >
        <div className="text-center">
          <span className="text-xs text-[#9C7E55] font-hindi font-light tracking-wide">
            सौंदर्य, आत्मविश्वास और रचनात्मकता
          </span>
        </div>
      </div>

      {/* 
        GOLD CUTTING LINE
        Traces behind the advancing shears across the screen
      */}
      <div
        ref={cutLineRef}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880] to-[#FAF8F5] shadow-[0_0_12px_rgba(197,168,128,1)] z-20 will-change-transform pointer-events-none"
        style={{ width: '0%' }}
      />

      {/* 
        THREE.JS 3D SCISSORS CANVAS
        Renders the realistic polished chrome shears cutting horizontally across
      */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Quiet Skip Button */}
      <button
        onClick={handleFinish}
        className="absolute top-6 right-8 text-[10px] tracking-[0.25em] uppercase font-sans text-[#646059] hover:text-[#161514] transition-colors z-40 cursor-pointer py-1.5 px-3.5 border border-[#E8E2D8] hover:border-[#161514] bg-white/80 backdrop-blur-sm shadow-xs"
      >
        Skip Intro &rarr;
      </button>
    </div>
  );
};

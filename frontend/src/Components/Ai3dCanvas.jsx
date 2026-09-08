import { useEffect, useRef } from "react";
import * as THREE from "three";
import robot1Img from "../assets/robot1.png";

export default function Ai3dCanvas() {
  const mountRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // ---------- Lighting ----------
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 3.2);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 5.0, 15);
    amberLight.position.set(3, -2, 3);
    scene.add(amberLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ---------- Main Robot Image Plane ----------
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(robot1Img, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      const aspect = texture.image.width / texture.image.height;
      const planeGeo = new THREE.PlaneGeometry(3.6 * aspect, 3.6);
      const planeMat = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: true,
        roughness: 0.2,
        metalness: 0.1,
        depthWrite: false,
      });
      const robotMesh = new THREE.Mesh(planeGeo, planeMat);
      robotMesh.position.set(0, -0.1, 0);
      mainGroup.add(robotMesh);
    });

    // ---------- Shared 3D Materials for Floating Components ----------
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.15,
      metalness: 0.8,
    });

    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.3,
    });

    const amberGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfcb316,
      emissive: 0xd97706,
      emissiveIntensity: 1.8,
      roughness: 0.1,
    });

    const cyanGlowMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 2.0,
      roughness: 0.1,
    });

    // ---------- Floating 3D Micro-Components Collection ----------
    const microBits = [];

    // 1. Floating 3D Octahedron Diamonds
    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.18), i % 2 === 0 ? goldMat : amberGlowMat);
      const angle = (i / 4) * Math.PI * 2 + 0.5;
      const radius = 2.1 + (i % 2) * 0.4;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.5);
      mainGroup.add(mesh);
      microBits.push({
        mesh,
        baseY: mesh.position.y,
        speedY: 0.008 + i * 0.003,
        rotSpeedX: 0.015,
        rotSpeedY: 0.02,
        phase: i * 1.5,
      });
    }

    // 2. Floating 3D AI Data Cubes
    for (let i = 0; i < 4; i++) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), whiteMat);
      const angle = (i / 4) * Math.PI * 2 + 1.2;
      const radius = 2.0 + (i % 2) * 0.5;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.2);
      mainGroup.add(mesh);
      microBits.push({
        mesh,
        baseY: mesh.position.y,
        speedY: 0.006 + i * 0.002,
        rotSpeedX: -0.012,
        rotSpeedY: 0.018,
        phase: i * 2.0,
      });
    }

    // 3. Floating 3D Torus Rings
    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.03, 16, 32), goldMat);
      const angle = (i / 3) * Math.PI * 2 + 2.1;
      const radius = 2.2;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.0);
      mesh.rotation.x = Math.PI / 4;
      mainGroup.add(mesh);
      microBits.push({
        mesh,
        baseY: mesh.position.y,
        speedY: 0.009,
        rotSpeedX: 0.01,
        rotSpeedY: -0.025,
        phase: i * 2.5,
      });
    }

    // 4. Floating 3D Glowing Spheres & Particles
    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + (i % 3) * 0.03, 16, 16),
        i % 2 === 0 ? cyanGlowMat : amberGlowMat
      );
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.4 + (i % 3) * 0.3;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (Math.random() - 0.5) * 1.8);
      mainGroup.add(mesh);
      microBits.push({
        mesh,
        baseY: mesh.position.y,
        speedY: 0.012,
        rotSpeedX: 0.01,
        rotSpeedY: 0.01,
        phase: i * 0.8,
      });
    }

    // Pointer Interaction
    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      targetRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener("pointermove", handlePointerMove);

    // ---------- Animation Loop ----------
    let frame = 0;
    let rafId;

    const animate = () => {
      frame += 0.015;

      // Smooth Parallax tilt
      const targetRotX = targetRef.current.y * 0.3;
      const targetRotY = targetRef.current.x * 0.4;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;

      // Animate floating micro-bits
      microBits.forEach((bit) => {
        bit.mesh.position.y = bit.baseY + Math.sin(frame + bit.phase) * 0.15;
        bit.mesh.rotation.x += bit.rotSpeedX;
        bit.mesh.rotation.y += bit.rotSpeedY;
      });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative z-10"
      style={{ background: "transparent" }}
    />
  );
}

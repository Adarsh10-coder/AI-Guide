import { useEffect, useRef } from "react";
import * as THREE from "three";

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
        camera.position.set(0, 0, 7.8);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        mount.appendChild(renderer.domElement);

        // ---------- Studio Lighting (Matching render specular reflections) ----------
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xfff5e6, 3.0);
        mainLight.position.set(5, 6, 5);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const orangeRim = new THREE.PointLight(0xff9900, 4.5, 15);
        orangeRim.position.set(-4, -3, 3);
        scene.add(orangeRim);

        const silverRim = new THREE.PointLight(0xe2e8f0, 4.0, 15);
        silverRim.position.set(4, -2, -2);
        scene.add(silverRim);

        const bottomFill = new THREE.DirectionalLight(0xffffff, 0.8);
        bottomFill.position.set(0, -5, 2);
        scene.add(bottomFill);

        // ---------- Materials ----------
        // 1. Central Frosted Glass Sphere Material
        const glassSphereMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 0.85,
            opacity: 0.95,
            transparent: true,
            roughness: 0.12,
            metalness: 0.05,
            ior: 1.45,
            reflectivity: 0.8,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08,
        });

        // 2. Inner Glowing Core
        const innerCoreMat = new THREE.MeshStandardMaterial({
            color: 0xffa500,
            emissive: 0xff6b00,
            emissiveIntensity: 0.7,
            roughness: 0.2,
            metalness: 0.1,
        });

        // 3. Wavy Ribbon Ring Materials
        const orangeRibbonMat = new THREE.MeshStandardMaterial({
            color: 0xff8c00,
            roughness: 0.18,
            metalness: 0.55,
        });

        const silverRibbonMat = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            roughness: 0.12,
            metalness: 0.92,
        });

        const darkRibbonMat = new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            roughness: 0.22,
            metalness: 0.8,
        });

        const goldRibbonMat = new THREE.MeshStandardMaterial({
            color: 0xffb703,
            roughness: 0.15,
            metalness: 0.65,
        });

        // Main 3D Container
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // ---------- Central Glass Sphere & Inner Core ----------
        const centralSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.85, 64, 64),
            glassSphereMat
        );
        centralSphere.castShadow = true;
        centralSphere.receiveShadow = true;
        mainGroup.add(centralSphere);

        const innerCore = new THREE.Mesh(
            new THREE.SphereGeometry(0.48, 32, 32),
            innerCoreMat
        );
        mainGroup.add(innerCore);

        // ---------- Wavy Orbital Ribbon Rings ----------
        const createWavyRing = (radius, tubeRadius, material, rotX, rotY, rotZ, freq, amp, speed) => {
            // Slightly flattened tube geometry for ribbon effect
            const geo = new THREE.TorusGeometry(radius, tubeRadius, 24, 128);

            // Store original base positions for dynamic wave vertex deformation
            const basePos = new Float32Array(geo.attributes.position.array);
            geo.userData = { basePos, freq, amp, speed, radius };

            const mesh = new THREE.Mesh(geo, material);
            mesh.rotation.set(rotX, rotY, rotZ);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mainGroup.add(mesh);
            return mesh;
        };

        const wavyRings = [
            createWavyRing(1.65, 0.12, orangeRibbonMat, Math.PI / 3, Math.PI / 5, 0.2, 4, 0.22, 2.2),
            createWavyRing(1.85, 0.10, silverRibbonMat, -Math.PI / 4, -Math.PI / 3, -0.4, 3, 0.26, -1.8),
            createWavyRing(2.05, 0.11, darkRibbonMat, Math.PI / 5, -Math.PI / 2.2, 0.6, 5, 0.20, 2.5),
            createWavyRing(2.25, 0.09, goldRibbonMat, -Math.PI / 2.5, Math.PI / 4, -0.7, 4, 0.28, -2.0),
        ];

        // Pointer Interaction
        const handlePointerMove = (e) => {
            const rect = mount.getBoundingClientRect();
            const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
            targetRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
            targetRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
        };
        window.addEventListener("pointermove", handlePointerMove);

        // Animation Loop
        let frame = 0;
        let rafId;
        const animate = () => {
            frame += 0.015;

            // Mouse Parallax target
            const targetRotX = targetRef.current.y * 0.45;
            const targetRotY = targetRef.current.x * 0.55;

            mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.05;
            mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.05;

            // Floating float bob
            mainGroup.position.y = Math.sin(frame * 0.8) * 0.12;
            mainGroup.position.x = Math.cos(frame * 0.6) * 0.08;

            // Slowly rotate central sphere
            centralSphere.rotation.y = frame * 0.2;
            innerCore.rotation.y = -frame * 0.4;

            // Dynamic Waving deformation of orbital ribbon rings like liquid waves
            wavyRings.forEach((ringMesh) => {
                const geo = ringMesh.geometry;
                const pos = geo.attributes.position.array;
                const base = geo.userData.basePos;
                const { freq, amp, speed, radius } = geo.userData;
                const vertCount = pos.length / 3;

                for (let i = 0; i < vertCount; i++) {
                    const x = base[i * 3];
                    const y = base[i * 3 + 1];
                    const z = base[i * 3 + 2];

                    const angle = Math.atan2(z, x);
                    const wave1 = Math.sin(angle * freq + frame * speed) * amp;
                    const wave2 = Math.cos(angle * (freq - 1) - frame * (speed * 0.8)) * (amp * 0.6);

                    const scale = 1 + (wave1 + wave2) / radius;
                    pos[i * 3] = x * scale;
                    pos[i * 3 + 1] = y + Math.sin(angle * freq + frame * speed) * (amp * 0.8);
                    pos[i * 3 + 2] = z * scale;
                }

                geo.attributes.position.needsUpdate = true;
                geo.computeVertexNormals();

                // Slow rotation of each ring
                ringMesh.rotation.z += 0.003;
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

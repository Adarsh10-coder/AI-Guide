import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function RobotCanvas() {
  const mountRef = useRef(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = null; // no solid backdrop — canvas stays fully transparent

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0.15, 7.6);
    camera.lookAt(0, -0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent, kills the purple wash
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ---------- Lighting ----------
    // Kept the purple accent lights (for the glow/emissive parts) but toned the
    // ambient way down and boosted a neutral white fill so the body reads as
    // solid/opaque instead of washed in a purple tint.
    const ambient = new THREE.AmbientLight(0x30303a, 0.9);
    scene.add(ambient);

    const key = new THREE.PointLight(0xb47ef0, 14, 20);
    key.position.set(2.5, 3, 3);
    scene.add(key);

    const rim = new THREE.PointLight(0x8a2be2, 10, 20);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    const fill = new THREE.PointLight(0xffffff, 7, 20);
    fill.position.set(0, 1.5, 4.5);
    scene.add(fill);

    const topFill = new THREE.DirectionalLight(0xffffff, 1.1);
    topFill.position.set(1, 4, 2);
    scene.add(topFill);

    // soft light from below to sell the "floating" feel
    const underLight = new THREE.PointLight(0xd6b8ff, 6, 10);
    underLight.position.set(0, -2.4, 1);
    scene.add(underLight);

    // ---------- Materials ----------
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x2c1436,
      metalness: 0.55,
      roughness: 0.32,
      emissive: 0x150714,
      emissiveIntensity: 0.25,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0x9642e8,
      metalness: 0.4,
      roughness: 0.28,
      emissive: 0x6a1fc0,
      emissiveIntensity: 0.5,
    });
    const glowMat = new THREE.MeshStandardMaterial({
      color: 0xc79bf5,
      emissive: 0xc79bf5,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    // Solid, opaque white — no dark emissive tint, so it doesn't read as
    // translucent or purple-shaded next to the transparent background.
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xfbfaff,
      metalness: 0.18,
      roughness: 0.38,
      emissive: 0x050505,
      emissiveIntensity: 0.05,
    });
    const whiteGlossMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.45,
      roughness: 0.1,
      emissive: 0x0a0a0a,
      emissiveIntensity: 0.05,
    });
    const darkGlassMat = new THREE.MeshStandardMaterial({
      color: 0x0d0d0f,
      metalness: 0.8,
      roughness: 0.15,
    });
    const rivetMat = new THREE.MeshStandardMaterial({
      color: 0xe6def5,
      metalness: 0.6,
      roughness: 0.25,
    });

    const robot = new THREE.Group();
    scene.add(robot);

    // ---------- Torso ----------
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.05, 1.6, 28), bodyMat);
    torso.position.y = -1.3;
    torso.castShadow = true;
    robot.add(torso);

    // large white chest plate
    const chestPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(0.62, 0.72, 1.05, 24, 1, false, -Math.PI / 2.6, Math.PI / 1.3),
      whiteMat
    );
    chestPlate.position.set(0, -1.15, 0.15);
    chestPlate.rotation.y = Math.PI;
    robot.add(chestPlate);

    // side wing panels flanking the chest (extra white surface + detail)
    [-1, 1].forEach((side) => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.75, 0.5, 2, 2, 2), whiteMat);
      wing.position.set(side * 0.78, -1.2, 0.35);
      wing.rotation.y = side * 0.35;
      robot.add(wing);

      const wingTrim = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.75, 0.05), trimMat);
      wingTrim.position.set(side * 0.92, -1.2, 0.55);
      robot.add(wingTrim);
    });

    // waist band (white trim ring)
    const waistBand = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 12, 32), whiteGlossMat);
    waistBand.rotation.x = Math.PI / 2;
    waistBand.position.y = -2.05;
    robot.add(waistBand);

    // core glow
    const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.03, 12, 32), whiteGlossMat);
    coreRing.position.set(0, -1.1, 0.9);
    robot.add(coreRing);
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.2, 24, 24), glowMat);
    core.position.set(0, -1.1, 0.87);
    robot.add(core);

    // vent slits on chest for surface detail
    [-0.22, -0.08, 0.06, 0.2].forEach((y) => {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.02, 0.02), trimMat);
      vent.position.set(0, -1.75 + y, 0.72);
      robot.add(vent);
    });

    // small chest rivets
    [-0.4, 0.4].forEach((x) => {
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), rivetMat);
      rivet.position.set(x, -1.65, 0.75);
      robot.add(rivet);
    });

    // ---------- Lower body / hover skirt ----------
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.55, 0.55, 28, 1, true), bodyMat);
    skirt.position.y = -2.35;
    robot.add(skirt);

    // white plating strips around the skirt
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.4, 0.05), whiteMat);
      plate.position.set(Math.cos(angle) * 0.98, -2.3, Math.sin(angle) * 0.98);
      plate.rotation.y = -angle;
      robot.add(plate);
    }

    const skirtTrim = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.05, 10, 28), trimMat);
    skirtTrim.rotation.x = Math.PI / 2;
    skirtTrim.position.y = -2.62;
    robot.add(skirtTrim);

    // hover thrusters underneath (glow rings) — reinforces the floating look
    const thrusterGroup = new THREE.Group();
    thrusterGroup.position.y = -2.68;
    robot.add(thrusterGroup);
    const thrusterPositions = [
      [0, 0.02],
      [0.35, -0.02],
      [-0.35, -0.02],
    ];
    const thrusterGlows = [];
    thrusterPositions.forEach(([x, z]) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.03, 10, 24), glowMat.clone());
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0, z);
      thrusterGroup.add(ring);
      thrusterGlows.push(ring);
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.12, 20), whiteMat);
      housing.position.set(x, 0.08, z);
      thrusterGroup.add(housing);
    });

    // ---------- Shoulders / Arms ----------
    const armsGroup = new THREE.Group();
    robot.add(armsGroup);

    [-1, 1].forEach((side) => {
      const armPivot = new THREE.Group();
      armPivot.position.set(side * 1.05, -0.65, 0);
      armsGroup.add(armPivot);

      // layered pauldron (shoulder armor) — sphere base + white plate cap
      const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 20), whiteMat);
      shoulder.position.set(0, 0, 0);
      armPivot.add(shoulder);

      const pauldronCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2.4),
        whiteMat
      );
      pauldronCap.position.set(0, 0.08, 0);
      armPivot.add(pauldronCap);

      const shoulderTrim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.035, 10, 24), trimMat);
      shoulderTrim.rotation.y = Math.PI / 2;
      armPivot.add(shoulderTrim);

      const upperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.75, 16), bodyMat);
      upperArm.position.set(side * 0.08, -0.5, 0.05);
      upperArm.rotation.z = side * 0.12;
      armPivot.add(upperArm);

      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), trimMat);
      elbow.position.set(side * 0.14, -0.95, 0.08);
      armPivot.add(elbow);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.55, 16), whiteMat);
      forearm.position.set(side * 0.16, -1.32, 0.12);
      forearm.rotation.z = side * 0.05;
      armPivot.add(forearm);

      // forearm plate accent
      const forearmPlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.03), trimMat);
      forearmPlate.position.set(side * 0.16, -1.32, 0.24);
      armPivot.add(forearmPlate);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 16), bodyMat);
      hand.position.set(side * 0.18, -1.65, 0.15);
      armPivot.add(hand);

      // small knuckle glow
      const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 10), glowMat);
      knuckle.position.set(side * 0.18, -1.72, 0.24);
      armPivot.add(knuckle);
    });

    // ---------- Neck ----------
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.35, 16), trimMat);
    neck.position.y = -0.32;
    robot.add(neck);

    const neckRing = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 20), whiteGlossMat);
    neckRing.rotation.x = Math.PI / 2;
    neckRing.position.y = -0.18;
    robot.add(neckRing);

    // ---------- Head ----------
    const head = new THREE.Group();
    head.position.set(0, 0.35, 0);
    robot.add(head);

    const skull = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.95, 1.05, 4, 4, 4), bodyMat);
    head.add(skull);

    // white crown / faceplate cap
    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.1),
      whiteMat
    );
    crown.position.set(0, 0.42, 0);
    head.add(crown);

    const faceplate = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.12, 4, 4, 1), whiteMat);
    faceplate.position.set(0, -0.05, 0.5);
    head.add(faceplate);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.32, 0.15), darkGlassMat);
    visor.position.set(0, 0.05, 0.55);
    head.add(visor);

    const eyeGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const eyeL = new THREE.Mesh(eyeGeo, glowMat);
    eyeL.position.set(-0.28, 0.05, 0.64);
    const eyeR = new THREE.Mesh(eyeGeo, glowMat);
    eyeR.position.set(0.28, 0.05, 0.64);
    head.add(eyeL, eyeR);

    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), trimMat);
    stalk.position.set(0, 0.72, 0);
    head.add(stalk);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 16), glowMat);
    tip.position.set(0, 0.94, 0);
    head.add(tip);

    [-1, 1].forEach((side) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.07, 20), whiteMat);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(side * 0.63, 0, 0);
      head.add(ear);
      const earTrim = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.02, 8, 20), trimMat);
      earTrim.rotation.y = Math.PI / 2;
      earTrim.position.set(side * 0.66, 0, 0);
      head.add(earTrim);
    });

    // jaw panel line detail
    const jawLine = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.02), trimMat);
    jawLine.position.set(0, -0.3, 0.53);
    head.add(jawLine);

    // ---------- Back fin / antenna array (extra silhouette detail) ----------
    const backFin = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.9, 4), whiteMat);
    backFin.position.set(0, -0.6, -0.75);
    backFin.rotation.x = Math.PI;
    backFin.rotation.y = Math.PI / 4;
    robot.add(backFin);

    const backFinTrim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 16), trimMat);
    backFinTrim.position.set(0, -0.3, -0.75);
    robot.add(backFinTrim);

    robot.position.y = 0.85;
    robot.rotation.y = 0.15;

    // ---------- Floating shadow ellipse beneath the robot ----------
    const shadowGeo = new THREE.CircleGeometry(0.9, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.9;
    scene.add(shadowMesh);

    // ---------- Ambient floating dust / energy particles ----------
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe8ddfa,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ---------- Interaction ----------
    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      targetRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };
    window.addEventListener("pointermove", handlePointerMove);

    let frame = 0;
    let rafId;
    const animate = () => {
      frame += 0.01;

      const targetYaw = targetRef.current.x * 0.6;
      const targetPitch = targetRef.current.y * 0.35;

      head.rotation.y += (targetYaw - head.rotation.y) * 0.08;
      head.rotation.x += (targetPitch - head.rotation.x) * 0.08;

      // stronger float bob + slight sway to sell weightlessness
      const bob = Math.sin(frame) * 0.12;
      robot.position.y = 0.85 + bob;
      robot.rotation.z = Math.sin(frame * 0.6) * 0.03;
      robot.rotation.y = 0.15 + Math.sin(frame * 0.4) * 0.05;

      // shadow scales/fades inversely with height to sell the float
      const shadowScale = 1 - bob * 0.35;
      shadowMesh.scale.set(shadowScale, shadowScale, shadowScale);
      shadowMat.opacity = 0.35 - bob * 0.12;

      // thruster glow pulses
      thrusterGlows.forEach((ring, i) => {
        ring.material.emissiveIntensity = 1.6 + Math.sin(frame * 3 + i) * 0.6;
      });

      const pulse = 1.8 + Math.sin(frame * 2.4) * 0.4;
      glowMat.emissiveIntensity = pulse;

      // drift particles gently upward, wrap around
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += 0.003;
        if (pos[i * 3 + 1] > 2.5) pos[i * 3 + 1] = -1.5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
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
      className="w-full h-full"
      style={{ background: "transparent", backgroundColor: "transparent" }}
    />
  );
}
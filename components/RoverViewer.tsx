"use client";

import { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { ContactShadows, OrbitControls, Stars } from "@react-three/drei";
import RoverModel from "./RoverModel";
import type { PartMesh, PlanetId, RoverModelKind } from "@/data/types";

type Props = {
  kind: RoverModelKind;
  planet: PlanetId;
  accent: string;
  active: PartMesh | null;
  clickable: PartMesh[];
  onPick: (p: PartMesh) => void;
};

/** Widen the view on tall/narrow screens (phones, iPad portrait) so the rover fits. */
function AdaptiveFov() {
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / s.size.height);
  useEffect(() => {
    const camera = get().camera as PerspectiveCamera;
    camera.fov = aspect < 1.2 ? Math.min(70, 38 * (1.2 / aspect)) : 38;
    camera.updateProjectionMatrix();
  }, [aspect, get]);
  return null;
}

export default function RoverViewer({ kind, planet, accent, active, clickable, onPick }: Props) {
  const ground = planet === "mars" ? "#8a3b22" : "#6d6d72";
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [3.2, 2.1, 3.2], fov: 38 }} onPointerMissed={() => {}}>
      <AdaptiveFov />
      <color attach="background" args={["#070914"]} />
      <fog attach="fog" args={["#070914", 8, 18]} />
      <Stars radius={60} depth={30} count={2500} factor={3} fade speed={0.6} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 3]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -4]} intensity={0.6} color={planet === "mars" ? "#ffb08a" : "#a9c2ff"} />

      <group position={[0, -0.6, 0]}>
        <RoverModel kind={kind} active={active} clickable={clickable} accent={accent} onPick={onPick} />
        {/* ground disc */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
          <circleGeometry args={[3.2, 64]} />
          <meshStandardMaterial color={ground} roughness={1} />
        </mesh>
        <ContactShadows position={[0, 0.002, 0]} opacity={0.6} scale={5} blur={2.2} far={2} />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={2.6}
        maxDistance={8}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate={!active}
        autoRotateSpeed={0.8}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}

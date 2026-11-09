"use client";

// Rover 3D models generated in code (no downloads needed).
// Each important part is wrapped in <P part="..."> so it can glow and be clicked.
// Tip: to use an official NASA .glb model instead, see README → "Using NASA 3D models".

import { createContext, useContext, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { PartMesh, RoverModelKind } from "@/data/types";

type HL = { active: PartMesh | null; clickable: PartMesh[]; accent: string; onPick: (p: PartMesh) => void };
const HLContext = createContext<HL>({ active: null, clickable: [], accent: "#5ee7ff", onPick: () => {} });
const PartContext = createContext<PartMesh | null>(null);

/** Standard material that glows when its part is selected. */
function M({ c, metal = 0.5, rough = 0.45, side }: { c: string; metal?: number; rough?: number; side?: 2 }) {
  const { active, accent } = useContext(HLContext);
  const part = useContext(PartContext);
  const on = part !== null && part === active;
  return (
    <meshStandardMaterial
      color={c}
      metalness={metal}
      roughness={rough}
      emissive={on ? accent : "#000000"}
      emissiveIntensity={on ? 0.85 : 0}
      side={side}
    />
  );
}

/** A clickable / highlightable group. */
function P({ part, children }: { part: PartMesh; children: React.ReactNode }) {
  const { clickable, onPick } = useContext(HLContext);
  const [hover, setHover] = useState(false);
  const can = clickable.includes(part);
  return (
    <PartContext.Provider value={part}>
      <group
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (!can) return;
          e.stopPropagation();
          onPick(part);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (!can) return;
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          if (!can) return;
          setHover(false);
          document.body.style.cursor = "";
        }}
        scale={hover ? 1.03 : 1}
      >
        {children}
      </group>
    </PartContext.Provider>
  );
}

// ───────────── Building blocks ─────────────
type V3 = [number, number, number];

function Box({ p, s, c, r, metal, rough }: { p: V3; s: V3; c: string; r?: V3; metal?: number; rough?: number }) {
  return (
    <mesh position={p} rotation={r} castShadow receiveShadow>
      <boxGeometry args={s} />
      <M c={c} metal={metal} rough={rough} />
    </mesh>
  );
}

function Cyl({ p, rt, rb, h, c, r, seg = 24 }: { p: V3; rt: number; rb: number; h: number; c: string; r?: V3; seg?: number }) {
  return (
    <mesh position={p} rotation={r} castShadow>
      <cylinderGeometry args={[rt, rb, h, seg]} />
      <M c={c} />
    </mesh>
  );
}

function Wheel({ p, r = 0.17, w = 0.13, c = "#8d939b", mesh = false }: { p: V3; r?: number; w?: number; c?: string; mesh?: boolean }) {
  return (
    <group position={p} rotation={[Math.PI / 2, 0, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[r, r, w, 28]} />
        <M c={c} metal={0.7} rough={0.35} />
      </mesh>
      {mesh ? (
        <mesh>
          <cylinderGeometry args={[r * 1.01, r * 1.01, w * 1.01, 20, 3, true]} />
          <meshStandardMaterial color="#d8dde3" wireframe />
        </mesh>
      ) : (
        <mesh>
          <torusGeometry args={[r * 0.98, 0.012, 6, 28]} />
          <M c="#3d4249" />
        </mesh>
      )}
      <mesh position={[0, w / 2 + 0.002, 0]}>
        <cylinderGeometry args={[r * 0.35, r * 0.35, 0.01, 16]} />
        <M c="#2b2f35" />
      </mesh>
    </group>
  );
}

function SolarPanel({ p, s, r }: { p: V3; s: [number, number]; r?: V3 }) {
  return (
    <group position={p} rotation={r}>
      <mesh castShadow>
        <boxGeometry args={[s[0], 0.025, s[1]]} />
        <M c="#1b2f6b" metal={0.85} rough={0.2} />
      </mesh>
      {/* cell grid lines */}
      <mesh position={[0, 0.014, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[s[0] * 0.98, s[1] * 0.98, Math.max(2, Math.round(s[0] * 10)), Math.max(2, Math.round(s[1] * 10))]} />
        <meshBasicMaterial color="#7f9cff" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/** Six wheels on a rocker-bogie suspension (Mars rovers & Yutu-2). */
function RockerBogie({ len, side, y, r, c }: { len: number; side: number; y: number; r: number; c?: string }) {
  const xs = [-len, 0, len];
  return (
    <>
      <P part="wheels">
        {xs.flatMap((x) => [
          <Wheel key={`${x}a`} p={[x, r, side]} r={r} w={r * 0.8} c={c} />,
          <Wheel key={`${x}b`} p={[x, r, -side]} r={r} w={r * 0.8} c={c} />,
        ])}
      </P>
      {[side, -side].map((z) => (
        <group key={z}>
          {/* rocker (front-middle) and bogie (back) arms */}
          <Box p={[len * 0.5, (y + r) / 2 + 0.03, z * 0.92]} s={[len * 1.15, 0.035, 0.035]} r={[0, 0, 0.35]} c="#c9ccd1" />
          <Box p={[-len * 0.5, (y + r) / 2 + 0.03, z * 0.92]} s={[len * 1.15, 0.035, 0.035]} r={[0, 0, -0.35]} c="#c9ccd1" />
        </group>
      ))}
    </>
  );
}

function Dish({ p, r = 0.16, c = "#e6e8ec", rot }: { p: V3; r?: number; c?: string; rot?: V3 }) {
  return (
    <mesh position={p} rotation={rot}>
      <sphereGeometry args={[r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 3.2]} />
      <M c={c} side={2} metal={0.3} rough={0.5} />
    </mesh>
  );
}

// ───────────── Rover models ─────────────

function Lunokhod() {
  return (
    <group>
      {/* 8 wheels */}
      <P part="wheels">
        {[-0.75, -0.25, 0.25, 0.75].flatMap((x) => [
          <Wheel key={`${x}l`} p={[x, 0.2, 0.62]} r={0.2} w={0.12} c="#6f757d" />,
          <Wheel key={`${x}r`} p={[x, 0.2, -0.62]} r={0.2} w={0.12} c="#6f757d" />,
        ])}
      </P>
      <Box p={[0, 0.3, 0]} s={[1.8, 0.06, 1.1]} c="#9aa1a8" />
      {/* tub-shaped body */}
      <mesh position={[0, 0.62, 0]} scale={[1.05, 0.55, 0.7]} castShadow>
        <cylinderGeometry args={[0.85, 0.7, 0.9, 32]} />
        <M c="#b9b4a5" metal={0.6} rough={0.35} />
      </mesh>
      {/* opened solar lid */}
      <P part="lid">
        <group position={[-0.85, 0.88, 0]} rotation={[0, 0, -1.05]}>
          <mesh position={[0.85, 0, 0]} scale={[1, 0.2, 0.75]} castShadow>
            <sphereGeometry args={[0.88, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <M c="#c6c0b0" side={2} metal={0.6} rough={0.4} />
          </mesh>
          <mesh position={[0.85, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
            <circleGeometry args={[0.86, 32]} />
            <M c="#1b2f6b" side={2} metal={0.85} rough={0.2} />
          </mesh>
        </group>
      </P>
      {/* laser reflector at the front */}
      <P part="reflector">
        <Box p={[0.98, 0.72, 0.25]} s={[0.12, 0.16, 0.3]} c="#d8b25a" metal={0.9} rough={0.15} />
      </P>
      {/* cameras */}
      <Box p={[0.92, 0.62, -0.2]} s={[0.12, 0.1, 0.1]} c="#2a2d33" />
      <Box p={[0.92, 0.62, -0.38]} s={[0.12, 0.1, 0.1]} c="#2a2d33" />
      {/* antennas */}
      <Cyl p={[0.4, 1.25, -0.45]} rt={0.01} rb={0.015} h={0.9} c="#d9d9d9" r={[0.3, 0, 0]} />
      <Cyl p={[0.6, 1.05, 0.5]} rt={0.05} rb={0.012} h={0.35} c="#d9d9d9" />
    </group>
  );
}

function LRV() {
  return (
    <group>
      <P part="wheels">
        {[-0.85, 0.85].flatMap((x) => [
          <Wheel key={`${x}l`} p={[x, 0.24, 0.62]} r={0.24} w={0.16} c="#b8b8b0" mesh />,
          <Wheel key={`${x}r`} p={[x, 0.24, -0.62]} r={0.24} w={0.16} c="#b8b8b0" mesh />,
        ])}
      </P>
      {/* fenders */}
      {[-0.85, 0.85].flatMap((x) => [0.62, -0.62].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.3, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.29, 0.29, 0.2, 24, 1, true, Math.PI * 0.15, Math.PI * 0.7]} />
          <M c="#d9c79a" side={2} />
        </mesh>
      )))}
      {/* chassis */}
      <Box p={[0, 0.42, 0]} s={[2.0, 0.06, 1.0]} c="#c8c9c4" />
      <Box p={[0, 0.39, 0]} s={[2.1, 0.04, 0.12]} c="#8f918d" />
      {/* seats */}
      {[0.22, -0.22].map((z) => (
        <group key={z}>
          <Box p={[-0.15, 0.52, z]} s={[0.36, 0.06, 0.34]} c="#5f7da3" rough={0.8} metal={0.1} />
          <Box p={[-0.33, 0.7, z]} s={[0.05, 0.36, 0.34]} c="#5f7da3" rough={0.8} metal={0.1} />
        </group>
      ))}
      {/* control console */}
      <Box p={[0.35, 0.7, 0]} s={[0.12, 0.3, 0.2]} c="#3a3d42" />
      {/* batteries at the front */}
      <P part="battery">
        <Box p={[0.75, 0.55, 0.22]} s={[0.32, 0.2, 0.3]} c="#e1e3e6" metal={0.4} />
        <Box p={[0.75, 0.55, -0.22]} s={[0.32, 0.2, 0.3]} c="#e1e3e6" metal={0.4} />
      </P>
      {/* high-gain umbrella antenna + TV camera */}
      <P part="antenna">
        <Cyl p={[0.95, 0.95, 0.3]} rt={0.015} rb={0.015} h={0.8} c="#d0d0d0" />
        <Dish p={[0.95, 1.38, 0.3]} r={0.36} rot={[0, 0, 0.5]} c="#f2f2f2" />
      </P>
      <Box p={[0.95, 0.85, -0.3]} s={[0.14, 0.1, 0.1]} c="#e8c547" />
      <Cyl p={[0.95, 0.68, -0.3]} rt={0.012} rb={0.012} h={0.3} c="#d0d0d0" />
    </group>
  );
}

function Yutu() {
  return (
    <group>
      <RockerBogie len={0.55} side={0.55} y={0.45} r={0.15} c="#7c8288" />
      {/* gold foil body */}
      <Box p={[0, 0.55, 0]} s={[1.0, 0.4, 0.75]} c="#d6a84a" metal={0.95} rough={0.25} />
      <P part="solar">
        <SolarPanel p={[0, 0.78, 0.68]} s={[0.95, 0.6]} r={[-0.35, 0, 0]} />
        <SolarPanel p={[0, 0.78, -0.68]} s={[0.95, 0.6]} r={[0.35, 0, 0]} />
      </P>
      {/* mast with cameras */}
      <Cyl p={[0.38, 1.05, 0]} rt={0.03} rb={0.03} h={0.6} c="#e0e0e0" />
      <Box p={[0.4, 1.38, 0]} s={[0.14, 0.12, 0.32]} c="#e9e9ea" />
      <Box p={[0.48, 1.38, 0.1]} s={[0.04, 0.06, 0.06]} c="#1d1f24" />
      <Box p={[0.48, 1.38, -0.1]} s={[0.04, 0.06, 0.06]} c="#1d1f24" />
      {/* relay antenna */}
      <P part="antenna">
        <Cyl p={[-0.25, 0.95, 0.18]} rt={0.02} rb={0.02} h={0.4} c="#e0e0e0" />
        <Dish p={[-0.25, 1.16, 0.18]} r={0.2} rot={[0.4, 0, 0.3]} />
      </P>
      {/* ground-penetrating radar under the body */}
      <P part="radar">
        <Box p={[-0.42, 0.3, 0]} s={[0.22, 0.08, 0.5]} c="#3b4a5c" metal={0.4} />
        <Cyl p={[-0.42, 0.22, 0.15]} rt={0.012} rb={0.012} h={0.12} c="#c0c4c9" />
        <Cyl p={[-0.42, 0.22, -0.15]} rt={0.012} rb={0.012} h={0.12} c="#c0c4c9" />
      </P>
    </group>
  );
}

function Sojourner() {
  return (
    <group scale={1.35}>
      <RockerBogie len={0.42} side={0.4} y={0.36} r={0.11} c="#a8adb2" />
      <Box p={[0, 0.38, 0]} s={[0.75, 0.16, 0.5]} c="#c9ccd1" />
      <P part="solar">
        <SolarPanel p={[0, 0.48, 0]} s={[0.9, 0.58]} />
      </P>
      <P part="apxs">
        <Cyl p={[-0.5, 0.33, 0]} rt={0.05} rb={0.05} h={0.12} c="#c7a76a" r={[0, 0, Math.PI / 2]} />
        <Box p={[-0.42, 0.36, 0]} s={[0.1, 0.03, 0.03]} c="#9a9da2" />
      </P>
      <Cyl p={[0.2, 0.68, 0.18]} rt={0.008} rb={0.008} h={0.4} c="#e0e0e0" />
      <Box p={[0.4, 0.38, 0.1]} s={[0.05, 0.05, 0.05]} c="#1d1f24" />
      <Box p={[0.4, 0.38, -0.1]} s={[0.05, 0.05, 0.05]} c="#1d1f24" />
    </group>
  );
}

function MER() {
  return (
    <group>
      <RockerBogie len={0.6} side={0.58} y={0.48} r={0.16} c="#b6b9bd" />
      <Box p={[0, 0.58, 0]} s={[1.0, 0.32, 0.7]} c="#e3e4e6" />
      {/* big solar deck + side wings */}
      <P part="solar">
        <SolarPanel p={[-0.05, 0.76, 0]} s={[1.3, 0.85]} />
        <SolarPanel p={[-0.15, 0.76, 0.78]} s={[1.0, 0.7]} />
        <SolarPanel p={[-0.15, 0.76, -0.78]} s={[1.0, 0.7]} />
        <SolarPanel p={[-0.95, 0.76, 0]} s={[0.4, 0.6]} />
      </P>
      {/* Pancam mast */}
      <P part="mast">
        <Cyl p={[0.45, 1.15, 0.18]} rt={0.035} rb={0.04} h={0.75} c="#d9dadc" />
        <Box p={[0.47, 1.55, 0.18]} s={[0.14, 0.12, 0.38]} c="#eeeeef" />
        <Box p={[0.55, 1.56, 0.32]} s={[0.04, 0.06, 0.06]} c="#16181c" />
        <Box p={[0.55, 1.56, 0.04]} s={[0.04, 0.06, 0.06]} c="#16181c" />
      </P>
      {/* robotic arm with rock grinder */}
      <P part="arm">
        <Box p={[0.62, 0.5, 0]} s={[0.05, 0.05, 0.55]} c="#c5c7ca" />
        <Box p={[0.72, 0.42, -0.25]} s={[0.22, 0.05, 0.05]} c="#c5c7ca" r={[0, 0, -0.5]} />
        <Cyl p={[0.82, 0.34, -0.25]} rt={0.06} rb={0.06} h={0.1} c="#8e8f93" />
      </P>
      {/* antennas */}
      <Dish p={[-0.3, 0.86, -0.25]} r={0.14} rot={[0, 0, 0.5]} />
      <Cyl p={[-0.3, 1.0, 0.25]} rt={0.008} rb={0.008} h={0.45} c="#e0e0e0" />
    </group>
  );
}

function MSL() {
  return (
    <group scale={1.05}>
      <RockerBogie len={0.72} side={0.68} y={0.6} r={0.22} c="#a3a8ae" />
      <Box p={[0, 0.72, 0]} s={[1.3, 0.38, 0.95]} c="#e7e3d8" />
      <Box p={[0, 0.93, 0]} s={[1.32, 0.03, 0.97]} c="#bfc3c8" />
      {/* nuclear generator at the back */}
      <P part="rtg">
        <group position={[-0.85, 0.85, 0]} rotation={[0, 0, -0.55]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.55, 20]} />
            <M c="#3e4247" metal={0.8} rough={0.3} />
          </mesh>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]} position={[0, 0, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.015]} />
              <M c="#2e3135" metal={0.8} rough={0.4} />
            </mesh>
          ))}
        </group>
      </P>
      {/* mast with ChemCam */}
      <P part="mast">
        <Cyl p={[0.52, 1.35, 0.3]} rt={0.045} rb={0.05} h={0.85} c="#e2e2e2" />
        <Box p={[0.55, 1.82, 0.3]} s={[0.2, 0.18, 0.42]} c="#f0f0f0" />
        <Cyl p={[0.68, 1.85, 0.3]} rt={0.07} rb={0.07} h={0.06} c="#1a1c20" r={[0, 0, Math.PI / 2]} />
        <Box p={[0.66, 1.76, 0.48]} s={[0.04, 0.06, 0.06]} c="#16181c" />
        <Box p={[0.66, 1.76, 0.12]} s={[0.04, 0.06, 0.06]} c="#16181c" />
      </P>
      {/* robotic arm with drill turret */}
      <P part="arm">
        <Box p={[0.85, 0.75, -0.15]} s={[0.4, 0.06, 0.06]} c="#c9cbce" r={[0, 0.4, -0.3]} />
        <Box p={[1.05, 0.62, -0.32]} s={[0.06, 0.32, 0.06]} c="#c9cbce" />
        <mesh position={[1.05, 0.42, -0.32]}>
          <dodecahedronGeometry args={[0.13]} />
          <M c="#9c9fa4" metal={0.8} />
        </mesh>
        <Cyl p={[1.05, 0.26, -0.32]} rt={0.015} rb={0.025} h={0.14} c="#5b5e63" />
      </P>
      {/* high-gain antenna */}
      <Dish p={[-0.3, 1.1, -0.35]} r={0.2} rot={[0.4, 0, 0.4]} />
      <Cyl p={[-0.15, 1.1, 0.35]} rt={0.01} rb={0.01} h={0.35} c="#e0e0e0" />
    </group>
  );
}

const MODELS: Record<RoverModelKind, () => React.JSX.Element> = {
  lunokhod: Lunokhod,
  lrv: LRV,
  yutu: Yutu,
  sojourner: Sojourner,
  mer: MER,
  msl: MSL,
};

export default function RoverModel({
  kind,
  active,
  clickable,
  accent,
  onPick,
}: {
  kind: RoverModelKind;
  active: PartMesh | null;
  clickable: PartMesh[];
  accent: string;
  onPick: (p: PartMesh) => void;
}) {
  const Model = MODELS[kind];
  return (
    <HLContext.Provider value={{ active, clickable, accent, onPick }}>
      <Model />
    </HLContext.Provider>
  );
}

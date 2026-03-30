"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Grid,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";

import { BearingLayer } from "@/modules/bridge-viewer/layers/BearingLayer";
import { ElementLayer } from "@/modules/bridge-viewer/layers/ElementLayer";
import { LoadLayer } from "@/modules/bridge-viewer/layers/LoadLayer";
import { NodeLayer } from "@/modules/bridge-viewer/layers/NodeLayer";
import { PileCapLayer } from "@/modules/bridge-viewer/layers/PileCapLayer";
import { RigidLinkLayer } from "@/modules/bridge-viewer/layers/RigidLinkLayer";
import { ShellLayer } from "@/modules/bridge-viewer/layers/ShellLayer";
import { SupportLayer } from "@/modules/bridge-viewer/layers/SupportLayer";
import type { BridgeModelExportV2 } from "@/lib/bridge-viewer/types";
import { useBridgeViewerStore } from "@/lib/bridge-viewer/store";

import * as THREE from "three";

THREE.Object3D.DEFAULT_UP.set(0, 0, 1);

type SceneRootProps = {
  data: BridgeModelExportV2;
};

export function SceneRoot({ data }: SceneRootProps) {
  const setSelected = useBridgeViewerStore((state) => state.setSelected);

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true }}
      className="h-full w-full"
      onPointerMissed={() => setSelected(null)}
    >
      {/* <color attach="background" args={["#020617"]} /> */}
      <PerspectiveCamera makeDefault position={[120, 90, 120]} fov={42} />
      {/* <ambientLight intensity={0.7} /> */}
      {/* <directionalLight position={[60, 80, 40]} intensity={1.1} castShadow />
      <directionalLight position={[-60, 40, -40]} intensity={0.4} /> */}

      <group rotation={[Math.PI / 2, 0, 0]}>
        <Grid
          args={[220, 220]}
          cellSize={4}
          cellThickness={0.3}
          sectionSize={20}
          sectionThickness={0.4}
          fadeDistance={500}
          fadeStrength={1}
          infiniteGrid
          cellColor={"#fff00"}
          // material
        />
      </group>

      <Bounds fit clip observe margin={1.15}>
        <ShellLayer data={data} />
        <ElementLayer data={data} />
        <BearingLayer data={data} />
        <PileCapLayer data={data} />
        <RigidLinkLayer data={data} />
        <SupportLayer data={data} />
        <LoadLayer data={data} />
        <NodeLayer data={data} />
      </Bounds>

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
    </Canvas>
  );
}

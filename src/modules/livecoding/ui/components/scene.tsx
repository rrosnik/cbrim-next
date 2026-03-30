import React from "react";
import { Canvas } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  GizmoViewcube,
} from "@react-three/drei";

import { PersistantMapControls } from "./persistant-map-controls";
import OpenseesModel from "@/modules/opensees/ui/components/3d/opensees-model";
import { useOpensees } from "@/modules/opensees/hooks/use-opensees";


export const MyScene = () => {
  const { model, loading, error } = useOpensees({
    jsonUrl: "sample-model.json",
  });

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Canvas
      className="h-full bg-background flex-1 overflow-hidden"
      // camera={{
      //   fov: 45,
      //   near: 0.1,
      //   far: 1000,
      //   position: cameraPosition,
      //   onUpdate: (camera) => {
      //     setCameraPosition(camera);
      //   },
      // }}
    >
      <PersistantMapControls />
      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
        onUpdate={() => {}}
        // onTarget={() => {}}
        // renderPriority={}
      >
        <GizmoViewcube
          faces={["right", "left", "top", "bottom", "front", "back"]}
        />
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="white"
        />
        {/* alternative: <GizmoViewcube /> */}
      </GizmoHelper>
      <Grid
        args={[10, 10]}
        cellSize={1}
        sectionSize={10}
        cellThickness={0.3}
        sectionThickness={0.5}
        cellColor="#6f6f6f"
        sectionColor="#9d4b4b"
        infiniteGrid
        fadeDistance={300}
        followCamera
        rotateY={Math.PI / 2}
      />

      {model && <OpenseesModel model={model} />}
    </Canvas>
  );
};

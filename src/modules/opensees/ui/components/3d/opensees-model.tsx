import { OpenseesModel as _OpenseesModel } from "@/lib/opensees/models/Model";
import { Points } from "@react-three/drei";
import React, { useMemo } from "react";
import * as THREE from "three";

interface Props {
  model: _OpenseesModel;
}

const OpenseesModel: React.FC<Props> = ({ model }) => {
  const lines = useMemo(() => model.getLines(), [model]);
  const points = useMemo(() => model.getMesh(), [model]);

  return (
    <group rotation={[-Math.PI / 2,0,0]}>
      {lines.map((line, index) => (
        <lineSegments
          key={index}
          geometry={line.geometry}
          material={new THREE.LineBasicMaterial({ color: "#000" })}
        />
      ))}
      {points.map((point, index) => (
      
        <mesh key={index} geometry={point.geometry} position={point.position} />
      ))}
    </group>
  );
};

export default OpenseesModel;

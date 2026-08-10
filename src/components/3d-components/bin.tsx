import type { ThreeEvent } from "@react-three/fiber/native";
import { Vector3 } from "three";
import { useRef } from "react";
import * as THREE from 'three'

type BinProps = {
  id: string;

  position?: [number, number, number];

  width?: number;
  height?: number;
  depth?: number;

  selected?: boolean;

onSelect?: (
  id: string,
  worldPosition: [number, number, number]
) => void;};

export function Bin({
  id,
  position,
  width = 0.9,
  height = 0.7,
  depth = 0.9,
  selected = false,
  onSelect,
}: BinProps) {

  const meshRef = useRef<THREE.Mesh>(null);



  const handleSelect = (e : ThreeEvent<TouchEvent>) => {

    e.stopPropagation()

  if (!meshRef.current) {
    return;
  }

  const worldPosition = new Vector3();

  meshRef.current.getWorldPosition(
    worldPosition
  );

  onSelect?.(
    id,
    [
      worldPosition.x,
      worldPosition.y,
      worldPosition.z,
    ]
  );
};

  return (
    <mesh
    ref={meshRef}
      position={position}
      onClick={handleSelect}
    >
      <boxGeometry
        args={[width, height, depth]}
      />

      <meshStandardMaterial
        color={
          selected
            ? "#ffd43b"
            : "#3f6f91"
        }
      />
    </mesh>
  );
}
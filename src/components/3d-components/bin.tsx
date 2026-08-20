import { useThree, type ThreeEvent } from "@react-three/fiber/native";
import { Vector3 } from "three";
import { memo, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  normalBinGeometry,
  slimBinGeometry,
  smallBinGeometry,
} from "@/ressources/bin-recources";
import { useBinRegistry } from "@/context/bin-registry";
export type BinType = "small" | "slim" | "normal";

type BinProps = {
  dimmed?: boolean;
  id: string;

  type?: BinType;

  position?: [number, number, number];

  width?: number;
  height?: number;
  depth?: number;

  selected?: boolean;
  interactive?: boolean;

  onSelect?: (id: string, worldPosition: [number, number, number]) => void;
};

const SELECTED_COLOR = new THREE.Color("#ffd43b");
const NORMAL_COLOR = new THREE.Color("#f1bbf8");

export const Bin = memo(function Bin({
  id,
  position,
  width = 0.9,
  height = 0.7,
  depth = 0.9,
  selected = false,
  type,

  onSelect,
  dimmed = false,
}: BinProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const { invalidate } = useThree();
  const { registerBin, unregisterBin } = useBinRegistry();

  const pointerStart = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const moved = useRef(false);

  useEffect(() => {
    if (!meshRef.current) {
      return;
    }

    registerBin(id, meshRef.current);

    return () => {
      unregisterBin(id);
    };
  }, [id, registerBin, unregisterBin]);

  // --------------------------------
  // Keep material in sync with `selected` prop — covers
  // deselection, search-result selection, or any selection
  // path that doesn't go through this bin's own pointer handlers.
  // --------------------------------

  useEffect(() => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.color.set(selected ? SELECTED_COLOR : NORMAL_COLOR);
  }, [selected]);

  const handlePointerDown = (e: ThreeEvent<TouchEvent>) => {
    e.stopPropagation();

    pointerStart.current = {
      x: e.nativeEvent.pageX,
      y: e.nativeEvent.pageY,
    };

    moved.current = false;
  };

  const handlePointerMove = (e: ThreeEvent<TouchEvent>) => {
    if (!pointerStart.current) {
      return;
    }

    const dx = e.nativeEvent.pageX - pointerStart.current.x;
    const dy = e.nativeEvent.pageY - pointerStart.current.y;

    const distanceSquared = dx * dx + dy * dy;

    // ~8 px movement threshold
    if (distanceSquared > 64) {
      moved.current = true;
    }
  };

  const handlePointerUp = (e: ThreeEvent<TouchEvent>) => {
    e.stopPropagation();

    if (!meshRef.current) {
      return;
    }

    const worldPosition = new Vector3();
    meshRef.current.getWorldPosition(worldPosition);

    if (!pointerStart.current) {
      return;
    }

    if (!moved.current) {
      // Paint immediately — don't wait for the `selected` prop
      // to come back around through React's render cycle.
      if (materialRef.current) {
        materialRef.current.color.set(SELECTED_COLOR);
        invalidate();
      }

      onSelect?.(id, [worldPosition.x, worldPosition.y, worldPosition.z]);
    }

    pointerStart.current = null;
    moved.current = false;
  };

  const geometry =
    type === "small"
      ? smallBinGeometry
      : type === "slim"
        ? slimBinGeometry
        : normalBinGeometry;

  return (
    <mesh
      visible={!dimmed}
      ref={meshRef}
      position={position}
      onPointerDown={!dimmed ? handlePointerDown : undefined}
      onPointerMove={!dimmed ? handlePointerMove : undefined}
      onPointerUp={!dimmed ? handlePointerUp : undefined}
      geometry={geometry}
      raycast={dimmed ? () => null : THREE.Mesh.prototype.raycast}
    >
      <meshStandardMaterial
        ref={materialRef}
        color={selected ? "#ffd43b" : "#f1bbf8"}
        transparent={true}
        opacity={dimmed ? 0.08 : 1}
        depthWrite={!dimmed}
      />
    </mesh>
  );
});
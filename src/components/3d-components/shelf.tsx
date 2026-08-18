import { Bin } from "@/components/3d-components/bin";
import type { BinData } from "@/data/data";
import { BIN_DIMENSIONS } from "@/ressources/bin-recources";
import { useFrame } from "@react-three/fiber/native";
import { memo, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type ShelfProps = {
  bins: BinData[];
  position: [number, number, number];
  dimmed?: boolean;
  width: number;
  depth: number;
  binHeight: number;
  selected?: boolean;

  selectedBinId?: string;
  onBinSelect?: (id: string, worldPosition: [number, number, number]) => void;
};

export const Shelf = memo(function Shelf({
  bins,
  position,
  width,
  depth,
  binHeight,
  selected = false,
  selectedBinId,

  dimmed = false,
  
  onBinSelect,
}: ShelfProps) {


  const shelfRef = useRef<THREE.Group>(null);
  const animatedZ = useRef(0);
  const shelfThickness = 0.12;

  const totalBinWidth = bins.reduce((total, bin) => {
    return total + BIN_DIMENSIONS[bin.type].width;
  }, 0);

  if (totalBinWidth > width) {
    console.warn(
      `Shelf is too narrow for ${bins.length} bins. ` +
        `Required: ${totalBinWidth}, available: ${width}`,
    );
  }

  let currentX = -totalBinWidth / 2;


    const binPositions = useMemo(() => {
    let currentX = -totalBinWidth / 2;

    return bins.map((bin) => {
      const binWidth = BIN_DIMENSIONS[bin.type].width;

      const position: [number, number, number] = [
        currentX + binWidth / 2,
        binHeight / 2 + shelfThickness / 2,
        0.03,
      ];

      currentX += binWidth;

      return {
        bin,
        position,
      };
    });
  }, [bins, totalBinWidth, binHeight]);

  useFrame((_, delta) => {
    if (!shelfRef.current) return;

    const targetZ = selected ? 0.2 : 0;

    animatedZ.current = THREE.MathUtils.damp(
      animatedZ.current,
      targetZ,
      8,
      delta,
    );

    shelfRef.current.position.z = animatedZ.current;
  });


  return (
    <group position={position}>
      {/* Shelf board */}
      <group ref={shelfRef}>
        <mesh>
          <boxGeometry args={[width, shelfThickness, depth]} />

          <meshStandardMaterial
            color={selected ? "#00ff80" : "#777777"}
            transparent={true}
            depthWrite={!dimmed}
            opacity={dimmed ? 0.08 : 1}
          />
        </mesh>

        {/* Bins */}
       {binPositions.map(({ bin, position }) => (
  <Bin
    key={bin.id}
    id={bin.id}
    type={bin.type}
    position={position}
    selected={selectedBinId === bin.id}
    onSelect={onBinSelect}
    dimmed={dimmed}

  />
))}
      </group>
    </group>
  );
})

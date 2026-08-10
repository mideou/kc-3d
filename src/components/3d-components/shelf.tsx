import { Bin } from "@/components/3d-components/bin";
import type { BinData } from "@/data/data";

type ShelfProps = {
  bins: BinData[];
  position: [number, number, number];

  width: number;
  depth: number;
  binHeight: number;

  selectedBinId?: string;
onBinSelect?: (
  id: string,
  worldPosition: [number, number, number]
) => void;};

export function Shelf({
  bins,
  position,
  width,
  depth,
  binHeight,
  selectedBinId,
  onBinSelect,
}: ShelfProps) {
  const shelfThickness = 0.12;

  const binWidth = width / bins.length;

  return (
    <group position={position}>
      {/* Shelf board */}
      <mesh>
        <boxGeometry args={[width, shelfThickness, depth]} />

        <meshStandardMaterial color="#777777" />
      </mesh>

      {/* Bins */}
      {bins.map((bin, index) => {
        const x = -width / 2 + binWidth / 2 + index * binWidth;

        return (
          <Bin
            key={bin.id}
            id={bin.id}
            position={[x, binHeight / 2 + shelfThickness / 2, 0.03]}
            width={binWidth - 0.05}
            height={binHeight}
            depth={depth - 0.1}
            selected={selectedBinId === bin.id}
            onSelect={onBinSelect}
          />
        );
      })}
    </group>
  );
}

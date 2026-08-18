import { memo, useMemo } from "react";
import type { BinData } from "../../data/data";
import { RackMarker } from "./rack-marker";
import { Shelf } from "./shelf";
type RackProps = {
  id: string;
  dimmed?: boolean;

  width: number;
  height: number;
  depth: number;

  shelfCount: number;
  bins: BinData[];
  interactive?: boolean;

  selectedBinId?: string;
  selected?: boolean;
  onBinSelect?: (id: string, worldPosition: [number, number, number]) => void;
};

export const Rack = memo(function Rack({
  id,
  width,
  height,
  depth,
  shelfCount,
  bins,
  selectedBinId,
  onBinSelect,
  dimmed = false,
  selected,
}: RackProps) {

  const postSize = 0.15;
  const beamSize = 0.12;

  const shelfSpacing = height / shelfCount;

  const binsPerShelf = Math.ceil(bins.length / shelfCount);

  const shelfWidth = width - postSize * 2;

  const binHeight = shelfSpacing - 0.25;

  const shelfDepth = depth - 0.05;

  const shelfData = useMemo(() => {
  return Array.from({ length: shelfCount }, (_, shelfIndex) => {
    const start = shelfIndex * binsPerShelf;

    return {
      bins: bins.slice(start, start + binsPerShelf),
      position: [0, shelfIndex * shelfSpacing, 0] as [
        number,
        number,
        number
      ],
    };
  });
}, [bins, shelfCount, binsPerShelf, shelfSpacing]);

console.log("RACK RENDER:", id);

  return (
    <group>
      {/* ===========label============== */}

      {selected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.15, height + 0.15, depth + 0.15]} />

          <meshBasicMaterial
            color="#ff9800"
            transparent
            opacity={0.15}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* ================================= */}
      {/* FRONT POSTS */}
      {/* ================================= */}

      <mesh position={[-width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial
          color={selected ? "#a97820" : "#777777"}
          transparent={false}
          //depthWrite={!dimmed}
          //opacity={dimmed ? 0.08 : 1}
        />
      </mesh>

      <mesh position={[width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial
          color={selected ? "#a97820" : "#777777"}
          //transparent={false}
          //depthWrite={!dimmed}
          //opacity={dimmed ? 0.08 : 1}
        />
      </mesh>

      {/* ================================= */}
      {/* BACK POSTS */}
      {/* ================================= */}

      <mesh position={[-width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial
          color={selected ? "#a97820" : "#777777"}
          //transparent={false}
          //depthWrite={!dimmed}
          //opacity={dimmed ? 0.08 : 1}
        />
      </mesh>

      <mesh position={[width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial
          color={selected ? "#a97820" : "#777777"}
          //transparent={false}
          //depthWrite={!dimmed}
          //opacity={dimmed ? 0.08 : 1}
        />
      </mesh>

      {/*----- Marker ----*/}

      {selected && <RackMarker position={[0, 0, 0]} height={height} />}

      {/* ================================= */}
      {/* BACK HORIZONTAL BEAMS */}
      {/* ================================= */}

      {Array.from({
        length: shelfCount + 1,
      }).map((_, index) => {
        const y = index * shelfSpacing;

        return (
          <mesh key={`back-beam-${index}`} position={[0, y, -depth / 2]}>
            <boxGeometry args={[width, beamSize, beamSize]} />

            <meshStandardMaterial
              color={selected ? "#a97820" : "#777777"}
              transparent={false}
              //depthWrite={!dimmed}
              //opacity={dimmed ? 0.08 : 1}
            />
          </mesh>
        );
      })}

      {/* ================================= */}
      {/* SHELVES */}
      {/* ================================= */}

      {shelfData.map((shelf, shelfIndex) => {
  const isSelected = shelf.bins.some(
    (bin) => bin.id === selectedBinId
  );

  return (
    <Shelf
      key={`shelf-${shelfIndex}`}
      bins={shelf.bins}
      position={shelf.position}
      width={shelfWidth}
      depth={shelfDepth}
      binHeight={binHeight}
      selectedBinId={isSelected ? selectedBinId : undefined}
      onBinSelect={onBinSelect}
      dimmed={dimmed}
      selected={isSelected}

    />
  );
})}
    </group>
  );
})

import type { BinData } from "../../data/data";
import { RackMarker } from "./rack-marker";
import { Shelf } from "./shelf";
type RackProps = {
  id: string;

  width: number;
  height: number;
  depth: number;

  shelfCount: number;
  bins: BinData[];

  selectedBinId?: string;
  selected?: boolean,
onBinSelect?: (
  id: string,
  worldPosition: [number, number, number]
) => void};

export function Rack({
  id,
  width,
  height,
  depth,
  shelfCount,
  bins,
  selectedBinId,
  onBinSelect,
  selected
}: RackProps) {
  const postSize = 0.15;
  const beamSize = 0.12;

  const shelfSpacing = height / shelfCount;


  const binsPerShelf = Math.ceil(bins.length / shelfCount);

  const shelfWidth = width - postSize * 2;

  const binHeight = shelfSpacing - 0.25;

  const shelfDepth = depth - 0.05;

  return (
    <group>
      {/* ===========label============== */}

     
       

      {/* ================================= */}
      {/* FRONT POSTS */}
      {/* ================================= */}

      <mesh position={[-width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial color={selected
  ? "#ff8800"
  : "#4b4b4b"} />
      </mesh>

      <mesh position={[width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial color={selected
  ? "#ff8800"
  : "#4b4b4b"} />
      </mesh>

      {/* ================================= */}
      {/* BACK POSTS */}
      {/* ================================= */}

      <mesh position={[-width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial color={selected
  ? "#ff8800"
  : "#4b4b4b"} />
      </mesh>

      <mesh position={[width / 2, height / 2, -depth / 2]}>
        <boxGeometry args={[postSize, height, postSize]} />

        <meshStandardMaterial color={selected
  ? "#ff8800"
  : "#4b4b4b"} />
      </mesh>

      {/*----- Marker ----*/}

      {
        selected && (<RackMarker

        position={[0, 0, 0]}

        height={height}
        
        />)
      }

  

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

            <meshStandardMaterial color={selected
  ? "#ff8800"
  : "#4b4b4b"} />
          </mesh>
        );
      })}

      {/* ================================= */}
      {/* SHELVES */}
      {/* ================================= */}

      {Array.from({
        length: shelfCount,
      }).map((_, shelfIndex) => {
        const start = shelfIndex * binsPerShelf;

        const shelfBins = bins.slice(start, start + binsPerShelf);

        const y = shelfIndex * shelfSpacing;

        return (
          <Shelf
            key={`shelf-${shelfIndex}`}
            bins={shelfBins}
            position={[0, y, 0]}
            width={shelfWidth}
            depth={shelfDepth}
            binHeight={binHeight}
            selectedBinId={selectedBinId}
            onBinSelect={onBinSelect}
          />
        );
      })}
    </group>
  );
}

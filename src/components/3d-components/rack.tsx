import { memo, useLayoutEffect, useMemo, useRef } from "react";
import type { BinData } from "../../data/data";
import { RackMarker } from "./rack-marker";
import { Shelf } from "./shelf";
import * as THREE from 'three'
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

const dummy = new THREE.Object3D();

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

  const frameColor = selected ? "#a97820" : "#777777";

  // --------------------------------
  // Shelf/bin bucketing (unchanged)
  // --------------------------------

  const shelfData = useMemo(() => {
    return Array.from({ length: shelfCount }, (_, shelfIndex) => {
      const start = shelfIndex * binsPerShelf;

      return {
        bins: bins.slice(start, start + binsPerShelf),
        position: [0, shelfIndex * shelfSpacing, 0] as [number, number, number],
      };
    });
  }, [bins, shelfCount, binsPerShelf, shelfSpacing]);

  // --------------------------------
  // Post geometry + positions (4 posts, instanced)
  // --------------------------------

  const postGeometry = useMemo(
    () => new THREE.BoxGeometry(postSize, height, postSize),
    [postSize, height]
  );

  const postPositions = useMemo(
    () => [
      [-width / 2, height / 2, depth / 2],
      [width / 2, height / 2, depth / 2],
      [-width / 2, height / 2, -depth / 2],
      [width / 2, height / 2, -depth / 2],
    ] as [number, number, number][],
    [width, height, depth]
  );

  // --------------------------------
  // Beam geometry + positions (shelfCount + 1, instanced)
  // --------------------------------

  const beamGeometry = useMemo(
    () => new THREE.BoxGeometry(width, beamSize, beamSize),
    [width, beamSize]
  );

  const beamPositions = useMemo(
    () =>
      Array.from({ length: shelfCount + 1 }, (_, i) => [
        0,
        i * shelfSpacing,
        -depth / 2,
      ] as [number, number, number]),
    [shelfCount, shelfSpacing, depth]
  );

  // --------------------------------
  // Instance matrix wiring
  // --------------------------------

  const postMeshRef = useRef<THREE.InstancedMesh>(null);
  const beamMeshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    const mesh = postMeshRef.current;
    if (!mesh) return;

    postPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [postPositions]);

  useLayoutEffect(() => {
    const mesh = beamMeshRef.current;
    if (!mesh) return;

    beamPositions.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [beamPositions]);

  return (
    <group>
      {/* ===========label============== */}

      

      {/* ================================= */}
      {/* POSTS (instanced: 4 in one draw call) */}
      {/* ================================= */}

      <instancedMesh
        ref={postMeshRef}
        args={[postGeometry, undefined, 4]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={frameColor} />
      </instancedMesh>

      {/*----- Marker ----*/}

      {selected && <RackMarker position={[0, 0, 0]} height={height} />}

      {/* ================================= */}
      {/* BACK HORIZONTAL BEAMS (instanced) */}
      {/* ================================= */}

      <instancedMesh
        ref={beamMeshRef}
        args={[beamGeometry, undefined, shelfCount + 1]}
        frustumCulled={false}
      >
        <meshStandardMaterial color={frameColor} />
      </instancedMesh>

      {/* ================================= */}
      {/* SHELVES */}
      {/* ================================= */}

      {shelfData.map((shelf, shelfIndex) => {
        const isSelected = shelf.bins.some((bin) => bin.id === selectedBinId);

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
});
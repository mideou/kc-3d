import * as THREE from "three";
import { WAREHOUSE } from "@/data/data";

export function WarehouseFloor() {
  return (
    <>
      {/* Main warehouse floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.1, 0]}
      >
        <planeGeometry args={[WAREHOUSE.width, WAREHOUSE.depth]} />

        <meshStandardMaterial
          color="#777777"
          side={THREE.DoubleSide}
        />
      </mesh>

    </>
  );
}
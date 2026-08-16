import { useMemo, useState } from "react";
import { WarehouseFloor } from "./3d-components/floor";
import { Rack } from "./3d-components/rack";
import { Warehouse } from "./3d-components/warehouse";
import { findBinById } from "@/utils/warehouseUtils";
import { BinInfoPanel } from "./bin-info-panel";
import { BinData } from "@/data/data";

type SceneProps = {
  selectedBinId?: string | null;
  selectedRackId?: string | null;

  onBinSelect: (
    id: string,
    worldPosition: [number, number, number]
  ) => void;
};
export default function WarehouseScene({
  selectedBinId,
  selectedRackId,
  onBinSelect,
  
}: SceneProps) {
  return (
    <>
      <ambientLight intensity={1.2} />

      <directionalLight position={[5, 10, 5]} intensity={2} />
      <WarehouseFloor />

      <Warehouse
        selectedBinId={selectedBinId ?? undefined}
        onBinSelect={onBinSelect}
        selectedRackId = {selectedRackId}
      />
    </>
  );
}

import { racks } from "@/data/data";
import { Rack } from "./rack";

type WarehouseProps = {
  selectedBinId?: string;
  selectedRackId?: string | null;

  onBinSelect: (id: string, worldPosition: [number, number, number]) => void;
};

export function Warehouse({
  selectedBinId,
  onBinSelect,
  selectedRackId,
}: WarehouseProps) {
  const hasSelection = selectedRackId != null;

  return (
    <group>
      {racks.map((rack) => {
        const isSelected = selectedRackId === rack.id;

        const rackSelectedBinId =
  isSelected ? selectedBinId : undefined;

        const isDimmed = hasSelection && !isSelected;
        return (
          <group
            key={rack.id}
            position={rack.position}
            rotation={rack.rotation}
          >
            <Rack
              id={rack.id}
              width={rack.width}
              height={rack.height}
              depth={rack.depth}
              shelfCount={rack.shelfCount}
              bins={rack.bins}
              selectedBinId={rackSelectedBinId}
              onBinSelect={onBinSelect}
              selected={isSelected}
              dimmed={isDimmed}
            />
          </group>
        );
      })}
    </group>
  );
}

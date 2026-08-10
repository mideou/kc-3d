import { aislePositions, racks } from "@/data/data";
import { Rack } from "./rack";
import { Aisle } from "./aisle";
import { RackMarker } from "./rack-marker";

type WarehouseProps = {
  selectedBinId?: string;

onBinSelect: (
    id: string,
    worldPosition: [number, number, number]
  ) => void};

export function Warehouse({ selectedBinId, onBinSelect }: WarehouseProps) {


  

  return (
<group>


      {racks.map((rack) => {

        const isSelected = rack.bins.some(
    (bin) => bin.id === selectedBinId
  );
        
       return <group
          key={rack.id}
          position={rack.position}
          rotation={rack.rotation}

        >
          <Rack

          id={rack.id}
            width={rack.width}
            height={rack.height}
            depth={rack.depth}

            shelfCount={
              rack.shelfCount
            }
            bins={rack.bins}
            selectedBinId={
              selectedBinId
            }
            onBinSelect={
              onBinSelect
            }

            selected = {isSelected}
          />

          
   
        </group>
      })}
    </group>
  );
}

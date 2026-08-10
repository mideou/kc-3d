

import { Canvas } from "@react-three/fiber/native";
import { CameraControls, Grid, OrbitControls } from "@react-three/drei/native";
import { OrbitTouchSurface } from "../utils/MultiTouchOrbitBridge";
import WarehouseScene from "@/components/warehouse-scene";
import { Alert, View } from "react-native";
import { useMemo, useRef, useState } from "react";
import { findBinById } from "@/utils/warehouseUtils";
import { BinInfoPanel } from "@/components/bin-info-panel";
import { SelectionMarker } from "@/components/3d-components/selectionMarker";
import { CameraController } from "@/controls/camera-controls";

export default function Index() {

  const controlsRef = useRef<any>(null);

  const [
    selectedBinId,
    setSelectedBinId,
  ] = useState<string | null>(null);

  const [selectedBinPosition, setSelectedBinPosition] =
  useState<[number, number, number] | null>(null);

  const [focusTarget, setFocusTarget] =
  useState<[number, number, number] | null>(null);

   const selectedBin = useMemo(
    () =>
      selectedBinId
        ? findBinById(selectedBinId)
        : null,
    [selectedBinId]
  );

  const handleBinSelect = (
  binId: string,
  worldPosition: [number, number, number]
) => {
  setSelectedBinId(binId);
  setSelectedBinPosition(worldPosition);
    setFocusTarget(worldPosition);



  console.log(
    "Selected bin:",
    binId
  );

  console.log(
    "World position:",
    worldPosition
  );
};

 

  return (
    <View style={{flex:1}}>

    
    <OrbitTouchSurface>
      {(domElement) => (
        <Canvas style={{ height: "100%", width: "100%" }} frameloop="demand">

          <CameraController distance={6} controlsRef={controlsRef} focusTarget={focusTarget}  />

        

          <WarehouseScene selectedBinId={selectedBinId} onBinSelect={handleBinSelect}/>

          {selectedBinPosition && (
            <SelectionMarker position={selectedBinPosition}/>
          )}
          

          <axesHelper />
          <Grid infiniteGrid fadeDistance={50}/>

          <OrbitControls ref={controlsRef}  domElement={domElement} maxPolarAngle={Math.PI/2 - 0.1} minPolarAngle={Math.PI/3} />
        </Canvas>

        
      )}
      
    </OrbitTouchSurface>

    <BinInfoPanel
        bin={selectedBin ?? null}
      />

    </View>
  );
}

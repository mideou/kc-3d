import { Canvas } from "@react-three/fiber/native";
import {  Grid, OrbitControls } from "@react-three/drei/native";
import { OrbitTouchSurface } from "../utils/MultiTouchOrbitBridge";
import WarehouseScene from "@/components/warehouse-scene";
import {  View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { findBinById } from "@/utils/warehouseUtils";
import { BinInfoPanel } from "@/components/bin-info-panel";
import { CameraController } from "@/controls/camera-controls";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WarehouseSearch } from "@/components/search-component";
import { racks } from "@/data/data";
import { useBinRegistry } from "@/context/bin-registry";

type Selection = {
  binId: string;
  rackId: string;
  binPosition: [number, number, number];
  focusTarget: [number, number, number];
  focusRotation: [number, number, number];
};

const binToRackMap = new Map(
  racks.flatMap((rack) => rack.bins.map((bin) => [bin.id, rack])),
);

const flatBinList = racks.flatMap((rack) =>
  rack.bins.map((bin) => ({ bin, rackId: rack.id })),
);

export default function Index() {
  const controlsRef = useRef<any>(null);

  const [selection, setSelection] = useState<Selection | null>(null);

  const [searchText, setSearchText] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(true);

  const { getBinPosition } = useBinRegistry();

  const searchResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return flatBinList.filter(
      ({ bin }) =>
        bin.id.toLowerCase().includes(query) ||
        bin.label.toLowerCase().includes(query) ||
        bin.product.toLowerCase().includes(query),
    );
  }, [searchText]);

  const selectedBin = useMemo(
    () => (selection ? findBinById(selection.binId) : null),
    [selection],
  );

  const selectBin = useCallback(
    (binId: string) => {
      const rack = binToRackMap.get(binId);

      if (!rack) {
        return;
      }

      const position = getBinPosition(binId);

      if (!position) {
        return;
      }

      setSelection({
        binId,
        rackId: rack.id,
        binPosition: position,
        focusTarget: rack.position,
        focusRotation: rack.rotation,
      });
    },
    [getBinPosition],
  );

  const handleBinSelect = useCallback(
    (binId: string, _worldPosition: [number, number, number]) => {
      selectBin(binId);
    },
    [selectBin],
  );

  const clearSelection = useCallback(() => {
    setSelection(null);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <OrbitTouchSurface>
          {(domElement) => (
            <Canvas
              style={{ height: "100%", width: "100%" }}
              camera={{
                position: [10, 66, 10],
                fov: 50,
              }}
              frameloop={'demand'}
            >
              <WarehouseScene
                selectedBinId={selection?.binId ?? null}
                selectedRackId={selection?.rackId ?? null}
                onBinSelect={handleBinSelect}
              />

              <axesHelper />
              <Grid infiniteGrid fadeDistance={50} />

              <OrbitControls
              enableDamping={false}
                ref={controlsRef}
                domElement={domElement}
                maxPolarAngle={Math.PI / 2 - 0.1}
                minPolarAngle={Math.PI / 3}
              />
              <CameraController
                distance={20}
                controlsRef={controlsRef}
                focusTarget={selection?.focusTarget ?? null}
                focusRotation={selection?.focusRotation ?? null}
              />
            </Canvas>
          )}
        </OrbitTouchSurface>
      </GestureHandlerRootView>

      <WarehouseSearch
        value={searchText}
        onChangeText={(text) => {
          setShowSearchResults(true);
          setSearchText(text);
        }}
        results={showSearchResults ? searchResults : []}
        onResultPress={(binId) => {
          selectBin(binId);
          setShowSearchResults(false);
        }}
      />

      <BinInfoPanel bin={selectedBin ?? null} onClose={clearSelection} />
    </View>
  );
}
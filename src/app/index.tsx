import { Canvas } from "@react-three/fiber/native";
import { CameraControls, Grid, OrbitControls } from "@react-three/drei/native";
import { OrbitTouchSurface } from "../utils/MultiTouchOrbitBridge";
import WarehouseScene from "@/components/warehouse-scene";
import { Alert, View } from "react-native";
import { useCallback, useMemo, useRef, useState } from "react";
import { findBinById } from "@/utils/warehouseUtils";
import { BinInfoPanel } from "@/components/bin-info-panel";
import { CameraController } from "@/controls/camera-controls";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { WarehouseSearch } from "@/components/search-component";
import { racks } from "@/data/data";
import { useBinRegistry } from "@/context/bin-registry";

export default function Index() {
  const controlsRef = useRef<any>(null);

  const [selectedBinId, setSelectedBinId] = useState<string | null>(null);
  const [selectedRackId, setSelectedRackId] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");
  const { getBinPosition } = useBinRegistry();

  const searchResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const results = [];

    for (const rack of racks) {
      for (const bin of rack.bins) {
        const matches =
          bin.id.toLowerCase().includes(query) ||
          bin.label.toLowerCase().includes(query) ||
          bin.product.toLowerCase().includes(query);

        if (matches) {
          results.push({
            bin,
            rackId: rack.id,
          });
        }
      }
    }

    return results;
  }, [searchText]);

  const [selectedBinPosition, setSelectedBinPosition] = useState<
    [number, number, number] | null
  >(null);

  const [focusTarget, setFocusTarget] = useState<
    [number, number, number] | null
  >(null);

  const [showSearchResults, setShowSearchResults] = useState(true);

  const [focusRotation, setFocusRotation] = useState<
    [number, number, number] | null
  >(null);

  const selectedBin = useMemo(
    () => (selectedBinId ? findBinById(selectedBinId) : null),
    [selectedBinId],
  );

  const selectBin = useCallback(
    (binId: string) => {
      const rack = racks.find((rack) =>
        rack.bins.some((bin) => bin.id === binId),
      );

      if (!rack) {
        return;
      }

      const position = getBinPosition(binId);

      if (!position) {
        return;
      }

      setSelectedBinId(binId);
      setSelectedRackId(rack.id);
      setSelectedBinPosition(position);

      setFocusTarget(rack.position);
      setFocusRotation(rack.rotation);
      
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
    setSelectedBinId(null);
    setSelectedRackId(null);
    setSelectedBinPosition(null);
    setFocusTarget(null);
    setFocusRotation(null);
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
                selectedBinId={selectedBinId}
                selectedRackId={selectedRackId}
                onBinSelect={handleBinSelect}
              />

              <axesHelper />
              <Grid infiniteGrid fadeDistance={50} />

              <OrbitControls
                enableDamping
                dampingFactor={0.2}
                ref={controlsRef}
                domElement={domElement}
                maxPolarAngle={Math.PI / 2 - 0.1}
                minPolarAngle={Math.PI / 3}
              />
              <CameraController
                distance={20}
                controlsRef={controlsRef}
                focusTarget={focusTarget}
                focusRotation={focusRotation}
              />
            </Canvas>
          )}
        </OrbitTouchSurface>
      </GestureHandlerRootView>

      <WarehouseSearch
        value={searchText}
        onChangeText={(text) => {
          (setShowSearchResults(true), setSearchText(text));
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

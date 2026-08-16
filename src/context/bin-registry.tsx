import { createContext, useCallback, useContext, useRef } from "react";
import * as THREE from "three";

type BinRegistryContextType = {
  registerBin: (id: string, mesh: THREE.Mesh) => void;

  unregisterBin: (id: string) => void;

  getBinPosition: (id: string) => [number, number, number] | null;
};

const BinRegistryContext = createContext<BinRegistryContextType | null>(null);

export function BinRegistryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const binsRef = useRef(new Map<string, THREE.Mesh>());

  const registerBin = useCallback((id: string, mesh: THREE.Mesh) => {
    binsRef.current.set(id, mesh);
  }, []);

  const unregisterBin = useCallback((id: string) => {
    binsRef.current.delete(id);
  }, []);

  const getBinPosition = useCallback((id: string) => {
    const mesh = binsRef.current.get(id);

    if (!mesh) {
      return null;
    }

    const position = new THREE.Vector3();

    mesh.getWorldPosition(position);

    return [position.x, position.y, position.z] as [number, number, number];
  }, []);

  return (
    <BinRegistryContext.Provider
      value={{
        registerBin,
        unregisterBin,
        getBinPosition,
      }}
    >
      {children}
    </BinRegistryContext.Provider>
  );
}

export function useBinRegistry() {
  const context = useContext(BinRegistryContext);

  if (!context) {
    throw new Error("useBinRegistry must be used inside BinRegistryProvider");
  }

  return context;
}

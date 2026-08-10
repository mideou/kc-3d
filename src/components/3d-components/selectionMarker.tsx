type SelectionMarkerProps = {
  position: [number, number, number];
};

export function SelectionMarker({
  position,
}: SelectionMarkerProps) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />

      <meshBasicMaterial
        color="#33ff00"
      />
    </mesh>
  );
}
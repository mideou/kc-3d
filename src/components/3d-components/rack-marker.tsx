type RackMarkerProps = {
  position: [number, number, number];
  height: number;
};

export function RackMarker({
  position,
  height,
}: RackMarkerProps) {
  return (
    <mesh
      position={[
        position[0],
        position[1] + height + 0.5,
        position[2],
      ]}
    >
      <sphereGeometry args={[0.2, 16, 16]} />

      <meshBasicMaterial color="#ff0015" />
    </mesh>
  );
}
import { Line } from "@react-three/drei/native";


type AisleProps = {
  start: [number, number, number];
  end: [number, number, number];
  width: number;
};

export function Aisle({
  start,
  end,
  width,
}: AisleProps) {
  const halfWidth = width / 2;

  return (
    <group>
      {/* Center line */}
      <Line
        points={[start, end]}
        lineWidth={2}
        color="#f0c84b"
      />

      {/* Left boundary */}
      <Line
        points={[
          [
            start[0] - halfWidth,
            start[1],
            start[2],
          ],
          [
            end[0] - halfWidth,
            end[1],
            end[2],
          ],
        ]}
        lineWidth={1}
        color="#999999"
      />

      {/* Right boundary */}
      <Line
        points={[
          [
            start[0] + halfWidth,
            start[1],
            start[2],
          ],
          [
            end[0] + halfWidth,
            end[1],
            end[2],
          ],
        ]}
        lineWidth={1}
        color="#999999"
      />
    </group>
  );
}
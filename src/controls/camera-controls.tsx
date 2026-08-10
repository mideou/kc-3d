import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber/native";
import { Vector3 } from "three";

type CameraControllerProps = {
  focusTarget?: [number, number, number] | null;
  controlsRef: React.MutableRefObject<any>;
  distance?: number;
};

export function CameraController({
  focusTarget,
  controlsRef,
  distance = 5,
}: CameraControllerProps) {
  const { camera } = useThree();

  const targetPosition = useRef<Vector3 | null>(null);
  const targetLookAt = useRef<Vector3 | null>(null);

  useEffect(() => {
    if (!focusTarget) {
      return;
    }

    const target = new Vector3(
      focusTarget[0],
      focusTarget[1],
      focusTarget[2]
    );

    const offset = new Vector3(
      distance,
      distance * 0.6,
      distance
    );

    targetLookAt.current = target;

    targetPosition.current = target
      .clone()
      .add(offset);

  }, [focusTarget, distance]);

 useFrame(() => {
  if (
    !targetPosition.current ||
    !targetLookAt.current ||
    !controlsRef.current
  ) {
    return;
  }

  const position = targetPosition.current;
  const target = targetLookAt.current;

  const positionDistance =
    camera.position.distanceTo(position);

  const targetDistance =
    controlsRef.current.target.distanceTo(target);

  if (
    positionDistance < 0.01 &&
    targetDistance < 0.01
  ) {
    camera.position.copy(position);

    controlsRef.current.target.copy(target);

    controlsRef.current.update();

    targetPosition.current = null;
    targetLookAt.current = null;


    return;
  }

  camera.position.lerp(
    position,
    0.08
  );

  controlsRef.current.target.lerp(
    target,
    0.08
  );

  controlsRef.current.update();
});



  return null;
}
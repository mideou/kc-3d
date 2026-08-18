import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber/native";
import { Vector3 } from "three";
import * as THREE from 'three'


type CameraControllerProps = {
  focusTarget?: [number, number, number] | null;
  controlsRef: React.MutableRefObject<any>;
  distance?: number;
  focusRotation: [number, number, number] | null;
};

export function CameraController({
  focusTarget,
  controlsRef,
  distance = 5,
  focusRotation,
}: CameraControllerProps) {
  const { camera } = useThree();

  // --------------------------------
  // Reusable objects
  // --------------------------------

  const target = useRef(
    new THREE.Vector3()
  );

  const targetPosition = useRef(
    new THREE.Vector3()
  );

  const offset = useRef(
    new THREE.Vector3()
  );

  const rotation = useRef(
    new THREE.Euler()
  );

  // --------------------------------
  // Animation state
  // --------------------------------

  const animating = useRef(false);

  // --------------------------------
  // Animation speed
  // --------------------------------

  const LERP = 0.18;

  // --------------------------------
  // Update target
  // --------------------------------

  useEffect(() => {
    if (!focusTarget) {
      animating.current = false;
      return;
    }

    // Target
    target.current.set(
      focusTarget[0],
      focusTarget[1],
      focusTarget[2]
    );

    // Base offset
    offset.current.set(
      distance,
      distance * 5,
      distance
    );

    // Apply rack rotation
    if (focusRotation) {
      rotation.current.set(
        focusRotation[0],
        focusRotation[1],
        focusRotation[2]
      );

      offset.current.applyEuler(
        rotation.current
      );
    }

    // Calculate desired camera position
    targetPosition.current
      .copy(target.current)
      .add(offset.current);

    // Start animation
    animating.current = true;

  }, [
    focusTarget,
    distance,
    focusRotation,
  ]);

  // --------------------------------
  // Animation
  // --------------------------------

  useFrame(() => {
    if (!animating.current) {
      return;
    }

    const controls = controlsRef.current;

    if (!controls) {
      return;
    }

    // Move OrbitControls target
    controls.target.lerp(
      target.current,
      LERP
    );

    controls.update();

    /*
     * We intentionally DO NOT move the
     * camera here.
     *
     * OrbitControls is responsible for
     * the camera position.
     */

    // Stop when target is close enough
    /*if (
      controls.target.distanceToSquared(
        target.current
      ) < 0.0001
    ) {
      controls.target.copy(
        target.current
      );

      animating.current = false;
    }*/
  });

  return null;
}



 /*type CameraControllerProps = {
  focusTarget?: [number, number, number] | null;
  controlsRef: React.MutableRefObject<any>;
  distance?: number;
  focusRotation: [number, number, number] | null;
};

export function CameraController({
  focusTarget,
  controlsRef,
  distance = 5,
  focusRotation,
}: CameraControllerProps) {
  const { camera } = useThree();

  const targetPosition = useRef<THREE.Vector3 | null>(null);
  const targetLookAt = useRef<THREE.Vector3 | null>(null);

  const initialTarget = useRef(
    new THREE.Vector3(0, 0, 0)
  );

  useEffect(() => {
    if (!focusTarget) {
      targetPosition.current = null;
      targetLookAt.current = initialTarget.current.clone();
      return;
    }

    const target = new THREE.Vector3(
      focusTarget[0],
      focusTarget[1],
      focusTarget[2]
    );

    const offset = new THREE.Vector3(
      distance,
      distance * 5,
      distance
    );

    if (focusRotation) {
      const rotation = new THREE.Euler(
        focusRotation[0],
        focusRotation[1],
        focusRotation[2]
      );

      offset.applyEuler(rotation);
    }

    targetLookAt.current = target;

    targetPosition.current = target
      .clone()
      .add(offset);
  }, [focusTarget, distance, focusRotation]);

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
    const controls = controlsRef.current;

    //camera.position.lerp(position, 0.08);
    
    controls.target.lerp(target, 0.18);


    //controls.update();

    const positionDone =
      camera.position.distanceToSquared(position) < 0.0001;

    const targetDone =
      controls.target.distanceToSquared(target) < 0.0001;

    if (positionDone && targetDone) {
      camera.position.copy(position);
      controls.target.copy(target);

      controls.update();

      targetPosition.current = null;
      targetLookAt.current = null;
    }
  });

  return null;
} */
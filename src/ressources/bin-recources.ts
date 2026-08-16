import * as THREE from "three";

export const BIN_DIMENSIONS = {
  small: {
    width: 0.2,
    height: 0.2,
    depth: 0.6,
  },

  slim: {
    width: 1.0,
    height: 0.4,
    depth: 0.8,
  },

  normal: {
    width: 0.9,
    height: 0.7,
    depth: 0.9,
  },
} as const;

export const smallBinGeometry = new THREE.BoxGeometry(
  BIN_DIMENSIONS.small.width,
  BIN_DIMENSIONS.small.height,
  BIN_DIMENSIONS.small.depth
);

export const slimBinGeometry = new THREE.BoxGeometry(
  BIN_DIMENSIONS.slim.width,
  BIN_DIMENSIONS.slim.height,
  BIN_DIMENSIONS.slim.depth
);

export const normalBinGeometry = new THREE.BoxGeometry(
  BIN_DIMENSIONS.normal.width,
  BIN_DIMENSIONS.normal.height,
  BIN_DIMENSIONS.normal.depth
);
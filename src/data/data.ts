type BinType =
  | "small"
  | "slim"
  | "normal";


export type BinData = {
  id: string;

  type: BinType,

  
  
  label: string;
  product: string;
};

export type RackData = {
  id: string;

  position: [number, number, number];
  rotation: [number, number, number];

  width: number;
  height: number;
  depth: number;

  shelfCount: number;

  bins: BinData[];
};

function createBins(
  rackId: string,
  shelfCount: number,
  binsPerShelf: number
): BinData[] {
  const bins: BinData[] = [];

  for (let shelf = 0; shelf < shelfCount; shelf++) {
    for (
      let column = 0;
      column < binsPerShelf;
      column++
    ) {
      const id =
        `${rackId}-S${shelf + 1}-B${column + 1}`;

      bins.push({
        id,
        type: shelf === 1 ? 'small' : 'normal',
        label: `S${shelf + 1}-B${column + 1}`,
        product: `Product ${column + 1}`,
      });
    }
  }

  return bins;
}

export const WAREHOUSE = {
  width: 14,
  depth: 14,

  rackSpacingX: 6,
  rackSpacingZ: 6,

  aisleWidth: 2,
};


const RACK_ROWS = 8;
const RACKS_PER_ROW = 4;

const RACK_SPACING_X = 4;
const RACK_SPACING_Z = 5;

export const aislePositions = Array.from(
  { length: RACK_ROWS - 1 },
  (_, index) => {
    return (
      -((RACK_ROWS - 1) * RACK_SPACING_Z) / 2 +
      index * RACK_SPACING_Z +
      RACK_SPACING_Z / 2
    );
  }
);

export function findRackByBinId(
  binId: string
): RackData | null {
  for (const rack of racks) {
    if (
      rack.bins.some(
        (bin) => bin.id === binId
      )
    ) {
      return rack;
    }
  }

  return null;
}



export const racks: RackData[] = [];

for (let row = 0; row < RACK_ROWS; row++) {
  for (let column = 0; column < RACKS_PER_ROW; column++) {
    const id =
      `R${String(
        row * RACKS_PER_ROW + column + 1
      ).padStart(3, "0")}`;

    racks.push({
      id,

      position: [
        (column -
          (RACKS_PER_ROW - 1) / 2) *
          RACK_SPACING_X,

        0.2,

        (row -
          (RACK_ROWS - 1) / 2) *
          RACK_SPACING_Z,
      ],

      rotation: [0, Math.PI/2, 0],

      width: 4,
      height: 4,
      depth: 1.2,

      shelfCount: 6,

      bins: createBins(
        id,
        4,
        3
      ),
    });
  }

  
}
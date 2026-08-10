import {
  BinData,
  racks,
} from '@/data/data';

export function findBinById(
  id: string
): BinData | undefined {
  for (const rack of racks) {
    const bin = rack.bins.find(
      (bin) => bin.id === id
    );

    if (bin) {
      return bin;
    }
  }

  return undefined;
}
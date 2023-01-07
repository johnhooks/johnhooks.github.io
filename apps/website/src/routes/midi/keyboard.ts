type Point = {
  x: number;
  y: number;
};

type KeyPos = Point & {
  width: number;
};

/**
 * The structure of a simple keyboard, sans the bottom row.
 */
const structure = [
  [...fill(13), 1.5],
  [1.5, ...fill(13)],
  [1.8, ...fill(11), 1.8],
  [2.25, ...fill(10), 2.25],
] as const;

/**
 * Calculate positions and width of keyboard keys.
 */
export function calcKeyPos(size: number, spacing: number, offset: Point = { x: 0, y: 0 }) {
  const result: KeyPos[] = [];
  for (let i = 0; i < structure.length; i++) {
    const row = structure[i];

    const y = (size + spacing) * i;
    let x = 0;

    for (let j = 0; j < row.length; j++) {
      const ratio = row[j];
      // Pretty hacky, maybe I can find a better solution.
      const adjust = ratio === 1 ? 0 : ratio > 2 ? 1.25 : 0.5;
      const width = size * ratio + adjust * spacing;

      result.push({ x: x + offset.x, y: y + offset.y, width });

      // Update the offset
      x = x + width + spacing;
    }
  }

  // Push in space bar
  result.push({
    x: 4.25 * size + 4.25 * spacing + offset.x,
    y: (size + spacing) * 4 + offset.y,
    width: (size + spacing) * 5 + size,
  });

  return result;
}

function fill(length: number, value = 1): number[] {
  return Array.from({ length }, () => value);
}

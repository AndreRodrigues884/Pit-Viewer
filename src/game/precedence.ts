import type { GridCell } from '../scene/blockModel'

export const cellKey = ({ i, j, level }: GridCell) => `${i},${j},${level}`

export function cellsAbove({ i, j, level }: GridCell): GridCell[] {
  const cells: GridCell[] = []
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      cells.push({ i: i + di, j: j + dj, level: level + 1 })
    }
  }
  return cells
}

export function isExposed(cell: GridCell, remaining: ReadonlySet<string>): boolean {
  return cellsAbove(cell).every((above) => !remaining.has(cellKey(above)))
}

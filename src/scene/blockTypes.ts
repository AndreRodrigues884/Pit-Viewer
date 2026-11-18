export type BlockType = 'soil' | 'waste' | 'ore'

export const BLOCK_TYPES: BlockType[] = ['soil', 'waste', 'ore']

export const BLOCK_COLORS: Record<BlockType, string> = {
  soil: '#8a6f4d',
  waste: '#7f8285',
  ore: '#d0822f',
}

export const BLOCK_LABELS: Record<BlockType, string> = {
  soil: 'Soil',
  waste: 'Waste',
  ore: 'Ore',
}

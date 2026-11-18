import type { Point3 } from '../measurement/distance'

const formatCoordinate = (value: number) => (Math.round(value * 10) / 10 || 0).toFixed(1)

export const formatPoint = ({ x, y, z }: Point3) =>
  `X ${formatCoordinate(x)} · Y ${formatCoordinate(y)} · Z ${formatCoordinate(z)}`

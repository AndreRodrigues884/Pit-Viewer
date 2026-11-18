import type { Point3 } from '../measurement/distance'

const formatCoordinate = (value: number) => (Math.round(value * 10) / 10 || 0).toFixed(1)

export const formatPoint = ({ x, y, z }: Point3) =>
  `X ${formatCoordinate(x)} · Y ${formatCoordinate(y)} · Z ${formatCoordinate(z)}`

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export const formatCurrency = (value: number) => currency.format(value)

export const formatTonnes = (value: number) =>
  `${Math.round(value).toLocaleString('en-US')} t`

export const formatGrade = (grade: number) => `${grade.toFixed(2)} % Cu`

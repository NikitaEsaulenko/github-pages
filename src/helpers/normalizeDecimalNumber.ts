export const normalizeDecimalNumber = (value: number, times = 100000000000) => {
  return Math.round(value * times) / times
}

export const getStringFromNumber = (value: null | number) => {
  if (value === null || value === Infinity || value === -Infinity) return ''
  return value.toString()
}

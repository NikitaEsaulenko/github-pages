const REGEXP_NOT_NUMBERS = /^(-)|[.](?=[^.]*[.](?!$))|[.]+$|[^0-9.]+/g

export const getNumberFromString = (value: string) => {
  if (value === '') return null

  const stringWithNumbers = value.replace(REGEXP_NOT_NUMBERS, '$1')

  if (stringWithNumbers) {
    if (/^-([.0])*$/g.test(stringWithNumbers)) return null

    const number = parseFloat(stringWithNumbers)
    if (!Number.isNaN(number)) return number
  }

  return null
}

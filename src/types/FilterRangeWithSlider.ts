export type FilterRangeWithSlider = {
  id: string
  max: number
  min: number
  step: number
  title: string
  type: 'RangeWithSlider'
  value: {
    from: null | number
    to: null | number
  }
}

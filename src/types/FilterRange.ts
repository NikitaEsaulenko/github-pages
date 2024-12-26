export type FilterRange = {
  id: string
  max: number
  min: number
  title: string
  type: 'Range'
  value: {
    from: null | number
    to: null | number
  }
}

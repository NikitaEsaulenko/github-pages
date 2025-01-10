export const useTestId = (id: string) => {
  return {
    getTestId: (name: string) => {
      return `${id}-${name}`
    },
  }
}

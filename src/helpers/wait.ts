/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const wait = (ms: number, value: any = undefined) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })

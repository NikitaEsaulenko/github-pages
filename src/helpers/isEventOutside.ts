export const isEventOutside = (element: HTMLElement, event: PointerEvent) => {
  const composedPath = event
    .composedPath()
    .filter((x) => (x as Node).nodeType === Node.ELEMENT_NODE)
  return composedPath.every((x) => element && !element.contains(x as HTMLElement))
}

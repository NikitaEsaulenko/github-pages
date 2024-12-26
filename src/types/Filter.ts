import type { FilterCheckbox } from './FilterCheckbox'
import type { FilterRadio } from './FilterRadio'
import type { FilterRange } from './FilterRange'
import type { FilterRangeWithSlider } from './FilterRangeWithSlider'
import type { FilterRating } from './FilterRating'
import type { FilterSwitch } from './FilterSwitch'

export type Filter =
  | FilterCheckbox
  | FilterRadio
  | FilterRange
  | FilterRangeWithSlider
  | FilterRating
  | FilterSwitch

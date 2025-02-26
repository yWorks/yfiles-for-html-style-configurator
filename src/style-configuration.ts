import { ArrowNodeStyle, ShapeNodeStyle } from '@yfiles/yfiles'

export type ShapeNodeStyleConfiguration = ConstructorParameters<
  typeof ShapeNodeStyle
>[0]
export type ArrowNodeStyleConfiguration = ConstructorParameters<
  typeof ArrowNodeStyle
>[0]

export type StyleConfiguration =
  | ShapeNodeStyleConfiguration
  | ArrowNodeStyleConfiguration

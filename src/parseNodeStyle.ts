import { StyleConfiguration } from './style-configuration'
import {
  Color,
  CssFill,
  DashStyle,
  DashStyleConvertible,
  Fill,
  FillConvertible,
  INodeStyle,
  ShapeNodeShape,
  ShapeNodeShapeStringValues,
  ShapeNodeStyle,
  Stroke,
  StrokeConvertible,
} from '@yfiles/yfiles'

const defaultShapeNodeStyle = new ShapeNodeStyle()

export function parseNodeStyle(style: INodeStyle): StyleConfiguration {
  if (!(style instanceof ShapeNodeStyle)) {
    return {}
  }

  const configuration = {} as NonNullable<StyleConfiguration>

  if (!fillEquals(style.fill, defaultShapeNodeStyle.fill)) {
    configuration.fill = parseFill(style.fill)
  }

  if (!strokeEquals(style.stroke, defaultShapeNodeStyle.stroke)) {
    configuration.stroke = parseStroke(style.stroke)
  }

  if (
    style.keepIntrinsicAspectRatio !==
    defaultShapeNodeStyle.keepIntrinsicAspectRatio
  ) {
    configuration.keepIntrinsicAspectRatio = style.keepIntrinsicAspectRatio
  }

  if (style.cssClass !== defaultShapeNodeStyle.cssClass) {
    configuration.cssClass = style.cssClass
  }

  if (style.shape !== defaultShapeNodeStyle.shape) {
    configuration.shape = formatEnum(
      ShapeNodeShape.getName(style.shape),
    ) as ShapeNodeShapeStringValues
  }

  return configuration
}

function strokeEquals(s1: Stroke | null, s2: Stroke | null) {
  return (
    s1 === s2 ||
    (s1 !== null &&
      s2 !== null &&
      fillEquals(s1.fill, s2.fill) &&
      s1.thickness === s2.thickness &&
      dashStyleEquals(s1, s2))
  )
}

function fillEquals(f1: Fill | null, f2: Fill | null) {
  return f1 === f2 || (f1 !== null && f2 !== null && f1.hasSameValue(f2))
}

function dashStyleEquals(s1: Stroke, s2: Stroke) {
  return s1.dashStyle === s2.dashStyle
}

function formatEnum(shape: string) {
  return shape.toLowerCase().replaceAll('_', '-')
}

function parseStroke(stroke: Stroke | null): StrokeConvertible | null {
  if (stroke == null) {
    return null
  }

  return `${stroke.thickness}px ${parseDashStyle(stroke.dashStyle)} ${parseFill(stroke.fill)}`
}

function parseDashStyle(dashStyle: DashStyle): DashStyleConvertible {
  if (!dashStyle.dashes || dashStyle.dashes.size === 0) {
    return 'solid'
  }
  return 'dash'
}

function parseFill(fill: Fill | null): FillConvertible | null {
  if (fill == null) {
    return null
  }

  if (fill instanceof Color) {
    return `#${[fill.r, fill.g, fill.b, fill.a].map((c) => c.toString(16).padStart(2, '0')).join('')}`
  }

  if (fill instanceof CssFill) {
    return fill.value
  }

  return null
}

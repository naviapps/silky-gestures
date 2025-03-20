import Konva from 'konva';
import React, { useRef } from 'react';
import { Layer, Shape, Stage } from 'react-konva';

export type SilkyGesturesProps = React.ComponentPropsWithoutRef<
  typeof Stage
> & {
  width?: number;
  height?: number;
};

export function SilkyGestures({
  width = window.innerWidth,
  height = window.innerHeight,
  ...rest
}: SilkyGesturesProps = {}) {
  const shapeRef = useRef<Konva.Shape>(null);

  return (
    <Stage width={width} height={height} {...rest}>
      <Layer>
        <Shape ref={shapeRef} lineJoin="round" lineCap="round" />
      </Layer>
    </Stage>
  );
}

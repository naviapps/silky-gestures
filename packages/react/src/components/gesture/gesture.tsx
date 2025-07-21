import React, { JSX } from 'react';

import { Line } from '@/components/line';

import { useSettings } from '@/stores/settings-store';

export type GestureProperties = {
  gesture: string;
  width: number;
  height: number;
  lineWidth?: number;
};

export function Gesture({ gesture, width, height, lineWidth }: GestureProperties): JSX.Element {
  const { gestures } = useSettings();

  let context = '';
  switch (gesture[0]) {
    case 's': {
      context = 's';
      gesture = gesture.slice(1);
      break;
    }
    case 'l': {
      context = 'l';
      gesture = gesture.slice(1);
      break;
    }
    case 'i': {
      context = 'i';
      gesture = gesture.slice(1);
      break;
    }
    // No default
  }

  const style: React.CSSProperties = { minHeight: '2em', overflow: 'hidden' };
  const c: JSX.Element = <Line gesture={gesture} width={width} height={height} lineWidth={lineWidth} style={style} />;

  let message: string | undefined;
  switch (context) {
    case 's': {
      message = `* ${i18n.t('context_with_selection')}`;
      break;
    }
    case 'l': {
      message = `* ${i18n.t('context_on_link')}`;
      break;
    }
    case 'i': {
      message = `* ${i18n.t('context_on_image')}`;
      break;
    }
    default: {
      if (gestures[`s${gesture}`]) {
        message = `* ${i18n.t('context_not_selection')}`;
      } else if (gestures[`l${gesture}`] && gestures[`i${gesture}`]) {
        message = `* ${i18n.t('context_not_links_images')}`;
      } else if (gestures[`l${gesture}`]) {
        message = `* ${i18n.t('context_not_link')}`;
      } else if (gestures[`i${gesture}`]) {
        message = `* ${i18n.t('context_not_image')}`;
      }
    }
  }

  if (!message) {
    return c;
  }
  return (
    <div style={{ width: `${width}px`, overflow: 'hidden' }}>
      <div
        style={{
          fontSize: `${12 * Math.sqrt(width / 100)}px`,
          color: '#888',
          textAlign: 'right',
          marginRight: '.3em',
          height: '0px',
          position: 'relative',
          top: '.1em',
        }}
      >
        {message}
      </div>
      {c}
    </div>
  );
}

import { SilkyGestures } from '@/components/silky-gestures';
import { useEffect, useRef } from 'react';

import * as actions from '@/entrypoints/content/actions';
import { onMessage, removeAllListeners } from '@/entrypoints/content/messaging';
import { useSettings } from '@/stores/settings-store';

function App() {
  const { width = 0, height = 0 } = useWindowSize();
  const { gestureMapping, lineStroke, lineStrokeWidth } = useSettings();
  const silkyGesturesRef = useRef<SilkyGesturesHandle>(null);

  useEffect(() => {
    onMessage('stop', actions.stop);
    onMessage('gotoTop', actions.gotoTop);
    onMessage('gotoBottom', actions.gotoBottom);
    onMessage('pageUp', actions.pageUp);
    onMessage('pageDown', actions.pageDown);
    onMessage('pageNext', actions.pageNext);
    onMessage('pagePrevious', actions.pagePrevious);
    onMessage('showCookies', actions.showCookies);
    onMessage('print', actions.print);
    onMessage('copy', ({ data }) => actions.copy(data));
    onMessage('copyLink', ({ data }) => actions.copyLink(data));

    return () => {
      removeAllListeners();
    };
  });

  return (
    <SilkyGestures
      ref={silkyGesturesRef}
      gestures={Object.keys(gestureMapping)}
      width={width}
      height={height}
      lineStroke={lineStroke}
      lineStrokeWidth={lineStrokeWidth}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 2_147_483_647,
        pointerEvents: 'none',
      }}
    />
  );
}

export default App;

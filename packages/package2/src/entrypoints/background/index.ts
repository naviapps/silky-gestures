import createActions from '@/entrypoints/background/actions';
import { onMessage } from '@/entrypoints/background/messaging';
import { settingsStore } from '@/stores/settings-store';

export default defineBackground(() => {
  settingsStore.subscribe(() => {
    //
  });

  onMessage('gesture', async ({ data, sender: { tab } }) => {
    if (!tab) {
      return;
    }
    const { gestureMapping } = settingsStore.getState();

    let { gesture } = data;
    if (data.selection && gestureMapping[`s${gesture}`]) {
      gesture = `s${gesture}`;
    } else if (data.links.length > 0 && gestureMapping[`l${gesture}`]) {
      gesture = `l${gesture}`;
    } else if (data.images.length > 0 && gestureMapping[`i${gesture}`]) {
      gesture = `i${gesture}`;
    }

    if (gesture && gestureMapping[gesture]) {
      const call = async () => {
        const tabs = await browser.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
        if (tabs.length === 0) {
          return;
        }
      };

      try {
        const actions = createActions(tab, data);
        // TODO
        const id = gestureMapping[gesture];
        if (id in actions) {
          console.log(actions[id as keyof typeof actions]);
          await actions[id as keyof typeof actions]();
          await call();
        }
        //
      } catch {
        /* empty */
      }
    }
  });
});

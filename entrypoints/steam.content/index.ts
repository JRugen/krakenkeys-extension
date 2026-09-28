import '@/assets/tailwind.css';
import { createApp, type Component } from 'vue';
import { currencySetting, headerChipSetting, keyshopsSetting } from '@/utils/settings';
import { useDeal } from '@/utils/useDeal';
import DealBox from './DealBox.vue';
import HeaderChip from './HeaderChip.vue';

export default defineContentScript({
  matches: ['*://store.steampowered.com/app/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    const steamAppId = Number(location.pathname.match(/^\/app\/(\d+)/)?.[1]);

    if (!steamAppId || !document.querySelector('#game_area_purchase')) {
      return;
    }

    const mount = async (name: string, anchor: string, append: 'first' | 'before', component: Component) => {
      const ui = await createShadowRootUi(ctx, {
        name,
        position: 'inline',
        anchor,
        append,
        onMount(container) {
          const app = createApp(component);
          app.mount(container);
          return app;
        },
        onRemove(app) {
          app?.unmount();
        },
      });

      ui.mount();
    };

    await mount('krakenkeys-deal', '#game_area_purchase', 'first', DealBox);

    if ((await headerChipSetting.getValue()) && document.querySelector('#userReviews')) {
      await mount('krakenkeys-chip', '#userReviews', 'before', HeaderChip);
    }

    const { state, load } = useDeal();
    const reload = () => load(steamAppId);

    currencySetting.watch(reload);
    keyshopsSetting.watch((includeKeyshops) => (state.officialOnly = !includeKeyshops));

    await reload();
  },
});

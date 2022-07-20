import {
  mapState,
  mapGetters,
  mapActions,
  mapMutations,
} from 'vuex';

export const authComputed = {
  ...mapState('auth', {
    getCurrentUser: (state) => state.user,
  }),
  ...mapGetters('auth', ['isAuthenticated', 'getCurrentUser']),
};

export const authMethods = mapMutations('auth', ['setUser']);

export const marketComputed = {
  ...mapState('market', {
    market: (state) => state.market,
    country: (state) => state.country,
  }),
  ...mapGetters('market', ['getMarket', 'getCountry']),
};
export const marketMethods = mapMutations('market', ['setMarket', 'deleteMarket', 'setCountry']);
export const marketActions = mapActions('market', ['initApp']);
export const hotelComputed = {
  ...mapState('hotel', {
    hotel: (state) => state.hotel,
  }),
  ...mapGetters('hotel', ['getHotel']),
};
export const hotelMethods = mapMutations('hotel', ['setHotel', 'deleteHotel', 'changeHotelValue']);

export const hotelActions = mapActions('hotel', ['initApp', 'updateHotelMarket']);
export const layoutMethods = mapActions(
  'layout',
  ['changeLayoutType', 'changeLayoutWidth', 'changeSidebarSize', 'changeTopbar', 'changeMode', 'changePosition', 'changeSidebarView',
    'changeSidebarColor',
  ],
);
export const layoutComputed = {
  ...mapState('layout', {
    layoutType: (state) => state.layoutType,
    sidebarSize: (state) => state.sidebarSize,
    layoutWidth: (state) => state.layoutWidth,
    topbar: (state) => state.topbar,
    mode: (state) => state.mode,
    position: (state) => state.position,
    sidebarView: (state) => state.sidebarView,
    sidebarColor: (state) => state.sidebarColor,
  }),
};

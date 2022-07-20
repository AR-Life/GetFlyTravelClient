/* eslint-disable no-shadow */

import appAxios from '@/utils/appAxios';

export const state = {
  market: [],
  country: [],
};

export const getters = {
  // Whether the user is currently logged in.
  getMarket: (state) => ((state.market.length > 0) ? state.market : false),
  getCountry: (state) => state.country,
};

export const mutations = {
  setMarket(state, market) {
    const i = state.market.findIndex((x) => x._id === market._id);
    if (i >= 0) {
      state.market[i] = market;
    } else {
      state.market.push(market);
    }
  },
  deleteMarket(state, market) {
    state.market = state.market.filter((x) => x._id !== market._id);
  },
  setCountry(state, country) {
    state.country = country;
  },
};

export const actions = {
  async initApp({ commit }) {
    if (state.country.length < 1) {
      await appAxios.appAxios.get('/country').then((response) => {
        commit('setCountry', response.data);
      });
    }
    if (state.market.length < 1) {
      await appAxios.appAxios.get('/market').then((response) => {
        response.data.length > 0 ? response.data.forEach((element) => {
          commit('setMarket', element);
        }) : false;
      });
    }
  },
};

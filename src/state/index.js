import {
  createStore,
} from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import modules from './modules';

const dataState = createPersistedState({
  storage: {
    getItem: (key) => localStorage.getItem(key),
    setItem: (key, value) => localStorage.setItem(key, value),
    removeItem: (key) => localStorage.removeItem(key),
  },
});
const store = createStore({
  modules,
  plugins: [dataState],
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
});

export default store;

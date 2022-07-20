/* eslint-disable no-shadow */
export const state = {
  user: null,
};

export const getters = {
  // Whether the user is currently logged in.
  isAuthenticated: (state) => state.user?.token?.access_token != null,
  getCurrentUser: (state) => state.user,
};

export const mutations = {
  setUser: (state, user) => {
    state.user = user;
  },
};

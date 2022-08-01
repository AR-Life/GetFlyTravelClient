import appAxios from '@/utils/appAxios';

/* eslint-disable no-shadow */
export const state = {
  hotel: [],
};

export const getters = {
  getHotel: (state) => (state.hotel.length > 0 ? state.hotel : false),
};

export const mutations = {
  setHotel(state, hotel) {
    const i = state.hotel.findIndex((x) => x.id === hotel.id);
    if (i >= 0) {
      state.hotel[i] = hotel;
    } else {
      state.hotel.push(hotel);
    }
  },
  deleteHotel(state, hotel) {
    state.hotel = state.hotel.filter((x) => x.id !== hotel.id);
  },
  changeHotelValue(state, data) {
    const i = state.hotel.findIndex((x) => x.id === data.id);
    if (i >= 0) {
      switch (String(data.type)) {
        case 'period': {
          state.hotel[i].period = state.hotel[i].period.filter((x) => !data.period.map((y) => y._id).includes(x._id));
          state.hotel[i].period = state.hotel[i].period.filter((x) => !data.delete.includes(x._id));
          data.period.forEach((x) => {
            state.hotel[i].period.push(x);
          });
          break;
        }
        case 'room':
          state.hotel[i].room = data.room;
          break;
        case 'contract':
          state.hotel[i].contract = data.contract;
          break;
        case 'action':
          // state.hotel[i].actions.findIndex((x) => x._id)
          break;
        default:
          state.hotel[i].info = data.info;
          break;
      }
    }
  },
};

export const actions = {
  async initApp({ commit }) {
    if (state.hotel.length < 1) {
      await appAxios.appAxios.get('/hotel').then((response) => {
        response.data.forEach((hotel) => {
          commit('setHotel', hotel);
        });
      });
    }
    return true;
  },
  async addNewHotelOrContract(context, data) {
    return 'sex';
  },
  async updateHotelMarket(context, data) {
    const hotel = data;
    hotel.contract = hotel.contract.map((c) => {
      const newItem = { ...c };
      newItem.country = newItem.country.map((x) => x._id);
      newItem.market = newItem.market.map((x) => x._id);
      return newItem;
    });
    await appAxios.appAxios.post('/countryandhotel/edit', hotel).then((res) => {
      const contract = res.data.map((c) => {
        const newContract = c;
        newContract.country = newContract.country.map((x) => x.country_id);
        return newContract;
      });
      const data = {
        id: hotel.id,
        type: 'contract',
        contract,
      };
      context.commit('changeHotelValue', data);
    });
    return true;
  },
};

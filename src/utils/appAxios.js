/* eslint-disable dot-notation */
/* eslint-disable import/no-import-module-exports */
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000',
  resolve: {
    fallback: {
      url: require.resolve('url/'),
    },
  },
});
const appAxios = {
  appAxios: instance,
};
export default appAxios;

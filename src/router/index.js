import {
  createRouter,
  createWebHistory,
} from 'vue-router';
import store from '@/state';
import appAxios from '@/utils/appAxios';

const routes = [{
  path: '/login',
  name: 'Login',
  meta: {
    reload: true,
  },
  component: () => import('../views/Login.vue'),
},
{
  path: '/',
  name: 'home',
  meta: {
    reload: true,
  },
  component: () => import('../views/Index.vue'),
},
{
  path: '/hotels',
  name: 'hotels',
  component: () => import('../views/hotel/index.vue'),
},
{
  path: '/hotels2',
  name: 'hotels2',
  component: () => import('../views/hotel/index-2.vue'),
},
{
  path: '/hotels/add',
  name: 'hotelAdd',
  component: () => import('../views/hotel/store.vue'),
},
{
  path: '/markets',
  name: 'markets',
  component: () => import('../views/market/index.vue'),
},
{
  path: '/markets/add',
  name: 'marketsAdd',
  component: () => import('../views/market/store.vue'),
},
{
  path: '/actions',
  name: 'actions',
  component: () => import('../views/action/index.vue'),
},
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((routeTo, routeFrom, next) => {
  const publicPages = ['/login', '/register', '/forgot-password'];
  const authpage = !publicPages.includes(routeTo.path);
  const loggeduser = store.getters['auth/isAuthenticated'];
  const user = store.getters['auth/getCurrentUser'];

  if (authpage && !loggeduser) {
    return next('/login');
  }
  appAxios.appAxios.defaults.headers = {
    Authorization: `bearer ${user?.token?.access_token}`,
  };
  return next();
});

export default router;

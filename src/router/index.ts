import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import neuronRouter from '@/router/neuron';
import icTokensRouter from '@/router/icTokens';
import lighthouseRouter from '@/router/lighthouse';
import ICDexRouter from '@/router/ICDex';
import dappsRouter from '@/router/dapps';
import cyclesFinanceRouter from '@/router/cyclesFinance';
import welcomeRouter from '@/router/welcome';
import ICMonitorRouter from '@/router/ICMonitor';
import iclRouter from '@/router/icl';
import ICSwapRouter from '@/router/ICSwap';
import ICSNSRouter from '@/router/ICSNS';
import Error from '@/views/error.vue';

Vue.use(VueRouter);

let redirect = '/icdex';
// todo
if (window.location.hostname === 'icdex.io') {
  redirect = '/icdex';
}
if (window.location.hostname === 'icswap.io') {
  redirect = '/ICSwap';
}
if (window.location.hostname === 'cycles.finance') {
  redirect = '/cyclesFinance';
}
const routes: Array<RouteConfig> = [
  // { path: '/Home', redirect: '/login' },
  {
    path: '',
    name: 'Home',
    component: () => import('@/views/home/Index.vue'),
    meta: {
      title: 'ICLightHouse'
    },
    redirect: redirect,
    children: [
      {
        path: '/account',
        name: 'Account',
        component: () => import('@/views/home/account/Index.vue'),
        meta: {
          title: 'ICLight Wallet',
          version: '0.5beta',
          requireAuth: true,
          measurementId: 'G-GDQWYFKT8H'
        }
      },
      {
        path: '/wallet',
        name: 'Account',
        component: () => import('@/views/home/account/Index.vue'),
        meta: {
          title: 'ICLight Wallet',
          version: '0.5beta',
          requireAuth: true,
          measurementId: 'G-GDQWYFKT8H'
        }
      },
      {
        path: '/icRouter',
        name: 'Account',
        component: () => import('@/views/home/account/Index.vue'),
        meta: {
          title: 'icRouter',
          version: '0.5beta',
          requireAuth: true,
          measurementId: 'G-GDQWYFKT8H'
        }
      },
      {
        path: '/account/TransactionList/:type',
        name: 'transactionList',
        component: () =>
          import('@/views/home/account/transactionList/Index.vue'),
        meta: {
          title: 'ICLight Wallet',
          version: '0.5beta',
          requireAuth: true
        }
      },
      {
        path: '/Dashboard',
        name: 'Dashboard',
        component: () => import('@/views/home/dashboard/Index.vue'),
        meta: {
          title: 'Dashboard',
          version: '0.5beta',
          requireAuth: false,
          measurementId: 'G-GDQWYFKT8H'
        }
      },
      ...neuronRouter,
      ...icTokensRouter,
      ...lighthouseRouter,
      ...ICDexRouter,
      ...dappsRouter,
      ...cyclesFinanceRouter,
      ...ICMonitorRouter,
      ...iclRouter,
      ...ICSwapRouter,
      // ...ICStableRouter,
      ...ICSNSRouter
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Index.vue'),
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/loginByExists',
    name: 'loginByExists',
    component: () => import('@/views/loginByExists/Index.vue'),
    meta: {
      title: 'loginByExists'
    }
  },
  {
    path: '/sign/:type?',
    name: 'Sign',
    component: () => import('@/views/sign/Index.vue'),
    meta: {
      title: 'Sign'
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  },
  ...welcomeRouter
];
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
  return originalPush.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: 'history',
  // base: '/',
  routes
});

export default router;

import { RouteConfig } from 'vue-router';
const ICDexRouter: RouteConfig[] = [
  {
    path: '/ICDex',
    name: 'ICDex',
    component: () => import('@/views/home/ICDex/Index.vue'),
    meta: {
      isTrade: true,
      title: 'ICDex - A 100% on-chain orderbook Dex',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/ICDex/:token0/:token1',
    name: 'ICDex',
    component: () => import('@/views/home/ICDex/Index.vue'),
    meta: {
      isTrade: true,
      title: 'ICDex - A 100% on-chain orderbook Dex',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/ICDex/market',
    name: 'Market',
    component: () => import('@/views/home/ICDex/Market.vue'),
    meta: {
      title: 'Market',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/ICDex/competitions',
    name: 'Competitions',
    component: () => import('@/views/home/ICDex/Competitions.vue'),
    meta: {
      title: 'Competitions',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  }
];

export default ICDexRouter;

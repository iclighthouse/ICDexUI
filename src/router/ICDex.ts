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
    path: '/ICDex/info',
    name: 'Info',
    component: () => import('@/views/home/ICDex/Market.vue'),
    meta: {
      title: 'Info',
      details: 'Info',
      version: '0.5test',
      scrollTop: 0,
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/ICDex/pools',
    name: 'Pools',
    component: () => import('@/views/home/ICDex/Pools.vue'),
    meta: {
      title: 'Pools',
      details: 'Pools',
      version: '0.5test',
      keepAlive: true,
      isBack: false,
      scrollTop: 0,
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/ICDex/pools/pool/:poolId/:type?',
    name: 'Pool',
    component: () => import('@/views/home/ICDex/Pool.vue'),
    meta: {
      title: 'Pool',
      details: 'Pool',
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
  },
  {
    path: '/NFT',
    name: 'NFT',
    component: () => import('@/views/home/ICDex/NFT.vue'),
    meta: {
      title: 'NFT',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  },
  {
    path: '/Airdrop',
    name: 'Airdrop',
    component: () => import('@/views/home/ICDex/Airdrop.vue'),
    meta: {
      title: 'Airdrop',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-056B85Q2L0'
    }
  }
];

export default ICDexRouter;

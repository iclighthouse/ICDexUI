import { RouteConfig } from 'vue-router';
const ICStableRouter: RouteConfig[] = [
  {
    path: '/ICStable',
    name: 'ICStable',
    component: () => import('@/views/home/ICStable/Index.vue'),
    meta: {
      title: 'ICStable',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-JHKVS0R6JF'
    }
  },
  {
    path: '/ICStable/positions',
    name: 'ICStablePositions',
    component: () => import('@/views/home/ICStable/Positions.vue'),
    meta: {
      title: 'ICStable',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-JHKVS0R6JF'
    }
  },
  {
    path: '/ICStable/open/:tokenId?/:dpId?',
    name: 'ICStableOpen',
    component: () => import('@/views/home/ICStable/Open.vue'),
    meta: {
      title: 'ICStable',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-JHKVS0R6JF'
    }
  }
];
export default ICStableRouter;

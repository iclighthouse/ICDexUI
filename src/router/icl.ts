import { RouteConfig } from 'vue-router';
const iclRouter: RouteConfig[] = [
  {
    path: '/icl',
    name: 'ICL',
    redirect: '/icl/tradingMining',
    component: () => import('@/views/home/icl/Index.vue'),
    meta: {
      title: 'ICL',
      version: '0.5beta',
      requireAuth: true
    },
    children: [
      {
        path: 'about',
        name: 'AboutICL',
        component: () => import('@/views/home/icl/About.vue'),
        meta: {
          title: 'ICL',
          version: '0.5alpha',
          requireAuth: false,
          measurementId: 'G-HKY4VTTE87'
        }
      },
      {
        path: 'mining',
        name: 'Mining',
        component: () => import('@/views/home/icl/Mining.vue'),
        meta: {
          title: 'ICL',
          version: '0.5alpha',
          requireAuth: true,
          measurementId: 'G-HKY4VTTE87'
        }
      },
      {
        path: 'quests',
        name: 'Quests',
        component: () => import('@/views/home/icl/Quests.vue'),
        meta: {
          title: 'ICL',
          version: '0.5alpha',
          requireAuth: true,
          measurementId: 'G-HKY4VTTE87'
        }
      },
      {
        path: 'tradingMining',
        name: 'TradingMining',
        component: () => import('@/views/home/icl/TradingMining.vue'),
        meta: {
          title: 'ICL',
          version: '0.5alpha',
          requireAuth: true,
          measurementId: 'G-HKY4VTTE87'
        }
      }
    ]
  }
];

export default iclRouter;

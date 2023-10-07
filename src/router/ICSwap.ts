import { RouteConfig } from 'vue-router';
const ICSwapRouter: RouteConfig[] = [
  {
    path: '/ICSwap',
    name: 'ICSwap',
    redirect: '/ICSwap/swap/:tokenFromId?/:tokenToId?',
    component: () => import('@/views/home/ICSwap/Index.vue'),
    meta: {
      title: 'ICSwap',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-FF860VTYKD'
    },
    children: [
      {
        path: '/ICSwap/swap/:tokenFromId?/:tokenToId?',
        name: 'ICSwap',
        component: () => import('@/views/home/ICSwap/Swap.vue'),
        meta: {
          title: 'ICSwap',
          version: '0.5test',
          requireAuth: true,
          measurementId: 'G-FF860VTYKD'
        }
      },
      {
        path: '/ICSwap/liquidity/:tokenFromId?/:tokenToId?',
        name: 'ICSwapLiquidity',
        component: () => import('@/views/home/ICSwap/Liquidity.vue'),
        meta: {
          title: 'ICSwap',
          version: '0.5test',
          requireAuth: true,
          measurementId: 'G-FF860VTYKD'
        }
      },
      {
        path: '/ICSwap/addLiquidity/:tokenFromId?/:tokenToId?',
        name: 'ICSwap',
        component: () => import('@/views/home/ICSwap/Add.vue'),
        meta: {
          title: 'ICSwap',
          version: '0.5test',
          requireAuth: true,
          measurementId: 'G-FF860VTYKD'
        }
      },
      {
        path: '/ICSwap/find',
        name: 'ICSwap',
        component: () => import('@/views/home/ICSwap/Find.vue'),
        meta: {
          title: 'ICSwap',
          version: '0.5test',
          requireAuth: true,
          measurementId: 'G-FF860VTYKD'
        }
      }
    ]
  }
];
export default ICSwapRouter;

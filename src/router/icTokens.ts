import { RouteConfig } from 'vue-router';
const icTokensRouter: RouteConfig[] = [
  {
    path: '/icTokens',
    redirect: '/icTokens/youCreatedToken',
    name: 'icTokens',
    component: () => import('@/views/home/icTokens/Index.vue'),
    meta: {
      title: 'ICTokens',
      version: '0.3alpha',
      requireAuth: true
    },
    children: [
      {
        path: 'youCreatedToken',
        name: 'icTokens',
        component: () => import('@/views/home/icTokens/YouCreatedToken.vue'),
        meta: {
          title: 'icTokens',
          version: '0.3alpha',
          requireAuth: true,
          measurementId: 'G-PDWW6EHZFE'
        }
      },
      {
        path: 'favourites',
        name: 'icTokens',
        component: () => import('@/views/home/icTokens/Favourites.vue'),
        meta: {
          title: 'ICTokens',
          version: '0.3alpha',
          requireAuth: true,
          measurementId: 'G-PDWW6EHZFE'
        }
      },
      {
        path: 'tokenList',
        name: 'icTokens',
        component: () => import('@/views/home/icTokens/TokenList.vue'),
        meta: {
          title: 'ICTokens',
          version: '0.3alpha',
          requireAuth: true,
          measurementId: 'G-PDWW6EHZFE'
        }
      }
    ]
  }
];
export default icTokensRouter;

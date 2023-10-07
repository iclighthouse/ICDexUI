import { RouteConfig } from 'vue-router';
const lighthouseRouter: RouteConfig[] = [
  {
    path: '/lighthouse',
    name: 'Lighthouse',
    component: () => import('@/views/home/lighthouse/Index.vue'),
    meta: {
      title: 'Lighthouse',
      requireAuth: true
    }
  }
];

export default lighthouseRouter;

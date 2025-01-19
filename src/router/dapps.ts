import { RouteConfig } from 'vue-router';
const dappsRouter: RouteConfig[] = [
  {
    path: '/dapps',
    name: 'Dapps',
    component: () => import('@/views/home/dapps/Index.vue'),
    meta: {
      title: 'Dapps',
      requireAuth: true
    }
  }
];
export default dappsRouter;

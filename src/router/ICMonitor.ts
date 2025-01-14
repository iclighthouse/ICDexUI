import { RouteConfig } from 'vue-router';
const ICMonitorRouter: RouteConfig[] = [
  {
    path: '/ICMonitor',
    name: 'ICMonitor',
    component: () => import('@/views/home/ICMonitor/Index.vue'),
    meta: {
      title: 'ICMonitor',
      version: '0.2alpha',
      requireAuth: true
    }
  }
];
export default ICMonitorRouter;

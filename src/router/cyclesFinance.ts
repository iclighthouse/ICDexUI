import { RouteConfig } from 'vue-router';
const cyclesFinanceRouter: RouteConfig[] = [
  {
    path: '/cyclesFinance/:type?',
    name: 'CyclesFinance',
    component: () => import('@/views/home/cyclesFinance/Index.vue'),
    meta: {
      title: 'CyclesFinance',
      version: '0.6beta',
      requireAuth: true,
      measurementId: 'G-SVDF2BHH1N'
    }
  }
];
export default cyclesFinanceRouter;

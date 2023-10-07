import { RouteConfig } from 'vue-router';
const welcomeRouter: RouteConfig[] = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/welcome/Index.vue'),
    meta: {
      title: 'Welcome'
    },
    children: [
      {
        path: 'cyclesFinance',
        name: 'CyclesFinance',
        component: () => import('@/views/welcome/CyclesFinance.vue'),
        meta: {
          title: 'WelcomeCyclesFinance'
        }
      },
      {
        path: 'icTokens',
        name: 'IcTokens',
        component: () => import('@/views/welcome/IcTokens.vue'),
        meta: {
          title: 'WelcomeIcTokens'
        }
      },
      {
        path: 'iCMonitor',
        name: 'ICMonitor',
        component: () => import('@/views/welcome/ICMonitor.vue'),
        meta: {
          title: 'WelcomeICMonitor'
        }
      }
    ]
  }
];

export default welcomeRouter;

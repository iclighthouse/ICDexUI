import { RouteConfig } from 'vue-router';
const neuronRouter: RouteConfig[] = [
  {
    path: '/nns',
    redirect: '/nns/neuron',
    name: 'NNS',
    component: () => import('@/views/home/neurons/Index.vue'),
    meta: {
      title: 'NNS',
      requireAuth: true
    },
    children: [
      {
        path: '/nns/neuron',
        name: 'ICP-neuron',
        component: () => import('@/views/home/neurons/MyNeurons.vue'),
        meta: {
          title: 'neuron',
          requireAuth: true
        }
      },
      {
        path: '/nns/proposals',
        name: 'ICP-proposals',
        component: () => import('@/views/home/neurons/Proposals.vue'),
        meta: {
          title: 'Proposals',
          details: 'proposals',
          requireAuth: true,
          keepAlive: true,
          isBack: false,
          scrollTop: 0
        }
      },
      {
        path: '/nns/proposals/:proposalId',
        name: 'ICP-proposals',
        component: () => import('@/views/home/neurons/Proposal.vue'),
        meta: {
          title: 'Proposals',
          details: 'proposal',
          hideMenu: true,
          requireAuth: true
        }
      }
    ]
  }
];
export default neuronRouter;

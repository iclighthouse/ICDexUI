import { RouteConfig } from 'vue-router';
const ICSNSRouter: RouteConfig[] = [
  {
    path: '/icsns',
    name: 'ICSNS',
    component: () => import('@/views/home/ICSNS/Index.vue'),
    meta: {
      isTrade: true,
      title: 'ICSNS',
      version: '0.5test',
      requireAuth: true,
      measurementId: 'G-PP2WQPT68J'
    },
    children: [
      {
        path: '/icsns',
        name: 'ICSNS-Tokens',
        component: () => import('@/views/home/ICSNS/Tokens.vue'),
        meta: {
          title: 'ICSNS-Tokens',
          version: '0.5alpha',
          requireAuth: true,
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'neurons',
        name: 'ICSNS-Neurons',
        component: () => import('@/views/home/ICSNS/Neurons.vue'),
        meta: {
          title: 'ICSNS-Neurons',
          version: '0.5alpha',
          requireAuth: true,
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'neurons/:tokenId/:neuronId',
        name: 'ICSNS-Neurons',
        component: () => import('@/views/home/ICSNS/Neurons.vue'),
        meta: {
          title: 'ICSNS-Neurons',
          details: 'neuron',
          hideMenu: true,
          version: '0.5alpha',
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'launchpad',
        name: 'ICSNS-Launchpad',
        component: () => import('@/views/home/ICSNS/Launchpad.vue'),
        meta: {
          title: 'ICSNS-Launchpad',
          details: 'launchpad',
          version: '0.5alpha',
          requireAuth: true,
          keepAlive: true,
          isBack: false,
          scrollTop: 0,
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'launchpad/:tokenId',
        name: 'ICSNS-Launchpad',
        component: () => import('@/views/home/ICSNS/LaunchpadProject.vue'),
        meta: {
          title: 'ICSNS-Launchpad',
          details: 'token',
          version: '0.5alpha',
          requireAuth: true,
          hideMenu: true,
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'proposals',
        name: 'ICSNS-Proposals',
        component: () => import('@/views/home/ICSNS/Proposals.vue'),
        meta: {
          title: 'ICSNS-Proposals',
          details: 'proposals',
          version: '0.5alpha',
          scrollTop: 0,
          requireAuth: true,
          keepAlive: true,
          isBack: false,
          measurementId: 'G-PP2WQPT68J'
        }
      },
      {
        path: 'proposals/:tokenId/:proposalId',
        name: 'ICSNS-Proposals',
        component: () => import('@/views/home/ICSNS/Proposal.vue'),
        meta: {
          title: 'ICSNS-Proposals',
          details: 'proposal',
          hideMenu: true,
          requireAuth: true,
          version: '0.5alpha',
          measurementId: 'G-PP2WQPT68J'
        }
      }
    ]
  }
];

export default ICSNSRouter;

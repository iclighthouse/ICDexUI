import Vue, { DirectiveOptions } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Antd, { Spin } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/base.scss';
import '@/styles/style.css';
import '@/styles/common.scss';
import '@/styles/icswap.scss';
import '@/assets/font/font.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import 'mavon-editor/dist/css/index.css';
import VueClipboard from 'vue-clipboard2';
import * as directives from '@/directives';
import * as filters from '@/filters';
import copyAccount from '@/components/common/copyAccount/Index.vue';
import { Loading, Slider } from 'element-ui';
import * as echarts from 'echarts/core';
// import senCssMore from 'sen-css-more';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import { BarChart, LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VueCookies from 'vue-cookies';
import infiniteScroll from 'vue-infinite-scroll';
import { RecycleScroller } from 'vue-virtual-scroller';
import VueMarkdown from 'vue-markdown-v1';
import mavonEditor from 'mavon-editor';
import JsonViewer from 'vue-json-viewer';
import VueTour from 'vue-tour';
import 'vue-tour/dist/vue-tour.css';

Vue.use(VueTour);
Vue.use(JsonViewer);
Vue.use(infiniteScroll);
Vue.use(VueCookies, { expires: '30d', sameSite: 'Strict' });

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  TitleComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);
Spin.setDefaultIndicator({
  indicator: {
    render(createElement) {
      return createElement(
        'div',
        {
          class: 'el-loading-spinner',
          style: {
            left: 0
          }
        },
        [
          createElement(
            'svg',
            {
              attrs: {
                viewBox: '25 25 50 50'
              },
              class: 'circular'
            },
            [
              createElement('circle', {
                class: 'path',
                attrs: {
                  fill: 'none',
                  cx: '50',
                  cy: '50',
                  r: '20'
                }
              })
            ]
          )
        ]
      );
    }
  }
});
Vue.use(Loading.directive);
Vue.use(Slider);
Vue.prototype.$loading = Loading.service;

Vue.use(VueClipboard);
Vue.use(Antd);
// Vue.use(senCssMore);
Vue.use(mavonEditor);
Vue.config.productionTip = false;

// Register global filter functions
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});
// Register global directives
Object.keys(directives).forEach((key) => {
  Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key]);
});

VueMarkdown.props.anchorAttributes.default = () => ({
  target: '_blank',
  rel: 'nofollow noreferrer noopener'
});
VueMarkdown.props.prerender.default = (content: string): string => {
  // substitute "internal" links ({text}(url) with placeholder
  // for slots.
  const regex = /\[(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const to = match[2];
    const text = match[1];
    const replacement = `${text} (${to})`;
    content = content.replace(match[0], replacement);
  }
  return content;
};

Vue.component('VueMarkdown', VueMarkdown);
Vue.component('copyAccount', copyAccount);
Vue.component('RecycleScroller', RecycleScroller);
Vue.prototype.$setLoading = function (props) {
  if (typeof props === 'boolean') props = { spinning: props };
  if (Object.prototype.toString.call(props) !== '[object Object]') props = {};
  this.$app.loadingProps = {
    ...props
  };
};
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  const priList = JSON.parse(localStorage.getItem('priList'));
  if (
    from.path === '/' &&
    to.path === '/login' &&
    priList &&
    store.getters['common/getIdentity']
  ) {
    next('/account');
  } else if (
    from.path === '/' &&
    to.path === '/login' &&
    priList &&
    !store.getters['common/getIdentity']
  ) {
    next({
      path: '/loginByExists'
    });
  } else {
    const icdexpair = localStorage.getItem('icdexpair');
    if (
      to.meta &&
      to.meta.isTrade &&
      to.fullPath.toLocaleLowerCase() === '/icdex' &&
      icdexpair
    ) {
      next({
        path: `/ICDex${icdexpair}`
      });
    } else {
      to.meta.isBack =
        (to.meta.details === 'proposals' && from.meta.details === 'proposal') ||
        (to.meta.details === 'launchpad' && from.meta.details === 'token');
      if (
        from.meta.details === 'proposals' &&
        to.meta.details === 'proposal'
        // (from.meta.details === 'launchpad' && to.meta.details === 'token')
      ) {
        from.meta.scrollTop =
          document.querySelector('.infiniteScroll').scrollTop;
      } else {
        from.meta.scrollTop = 0;
      }
      next();
    }
  }
});
router.afterEach((to) => {
  window.scrollTo(0, 0);
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');

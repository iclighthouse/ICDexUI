import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import common, { State } from './modules/common';

Vue.use(Vuex);
export interface RootState {
  common: State;
}

const store: StoreOptions<RootState> = {
  modules: {
    common
  }
};

export default new Vuex.Store<RootState>(store);

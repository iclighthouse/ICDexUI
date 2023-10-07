declare module '*.vue' {
  import Vue from 'vue';
  declare module 'vue/types/vue' {
    interface Vue {
      $setLoading: any;
      $addGoogleAnalytics: (
        eventAction: string,
        eventCategory: string,
        eventLabel: string,
        eventValue = 1
      ) => {};
    }
  }
  export default Vue;
}

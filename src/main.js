// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
import {currency} from './commom/util/currency.js'
import store from './store/index.js'




import './commom/css/base.css'
import './commom/css/checkout.css'
import './commom/css/login.css'
import './commom/css/product.css'
import './commom/css/iconfont.css'

Vue.prototype.axios = axios

Vue.use(infiniteScroll);
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})



Vue.filter("currency",currency);
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    // this.checkLogin();
    // this.getCartCount();
  },
  methods:{
    checkLogin(){
      axios.get("users/checkLogin").then(res=> {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        }else{
          if(this.$route.path!="/goods"){
            this.$router.push("/goods");
          }
        }
      });
    },
    getCartCount(){
      axios.get("users/getCartCount").then(res=>{
        var res = res.data;
        if(res.status=="0"){
          this.$store.commit("updateCartCount",res.result);
        }
      });
    }
  },
  template: '<App/>',
  //render: h => h(App),
  components: { App }
});//.$mount('#app')

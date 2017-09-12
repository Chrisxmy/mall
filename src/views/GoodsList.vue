<template>
  <div>
    <sxHeader></sxHeader>
    <bread>
      <span>商品</span>
    </bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:;" class="default cur">Default</a>
          <a href="javascript:;" class="price" @click='sortPrice'>Price
            <span class='iconfont icon-xijiantou'></span>
          </a>
          <a href="javascript:;" class="filterby stopPop" @click='showPop'>Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click='closePop'>
                <a href="javascript:;" :class="{'cur':priceChecked === 'all'}" @click="setPriceFilter('all')">All</a>
              </dd>
              <dd v-for='(price,index) in priceFilter' @click='setPriceFilter(index)'>
                <a href="javascript:;" :class="{'cur':priceChecked ===index}" @click='closePop'>{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for='(item, index) in goodList' v-if='goodList && goodList.length > 0'>
                  <div class="pic">
                    <a href="#">
                      <img :src="item.image" alt="">
                    </a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.price | currency}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click='addCart(item.productId)'>加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="5">
                <img src='../commom/loading-spinning-bubbles.svg' v-if='loading'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirm v-show="showDialog" :dialog-option="dialogOption" ref="dialog"></confirm>
    <div class='md-overlay' v-show='overLayFlag' @click='closePop()'></div>
    <sxFooter></sxFooter>
  </div>
</template>
<script>
import sxHeader from '@/components/sxHeader'
import sxFooter from '@/components/sxFooter'
import bread from '@/components/bread'
import Toast from '@/base/toast/toast.js'

import confirm from '@/base/messageBox/confirm.vue'
export default {
  data() {
    return {
      dialogOption: {},
      showDialog: false,
      goodList: [],
      userInfo: {},
      priceFilter: [
        {
          startPrice: 0,
          endPrice: 100
        },
        {
          startPrice: 100,
          endPrice: 200
        },
        {
          startPrice: 200,
          endPrice: 1000
        },
        {
          startPrice: 1000,
          endPrice: 2000
        },
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false,
      sortFlag: true,
      page: 1,
      pageSize: 3,
      busy: true,
      loading: false
    }
  },
  methods: {
    getGoodList(flag) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      this.loading = true
      this.axios.get('/api/goods/list', { params: params }).then((res) => {
        res && (res = res.data)
        if (res.code === 0) {
          this.loading = false
          if (flag) {
            this.goodList = this.goodList.concat(res.data)
            res.data.length === 0 ? (this.busy = true) : (this.busy = false)
          } else {
            this.goodList = res.data
            this.busy = false
          }
        }
        this.loading = false
      }).catch((e) => {
        console.log(e)
        this.loading = false
      })
    },
    sortPrice() {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodList()
    },
    setPriceFilter(index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodList()
    },
    loadMore() {
      this.busy = true
      setTimeout(() => {
        this.page++;
        this.getGoodList(true)
      }, 500)
    },
    showPop() {
      this.filterBy = true;
      this.overLayFlag = true
    },
    closePop() {
      this.filterBy = false;
      this.overLayFlag = false
    },
    addCart(id) {
      this.showDialog = true;
      this.$refs.dialog.confirm().then(() => {
        this.showDialog = false;

        this.axios.post('/api/goods/addCart', {
          productId: id
        }).then(res => {
          res && (res = res.data)
          if (res.code === 0) {
            this.$store.commit('updateCartCount', 1)
          } else {
            this.$store.commit('updateCartCount', 1)

          }
        }).catch(e => {
         Toast(e.response.data.msg)

        })
      }).catch(() => {
         this.showDialog = false;
      })
    }
  },
  created() {
    this.getGoodList();
  },
  components: {
    sxHeader,
    sxFooter,
    bread,
    confirm
  }
}
</script>

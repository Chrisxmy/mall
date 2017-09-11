<template>
  <div>
    <sxHeader></sxHeader>
    <bread>
      <span>
        订单确认
      </span>
    </bread>
    <div class="container">
      <div class="checkout-order">
        <!-- process step -->
        <div class="check-step">
          <ul>
            <li class="cur">
              <span>Confirm</span> address</li>
            <li class="cur">
              <span>View your</span> order</li>
            <li>
              <span>Make</span> payment</li>
            <li>
              <span>Order</span> confirmation</li>
          </ul>
        </div>

        <!-- order list -->
        <div class="page-title-normal checkout-title">
          <h2>
            <span>Order content</span>
          </h2>
        </div>
        <div class="item-list-wrap confirm-item-list-wrap">
          <div class="cart-item order-item">
            <div class="cart-item-head">
              <ul>
                <li>Order contents</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item,index) in orderList" v-if='orderList && orderList.length > 0'>
                <div class="cart-tab-1">
                  <div class="cart-item-pic">
                    <img :src="item.image">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.price | currency}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <span class="select-ipt">x{{item.productNum}}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{item.productNum * item.price | currency}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Price count -->

        <div class="order-foot-wrap">
          <div class="prev-btn-wrap">
            <router-link to='/address' class="btn btn--m">Previous</router-link>
          </div>
          <div class="next-btn-wrap">
            <button class="btn btn--m btn--red" @click='pay'>Proceed to payment</button>
          </div>
        </div>
      </div>
    </div>
    <sxFooter></sxFooter>
  </div>
</template>
<script>
import sxHeader from '../components/sxHeader'
import sxFooter from '../components/sxFooter'
import bread from '../components/bread'
export default {
  data() {
    return {
      cartList: [],
      orderList: [],
      orderPrice : 0
    }
  },
  methods: {
    getCart() {
      this.axios.get('/api/users/checkLogin').then(res => {
        res && (res = res.data)
        if (res.code === 0) {
          this.cartList = res.data.cartList
          this.cartList.forEach(item => {
            if (item.checked === true) {
              this.orderList.push(item)
              this.orderPrice += item.price * item.productNum
            }
          })
        }
      })
    },
    pay() {
      let id = this.$route.query.addressId
      this.axios.post('/api/users/pay', {
        addressId: id,
        orderPrice: this.orderPrice
      }).then(res => {
        res && (res = res.data)
        if (res.code === 0) {
           this.$router.push({
             path: `/orderSuccess?orderId=${res.result.orderId}`
           })
        }
      })
    }
    },
    created() {
      this.getCart()
    },
    components: {
      sxFooter,
      sxHeader,
      bread
    }
  }
</script>

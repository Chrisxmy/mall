<template>
  <header class="header">
    <div class="navbar">
      <div class="navbar-left-container">
        <router-link to='/goods'>
         <span class='iconfont icon-logogou'></span>
        </router-link>
      </div>
      <div class="navbar-right-container" style="display: flex;">
        <div class="navbar-menu-container">
          <span class="navbar-link" v-text="nickName" v-if="nickName"></span>
          <a href="javascript:void(0)" class="navbar-link" @click="loginModalFlag=true" v-if="!nickName">登陆</a>
          <a href="javascript:void(0)" class="navbar-link" @click="logOut" v-else>登出</a>
          <div class="navbar-cart-container">
            <span class="navbar-cart-count" v-text="cartCount" v-if="cartCount"></span>
            <router-link :to="{name: 'Cart'}" class="navbar-link navbar-cart-link">
              <span class='iconfont icon-qicheqianlian'></span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':loginModalFlag}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="loginModalFlag=false">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <div class="error-wrap">
              <span class="error error-show" v-show="errorTip">用户名或者密码错误</span>
            </div>
            <ul>
              <li class="regi_form_input">
                <i class="icon IconPeople"></i>
                <input type="text" tabindex="1" name="loginname" v-model="userName" class="regi_login_input regi_login_input_left" placeholder="User Name" data-type="loginname">
              </li>
              <li class="regi_form_input noMargin">
                <i class="icon IconPwd"></i>
                <input type="password" tabindex="2" name="password" v-model="userPwd" class="regi_login_input regi_login_input_left login-input-no input_text" placeholder="Password" @keyup.enter="login">
              </li>
            </ul>
          </div>
          <div class="login-wrap">
            <a href="javascript:;" class="btn-login" @click="login">登 录</a>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="loginModalFlag" @click="loginModalFlag=false"></div>
  </header>
</template>
<script>
export default {
  data() {
    return {
      userName: 'shel', 
      userPwd: '123',
      errorTip: false,
      loginModalFlag: false
    }
  },
  created() {
     this.checkLogin();
  },
  computed: {
    nickName() {
      return this.$store.state.nickName
    },
    cartCount() {
      return this.$store.state.cartCount
    }
  },
  methods: {
    checkLogin() {
      this.axios.get("/api/users/checkLogin").then((res) => {
        res && (res = res.data)
        var path = this.$route.pathname;
        if (res.code === 0) {
          this.loginModalFlag = false;
          this.$store.commit('updateUserInfo',res.data.userName)
          this.getCartCount(res.data.cartList)
          
        } else {
          if (this.$route.path != "/goods") {
            this.$router.push("/goods");
          }
        }
      });
    },
    getCartCount(cartList) {
      let cartCount = 0
        cartList.forEach(item => {
           cartCount +=item.productNum
        });

        this.$store.commit('initCartCount',cartCount)
    },
    login() {
      if (!this.userName || !this.userPwd) {
        this.errorTip = true;
        return;
      }
      this.axios.post("/api/users/login", {
        userName: this.userName,
        userPwd: this.userPwd
      }).then((res) => {
        res && (res = res.data);
        if (res.code === 0) {
          this.errorTip = false;
          this.checkLogin()
          this.loginModalFlag = false;
        } else {
          this.errorTip = true;
        }
      });
    },
    logOut() {
      this.axios.post("/api/users/logout").then((res) => {
           res && (res = res.data)
        if (res.code === 0) {
              this.$store.commit('updateUserInfo','')
              this.$store.commit('initCartCount',0)
        }
      })
    }
  }
}
</script>

<style lang='scss'>
.header {
  width: 100%;
  background-color: white;
  font-family: "moderat", sans-serif;
  font-size: 16px;
  border-top:1px solid red;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: 70px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 5px 20px 10px 20px;
}

.navbar-left-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span{
    margin-left:20px;
  }
}

.navbar-brand-logo {
  /*width: 120px;*/
}

.header a,
.footer a {
  color: #666;
  text-decoration: none;
}

a {
  -webkit-transition: color .3s ease-out;
  transition: color .3s ease-out;
}

.navbar-right-container {
  display: none;
  justify-content: flex-start;
  align-items: center;
}

.navbar-menu-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
}

.navbar-link {
  padding-left: 15px;
}

.navbar-cart-container {
  position: relative;
}

.navbar-cart-count {
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -9px;
  right: -11px;
  width: 20px;
  border-radius: 10px;
  color: white;
  background-color: #eb767d;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
}

.navbar-cart-logo {
  width: 25px;
  height: 25px;
  transform: scaleX(-1);
}
</style>

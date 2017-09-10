const express = require("express");
const router = express.Router();
const users = require("../models/users");



router.post("/login", (req, res, next) => {
  (async () => {
    let params = {
      userName: req.body.userName,
      userPwd: req.body.userPwd
    };
    let user = await users.login(params)
    res.cookie('userId',user.userId ,{
        path: '/',
        maxAge: 1000*60*60,
        httpOnly: true
    })
    return {
        code: 0,
        user: user
    }
  })()
   .then(r => {
      res.json(r)
   })
   .catch(e =>{
       next(e)
   })
});

router.post("/logout", (req, res, next) => {
    res.cookie('userId','',{
        path: '/',
        maxAge: -1
    })
    res.json({
        code: 0,
        msg: 'request success'
    })
});

router.get("/checkLogin", (req, res, next) => {
    (async ()=> {
    if (req.cookies.userId) {
        let userInfo = await users.findUsers(req.cookies.userId)
        return {
            code: 0,
            data: userInfo
        }
    } else {
        res.json({
            code: -1,
            msg: '未登陆'
        })
    }
})()
   .then(r => {
       res.json(r)
  })
   
});

router.post("/cart/del", (req, res, next) => {
    (async ()=> {
    if (req.cookies.userId) {
        let userId = req.cookies.userId;
        let productId = req.body.productId;
        let userInfo = await users.updateCart(userId,productId)
        return {
            code: 0,
            data: userInfo
        }
    } else {
        res.json({
            code: -1,
            msg: '未登陆'
        })
    }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});

router.post("/editCart", (req, res, next) => {
    (async ()=> {
        let userId = req.cookies.userId,
        productId = req.body.productId, 
        productNum = req.body.productNum,
        checked = req.body.checked;
        let userInfo = await users.editCart(userId,productId,productNum,checked)
        return {
            code: 0,
            data: userInfo
        }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});


router.post("/editCheckAll", (req, res, next) => {
    (async ()=> {
        let userId = req.cookies.userId,checkAll = req.body.checkAll;
        let userInfo = await users.findUsers(userId)
        userInfo._doc.cartList.forEach(item => {
            item.checked = checkAll
        });
        userInfo.save()
        return {
            code: 0,
            data: userInfo.cartList
        }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});



router.get("/addressList", (req, res, next) => {
    (async ()=> {
        let userId = req.cookies.userId,checkAll = req.body.checkAll;
        let userInfo = await users.findUsers(userId)
        return {
            code: 0,
            data: userInfo.addressList
        }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});


router.post("/setDefault", (req, res, next) => {
    (async ()=> {
        let userId = req.cookies.userId, addressId = req.body.addressId
        let userInfo = await users.findUsers(userId)
        userInfo._doc.addressList.forEach(item => {
          if(item.street === addressId) {
              item.default = true
          } else {
              item.default = false
          }
        })
        userInfo.save().catch(e => { throw new Error('server wrong')})
        return {
            code: 0,
            msg: 'setDefault success'
        }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});

router.post("/delAddress", (req, res, next) => {
    (async ()=> {
        let userId = req.cookies.userId, addressId = req.body.addressId
        await users.delAddress(userId,addressId)
        return {
            code: 0,
            msg: 'delete success'
        }
})()
   .then(r => {
       res.json(r)
  })
  .catch(e => {
      next(e)
  }) 
});




module.exports = router;

const express = require("express");
const router = express.Router();
const goods = require("../models/goods");
const users = require("../models//users");

router.get("/list", (req, res, next) => {
  (async () => {
    let priceLevel = req.query.priceLevel;
    let priceGt = "",
      priceLte = "";
    switch (priceLevel) {
      case "0":
        priceGt = 0;
        priceLte = 100;
        break;
      case "1":
        priceGt = 100;
        priceLte = 200;
        break;
      case "2":
        priceGt = 200;
        priceLte = 1000;
        break;
      case "3":
        priceGt = 1000;
        priceLte = 2000;
        break;
      case "all":
        priceGt = 0;
        priceLte = Infinity;
        break;
    }
    let params = {
      sort: parseInt(req.query.sort),
      page: parseInt(req.query.page),
      pageSize: parseInt(req.query.pageSize),
      priceGt: priceGt,
      priceLte: priceLte
    };
    let goodList = await goods.findProduct(params);
    return {
      code: 0,
      data: goodList
    };
  })()
    .then(r => {
      res.json(r);
    })
    .catch(e => {
      next(e);
    });
});

router.post("/addCart", (req, res, next) => {
  (async () => {
    let userId = "12222",
      productId = req.body.productId;
    let user = await users.findUsers(userId);
    let goodItem = "";
    user.cartList.forEach(item => {
      console.log(item);
      if (item.productId === productId) {
        goodItem = item;
        item.productNum++;
        user.save()
      }
    });
    if (goodItem) {
      user.save();
    } else {
      let product = await goods.findOneProduct(productId);
      product._doc.productNum = 1;
      product._doc.checked = true;
      user.cartList.push(product);
      user.save();
      return {
        code: 0,
        user: user
      };
    }
  })()
    .then(r => {
      res.json(r);
    })
    .catch(e => {
      next(e);
    });
});

module.exports = router;

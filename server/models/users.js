const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  userId: { type: String },
  userName: String,
  userPwd: String,
  avatar: String,
  orderList: Array,
  cartList: [
    {
      productId: String,
      productName: String,
      price: Number,
      image: String,
      checked: Boolean,
      productNum: Number
    }
  ],
  addressList: [
    {
      userName: {type:String},
      tel: {type:Number},
      street: {type:String},
      default: Boolean
    }
  ]
});

const usersModel = mongoose.model("users", usersSchema);

const DEFAULT_PROJECTION = { userPwd: 0 };

async function login(params) {
  let user = await usersModel
    .findOne(params)
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e);
      throw new Error("something goes wrong");
    });
  if (!user) throw new Error("wrong");
  return user;
}

async function findUsers(id) {
  return await usersModel
    .findOne({ userId: id })
    .select(DEFAULT_PROJECTION)
    .catch(e => {
      console.log(e);
      throw new Error("something goes wrong");
    });
}

async function updateCart(userId, productId) {
  let flow = usersModel.update(
      { userId: userId },
      { $pull: { cartList: { productId: productId } } }
    )
    flow.select(DEFAULT_PROJECTION)
   return flow.catch(e => {
    console.log(e);
    throw new Error("something goes wrong");
  });
}

async function editCart(userId, productId,productNum,checked) {
  let flow = usersModel.update(
      { userId: userId ,'cartList.productId': productId },{
        'cartList.$.productNum':productNum,
        'cartList.$.checked':checked
      } 
    )
    flow.select(DEFAULT_PROJECTION)
   return flow.catch(e => {
    console.log(e);
    throw new Error("something goes wrong");
  });
}



async function delAddress(userId,addressId) {
  let flow = usersModel.update(
      { userId: userId },{
        $pull:{addressList:{street:addressId} }
      } 
    )
   return flow.catch(e => {
    console.log(e);
    throw new Error("something goes wrong");
  });
}




module.exports = {
  model: usersModel,
  findUsers,
  login,
  updateCart,
  editCart,
  delAddress
};

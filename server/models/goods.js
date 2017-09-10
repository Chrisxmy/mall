const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  productId: { type: String },
  productName: String,
  price: Number,
  image: String
});

const productModel = mongoose.model("product", productSchema);

async function findProduct(params) {
    let flow = productModel.find({"price":{$gt:params.priceGt,$lte: params.priceLte}})
    .skip((params.page-1) * params.pageSize)
    .limit(params.pageSize)
    flow.sort({'price': params.sort})  
  return await flow.exec().catch(e => {
    console.log(e);
    throw new Error("something goes wrong");
  });
}

async function findOneProduct(id) {
  return await productModel.findOne({productId: id}).catch(e => {
    throw new Error("something goes wrong");
  });
}

module.exports = {
  model: productModel,
  findProduct,
  findOneProduct
};

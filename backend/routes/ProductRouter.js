var express = require("express");
var router = express.Router();
const { validateAdmin, validateUser } = require("../validator/UsersValidator");
const productsControllerMySQL = require("../controller/ProductsControllerMySQL");
const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     cb(null, "./public/productImages/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date().toISOString() + "-" + file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
// });



//For the DyamoDB database -- Start Here
//Test Ok
router.get("/get", productsControllerMySQL.getAllProducts);
router.post("/create", productsControllerMySQL.createProduct);
router.get("/get/:productid", productsControllerMySQL.getProductById);
router.put("/update/:productid", productsControllerMySQL.editProductById);
// router.delete("/delete/:productid", productsControllerMySQL.deleteProductController);
//Un-Test
//For the DyamoDB database -- End Here

module.exports = router;

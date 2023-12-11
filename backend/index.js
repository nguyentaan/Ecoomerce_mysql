const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require('path');
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/UsersRouter");
const productRouter = require("./routes/ProductRouter");
const orderRouter = require("./routes/OrderRouter");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));
app.use("/public/productImages", express.static("public"));


//For the DyamoDB database -- Start Here
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

const port = 8081;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});




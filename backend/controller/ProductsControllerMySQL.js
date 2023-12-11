const productsModelMySQL = require("../models/ProductModelMySQL");
const db = require("../config/db");
require("dotenv").config();

module.exports = {
  createProduct: (req, res) => {
    console.log(req.body.image);

    const objWithoutImage = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      productType: req.body.productType,
    };

    const obj = {
      image: req.file && req.file.path,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      productType: req.body.productType,
    };

    const producyData = obj.image === undefined ? objWithoutImage : obj;

    const insertQuery = "INSERT INTO products SET ?";

    db.query(insertQuery, producyData, (error, result) => {
      if (error) {
        return res.status(400).json(error);
      }

      return res.json({
        status: "success",
        message: "Successfully create product!",
        data: result,
      });
    });
  },

  getAllProducts: async (req, res) => {
    try {
      const sql = "SELECT * FROM products";
      db.query(sql, (err, result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully get all products!",
          data: result,
        });
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  getProductById: async (req, res) => {
    try {
      const productID = req.params.productID;
      const sql = "SELECT * FROM products WHERE productID = ?";
      const value = [productID];
      db.query(sql, value, (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        const productData = results[0];

        return res.json({
          status: "success",
          data: productData,
        });
      });
    } catch {
    res.status(400).json({ error: "Bad Request" });
    }
  },

  editProductById: async (req, res) => {
    try {
      const productId = req.params.productID; // Update variable name to 'productId'

      const sql = "SELECT * FROM products WHERE productID = ?"; // Update placeholder to '?'

      db.query(sql, [productId], (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        const existingProductData = results[0];

        // Update the product data with the new values or keep the existing values if not provided
        const updateQuery = `
        UPDATE products
        SET
          image = ?,
          name = ?,
          price = ?,
          description = ?,
          quantity = ?,
          productType = ?
        WHERE
          productID = ?
      `;

        db.query(
          updateQuery,
          [
            req.file?.path || existingProductData.image,
            req.body.name || existingProductData.name,
            req.body.price || existingProductData.price,
            req.body.description || existingProductData.description,
            req.body.quantity || existingProductData.quantity,
            req.body.productType || existingProductData.productType,
            productId,
          ],
          (updateError, updateResult) => {
            if (updateError) {
              return res.status(400).json(updateError);
            }

            const updatedProductQuery =
              "SELECT * FROM products WHERE productID = ?";

            db.query(
              updatedProductQuery,
              [productId],
              (selectError, selectResults) => {
                if (selectError) {
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                const updatedProductData = selectResults[0];

                return res.json({
                  message: `The data of product ${productId} has been successfully edited.`,
                  data: updatedProductData,
                });
              }
            );
          }
        );
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },
};

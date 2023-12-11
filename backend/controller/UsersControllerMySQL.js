const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validator/RegisterValidator");
const db = require("../config/db");
require("dotenv").config();

module.exports = {
  register: async (req, res) => {
    try {
      const { username, email, phoneNumber, password } = req.body;
      const obj = { username, email, phoneNumber, password };

      //validation register
      const { errors, isValid } = validateRegisterInput(obj);

      if (!isValid) {
        return res.status(errors.status).json(errors);
      }

      const checkEmailQuery = "SELECT * FROM users WHERE email = ?";
      db.query(checkEmailQuery, [obj.email], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            error: "Internal server error",
          });
        }

        if (result.length > 0) {
          return res.status(401).json({
            status: "error",
            error: `Username "${email}" already exists!`,
          });
        }
      });

      const checkUserQuery = "SELECT * FROM users WHERE username = ?";
      db.query(checkUserQuery, [obj.username], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            error: "Internal server error",
          });
        }

        if (result.length > 0) {
          return res.status(401).json({
            status: "error",
            error: `Username "${username}" already exists!`,
          });
        }
      });

      const insertUserQuery = "INSERT INTO users SET ?";
      db.query(insertUserQuery, obj, (err, result) => {
        if (err) {
          return res.status(400).json(err);
        }
        res.json({
          status: "success",
          message: "Successfully created account!",
          data: result,
        });
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const sql = "SELECT * FROM users WHERE email = ?";
      db.query(sql, [email, password], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            error: "Internal server error",
          });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ status: "failed", error: "Email not found" });
        }

        const user = result[0];
        if (password === user.password) {
          const payload = {
            userID: user.userID,
            email: user.email,
            username: user.username,
          };

          jwt.sign(
            payload,
            process.env.PRIVATE_KEY,
            { expiresIn: 3155 },
            (err, token) => {
              res.json({
                status: "success",
                token: token,
              });
            }
          );
        } else {
          return res.status(404).json({
            status: "failed",
            error: "Password incorrect",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "failed", error: "Internal Server Error" });
    }
  },

  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const sql = "SELECT * FROM users WHERE email = ?";
      db.query(sql, [email, password], (err, result) => {
        const user = result[0];
        if (!user || user.emai !== "admin@gmail.com") {
          return res
            .status(404)
            .json({ status: "failed", error: "Admin's email not found" });
        }

        if (user.password === "123") {
          const payload = {
            userID: user.userID,
            email: user.email,
            username: user.username,
          };

          jwt.sign(
            payload,
            process.env.PRIVATE_KEY,
            { expiresIn: 3155 },
            (err, token) => {
              res.json({
                status: "success",
                message: "You're an admin!",
                token: token,
              });
            }
          );
        } else {
          return res.status(404).json({
            status: "failed",
            error: "Password incorrect",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ status: "failed", error: "Internal Server Error" });
    }
  },

  //get all users
  getAllUsers: async (req, res) => {
    try {
      const sql = "SELECT * FROM users";
      db.query(sql, (err, result) => {
        res.status(200).json({
          status: "success",
          message: "Successfully get all users!",
          data: result,
        });
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //Get user by ID
  getUserId: async (req, res) => {
    try {
      const userID = req.paramas.userID;
      const sql = "SELECT * FROM users WHERE userID = ?";
      const value = [userID];
      db.query(sql, value, (err, result) => {
        res.json({
          status: "success",
          message: `Successfully get data id of ${userID} !`,
          data: result,
        });
      });
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //Delete user by ID
  deleteById: async (req, res) => {
    try {
      const userID = req.paramas.userID;
      const sql = "DELETE FROM users WHERE userID =?";
      const value = [userID];
      db.query(sql, value, (err, result) => {
        res.json({
          status: "success",
          message: `Successfully delete id of ${userID} !`,
        });
      });
    } catch (err) {
      res.status(400).json(error);
    }
  },
};

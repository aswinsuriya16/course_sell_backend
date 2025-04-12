require("dotenv").config()

const JWT_USER = process.env.JWT_USER;
const JWT_ADMIN = process.env.JWT_ADMIN;
const MONGO_URL = process.env.MONGO_URL;

module.exports = {
    JWT_ADMIN,JWT_USER,MONGO_URL
}
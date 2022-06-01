import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const TOKEN_NAME = process.env.TOKEN_NAME;
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

export default {
  PORT,
  TOKEN_NAME,
  TOKEN_SECRET,
  CLIENT_URL,
};

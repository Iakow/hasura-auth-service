import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (email, id) => {
  const nameSpace = "https://hasura.io/jwt/claims";
  const payload = {
    email,
    id,
    [nameSpace]: {
      "x-hasura-allowed-roles": ["editor", "user", "mod"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": id,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: +process.env.JWT_EXP || '1h',
  });
};

const getAll = async () => {
  try {
    const users = await User.findAll();
    return users.map((item) => item.dataValues);
  } catch (err) {
    console.error(err);
  }
};

const addOne = async ({ email, password, id }) => {
  try {
    const user = await User.create({ email, password, id });
    return user;
  } catch (err) {
    console.error(err);
  }
};

const findByEmail = async (email) => {
  try {
    const result = await User.findAll({ where: { email } });
    return result[0];
  } catch (err) {
    console.error("user.service.findUserByEmail: ", err);
  }
};

const findById = async (id) => {
  try {
    const result = await User.findAll({ where: { id: id } });
    return result[0];
  } catch (err) {
    console.error("user.cervice.findUserById: ", err);
  }
};

export default {
  generateAccessToken,
  getAll,
  addOne,
  findByEmail,
  findById,
};

import { user } from "../models/index.js";
import bcrypt from "bcryptjs";

const encryptPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const validatePassword = (pass1, pass2) => {
  return bcrypt.compareSync(pass1, pass2);
};

const addOne = async ({ email, password, id }) => {
  return await user.create({ email, password, id });
};

const findByEmail = async (email) => {
  const [result] = await user.findAll({ where: { email } });
  return result;
};

const findById = async (id) => {
  const [result] = await user.findAll({ where: { id: id } });
  return result;
};

export default {
  addOne,
  findByEmail,
  findById,
  encryptPassword,
  validatePassword,
};

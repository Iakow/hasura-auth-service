import { v4 as uuidv4 } from "uuid";
import { refreshToken } from "../models/index.js";
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
    expiresIn: +process.env.JWT_EXP || "1h",
  });
};

const generateExpTime = () => {
  let expiredAt = new Date();
  expiredAt.setSeconds(
    expiredAt.getSeconds() + process.env.REFRESH_TOKEN_EXP || 60
  );

  return expiredAt.getTime();
};

const createRefreshToken = async function (userId) {
  const [existingToken] = await refreshToken.findAll({ where: { userId } });
  if (existingToken) existingToken.destroy();

  let refreshTokenRecord = await refreshToken.create({
    token: uuidv4(),
    userId,
    expiryDate: generateExpTime(),
  });

  return refreshTokenRecord.token;
};

const verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

const getRefreshToken = async (token) => {
  let [result] = await refreshToken.findAll({ where: { token } });
  return result;
};

export default {
  createRefreshToken,
  verifyExpiration,
  getRefreshToken,
  generateAccessToken,
};

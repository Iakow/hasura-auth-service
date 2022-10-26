import { Sequelize } from "sequelize";
import User from "./User.js";
import RefreshToken from "./RefreshToken.js";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const user = new User(sequelize);
const refreshToken = new RefreshToken(sequelize);

refreshToken.belongsTo(user, {
  foreignKey: {name: "userId", allowNull: false},
  targetKey: "id",
});

user.hasOne(refreshToken, {
  foreignKey: "userId",
  targetKey: "id",
});

export { user, refreshToken };

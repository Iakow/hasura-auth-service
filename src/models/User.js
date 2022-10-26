import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define(
    "User",
    {
      password: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      id: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: process.env.USERS_TABLE_NAME,
    }
  );
}

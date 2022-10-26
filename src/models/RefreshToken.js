import { DataTypes } from "sequelize";

export default function (sequelize) {
  return sequelize.define(
    "refreshToken",
    {
      token: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
    },
    {
      timestamps: false,
      tableName: process.env.REFRESH_TOKEN_TABLE_NAME,
    }
  );
}

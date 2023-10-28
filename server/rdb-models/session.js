import { Sequelize } from "sequelize";
export default (sequelize) => {
  sequelize.define("Session", {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    access_token: Sequelize.STRING,
    athleteId: {
      type: Sequelize.STRING,
      references: {
        model: "Athletes",
        key: "id",
      },
      onDelete: "set null",
    },
  });
};

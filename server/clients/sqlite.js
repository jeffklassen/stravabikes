import Activity from "../rdb-models/activity.js";
import Athlete from "../rdb-models/athlete.js";
import { Sequelize } from "sequelize";

let sequelize;

const initDB = (sequelize) => {
  const modelDefiners = [Athlete, Activity];
  modelDefiners.forEach((model) => model(sequelize));

  // Relationships(sequelize);
};

(async () => {
  try {
    sequelize = new Sequelize("sqlite::memory:");
    initDB(sequelize);
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (error) {
    console.error(
      "There was an error connecting to the database!",
      error.message,
      error
    );
  }
})();

export default sequelize;

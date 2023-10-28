import { Sequelize } from "sequelize";
export default (sequelize) => {
  sequelize.define("Activity", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    username: Sequelize.STRING,
    resource_state: Sequelize.INTEGER,
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    bio: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    sex: Sequelize.STRING,
    premium: Sequelize.BOOLEAN,
    summit: Sequelize.BOOLEAN,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
    badge_type_id: Sequelize.INTEGER,
    weight: Sequelize.FLOAT,
    profile_medium: Sequelize.STRING,
    profile: Sequelize.STRING,
    friend: Sequelize.BOOLEAN,
    follower: Sequelize.BOOLEAN,
  });
};

export default (sequelize) => {
  const { Athlete, Activity, Session } = sequelize.models;

  Athlete.hasMany(Activity);
  Activity.belongsTo(Athlete);

  Athlete.hasOne(Session);
  Session.belongsTo(Athlete);
};

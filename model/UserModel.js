import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../config/sequelize.js';
import LookUpValue from './lookUpValueModel.js';

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true
    },
    authtype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
  },
  {
    sequelize, // The database connection instance
    modelName: 'User', // The name of the model
    tableName: 'user', // The name of the table in MySQL
    timestamps: true, // Whether to add timestamps (createdAt, updatedAt)
  }
);
User.belongsTo(LookUpValue, {
  foreignKey: 'gender'
});

export const checkOrCreateUser = async (data) => {
  const [user] = await User.findOrCreate({ where: data.condition, defaults: data.defaults });
  return user;
};
export const updateUser = async (data, id, transaction) => {
  const [user] = await User.update(data, { where: {id}, transaction });
  return user
}
export const getUser = async (condition) => { 
  const user = await User.findOne({ where: condition });
  return user
}
export const getUserForSwipe = async ({ userId, dobStart, dobEnd, maxDistance, maxLat, minLat, maxLng, minLng, limit, offset}) => {
  const rows = await sequelize.query(
    `
    WITH latest_locations AS (
      SELECT user_id, latitude, longitude,
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS rn
      FROM UserLocation
    ),
    match_locations AS (
      SELECT * FROM latest_locations WHERE rn = 1 AND user_id != :userId
    ),
    current_user_location AS (
      SELECT * FROM latest_locations WHERE rn = 1 AND user_id = :userId
    )
    SELECT 
      u.*,
      COUNT(DISTINCT cuin.interest_id) AS shared_interest_count,
      (111.111 * DEGREES(ACOS(LEAST(1.0,
        COS(RADIANS(cul.latitude)) * COS(RADIANS(ml.latitude)) *
        COS(RADIANS(cul.longitude - ml.longitude)) +
        SIN(RADIANS(cul.latitude)) * SIN(RADIANS(ml.latitude))
      )))) AS distance_km
    FROM user u
    JOIN match_locations ml ON ml.user_id = u.id
    JOIN current_user_location cul ON cul.user_id = :userId
  
    INNER JOIN UserLookingFor ulf ON ulf.user_id = u.id
    INNER JOIN UserLookingFor currentUserLookingFor ON currentUserLookingFor.user_id = :userId
    INNER JOIN user currentUser ON currentUser.id = :userId
  
    LEFT JOIN UserInterest un ON un.user_id = u.id
    LEFT JOIN UserInterest cuin ON cuin.user_id = :userId AND cuin.interest_id = un.interest_id
  
    WHERE 
      u.gender = currentUserLookingFor.gender
      AND u.dob BETWEEN :dobStart AND :dobEnd
      AND currentUser.gender = ulf.gender
      AND currentUser.dob BETWEEN :otherDobStart AND :otherDobEnd
  
      AND ml.latitude BETWEEN :minLat AND :maxLat
      AND ml.longitude BETWEEN :minLng AND :maxLng
  
      AND NOT EXISTS (
        SELECT 1 FROM Match m2
        WHERE 
          (
            (m2.initiator = :userId AND m2.responder = u.id)
            OR (m2.responder = :userId AND m2.initiator = u.id)
          )
          AND (
            m2.status = 'matched'
            OR (m2.status = 'pending' AND m2.initiator = :userId)
          )
      )
  
      AND (111.111 * DEGREES(ACOS(LEAST(1.0,
        COS(RADIANS(cul.latitude)) * COS(RADIANS(ml.latitude)) *
        COS(RADIANS(cul.longitude - ml.longitude)) +
        SIN(RADIANS(cul.latitude)) * SIN(RADIANS(ml.latitude))
      )))) <= :maxDistance
  
    GROUP BY u.id, ml.latitude, ml.longitude, cul.latitude, cul.longitude
    ORDER BY shared_interest_count DESC, distance_km ASC
    LIMIT :limit OFFSET :offset
    `,
    {
      replacements: {
        userId,
        dobStart,
        dobEnd,
        maxDistance,
        minLat,
        maxLat,
        minLng,
        maxLng,
        limit,
        offset
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );  
  return rows;
}
export default User
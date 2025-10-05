import { Sequelize } from "sequelize";
import { Event, LookUpValue, EventDate } from "./eventMapping.js";
import { sequelize } from "../config/sequelize.js";

export const getEventById = async (id) => await Event.findByPk(id);
export const getEventByCondition = async (condition) =>
  await Event.findOne({
    where: condition,
    include: [{ model: EventDate, attributes: ["date"], as: "eventDates" }],
    attributes: [
      "id",
      "title",
      "description",
      "latitude",
      "longitude",
      "category",
      "image_url",
      [Sequelize.col("eventDates.date"), "dateTime"],
      [Sequelize.col("eventDates.id"), "dateid"],
    ],
  });
export const addEvent = async (data, transaction) =>
  await Event.create(data, { transaction });
export const updateEvent = async (data, id, transaction) =>
  await Event.update(data, { where: { id: id }, transaction });

export const addEventDate = async (data, transaction) =>
  await EventDate.create(data, { transaction });
export const updateEventDate = async (data, id, transaction) =>
  await EventDate.update(data, { where: { id }, transaction });

export const getEvent = async (latitude, longitude, userId, limit, offset) => {
  const userCondition = "u.id <> :userId";
  const rows = await sequelize.query(
    `
      SELECT 
        e.id as id,
        lv.name as interest,
        e.title as postText,
        ui.image_url as profileImage,
        u.name as username,
        e.description as description,
        (6371 * acos(
          cos(radians(:latitude)) * cos(radians(CAST(e.latitude AS DECIMAL(10,6)))) * 
          cos(radians(CAST(e.longitude AS DECIMAL(10,6))) - radians(:longitude)) + 
          sin(radians(:latitude)) * sin(radians(CAST(e.latitude AS DECIMAL(10,6))))
        )) AS distance,
        e.image_url as image_url
      FROM Event e
      INNER JOIN EventDate ed ON ed.eventId = e.id
      INNER JOIN lookUpValue lv ON lv.id = e.category
      INNER JOIN user u ON u.id = e.userId
      INNER JOIN UserImage ui ON ui.user_id = u.id
      WHERE 
        e.active = true
        AND ed.active = true
        AND ed.date >= CURDATE()
        AND ui.image_type='main'
        AND ${userCondition}
      HAVING distance<=5
      ORDER BY ed.date ASC
      `,
    {
      replacements: { latitude, longitude, limit, offset, userId },
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return rows;
};

export const getEventByUserId = async (condition) =>
  await Event.findAll({
    where: condition,
    include: [
      { model: LookUpValue, attributes: ["name"], as: "categoryInfo" },
      { model: EventDate, attributes: ["date"], as: "eventDates" },
    ],
    attributes: [
      "id",
      [Sequelize.col("title"), "postText"], // 👈 alias title → PosTitle
      "description",
      "image_url",
      [Sequelize.col("categoryInfo.name"), "interest"], // alias from joined model
      [Sequelize.col("eventDates.date"), "dateTime"],
    ],
  });

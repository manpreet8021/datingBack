import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { imageUpload } from "../config/imageUpload.js";
import {
  addEvent,
  updateEvent,
  getEventByCondition,
  updateEventDate,
} from "../model/eventService.js";
import { checkIfMatchExist, insertMatch } from "../model/userMatchModel.js";
import {
  checkIfEventMatchExist,
  insertEventMatch,
} from "../model/eventMatchModel.js";
import { sequelize } from "../config/sequelize.js";
import {
  addEventDate,
  getEvent,
  getEventByUserId,
} from "../model/eventService.js";

const addEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dateTime: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "string.pattern.base": "dateTime must be in YYYY-MM-DD format",
      "any.invalid": "dateTime is not a valid date",
    }),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.number().integer().required(),
});

const updateEventSchema = Joi.object({
  id: Joi.number().integer().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  dateTime: Joi.string().required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  category: Joi.number().integer().required(),
});

const getEventParameter = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  limit: Joi.number().integer(),
  offset: Joi.number().integer(),
});

const getEvents = asyncHandler(async (req, res) => {
  const user = req.user.id;
  const { error } = getEventParameter.validate(req.query, {
    abortEarly: false,
  });
  if (error) {
    res.status(400);
    throw new Error(error.message);
  }
  const { latitude, longitude, limit = 10, offset = 0 } = req.query;
  const events = await getEvent(latitude, longitude, user, limit, offset);
  const response = {
    events,
  };
  res.status(200).json(response);
});

const insertEventDetail = asyncHandler(async (req, res) => {
  const { error } = addEventSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { title, description, dateTime, latitude, longitude, category } =
    req.body;
  const transaction = await sequelize.transaction();

  let eventPayload = {
    title,
    description,
    latitude,
    longitude,
    category,
    userId: req.user.id,
  };
  if (req.file) {
    const imageInfo = await imageUpload(
      req.file.path,
      "event",
      req.user.id,
      "thumbnail"
    );
    eventPayload = {
      ...eventPayload,
      image_id: imageInfo.image_id,
      image_url: imageInfo.image_url,
      public_id: imageInfo.public_id,
    };
  } else {
    res.status(400);
    throw new Error("Thumbnail not found");
  }
  try {
    const EventInserted = await addEvent(eventPayload, transaction);
    const event_id = EventInserted.dataValues.id;
    const eventDateId = await addEventDate(
      { date: dateTime, eventId: event_id },
      transaction
    );
    if (eventDateId) {
      await transaction.commit();
      const insertedEventDetail = await getEventByUserId({
        id: event_id,
        userId: req.user.id,
      });
      res.status(201).json(insertedEventDetail);
    } else {
      res.status(400);
      throw new Error("Event creation failed");
    }
  } catch (error) {
    await transaction.rollback();
    res.status(400);
    throw new Error("Event creation failed");
  }
});

const updateEventDetail = asyncHandler(async (req, res) => {
  const { error } = updateEventSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { title, description, dateTime, latitude, longitude, category, id } =
    req.body;

  const event = await getEventByCondition({ id: id, userId: req.user.id });

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }
  let updateObject = {
    title,
    description,
    latitude,
    longitude,
    category
  };
  if (req.file) {
    const imageInfo = await imageUpload(
      req.file.path,
      "event",
      req.user.id,
      "thumbnail"
    );
    updateObject = {
      ...updateObject,
      image_id: imageInfo.image_id,
      image_url: imageInfo.image_url,
      public_id: imageInfo.public_id,
    };
  }
  const transaction = await sequelize.transaction();
  const [EventUpdated] = await updateEvent(updateObject, id, transaction);
  if (!EventUpdated) {
    res.status(400);
    throw new Error("Event update failed");
  }

  if (event.dataValues.dateTime !== dateTime) {
    await updateEventDate({ date: dateTime }, event.dataValues.dateid, transaction);
  }
  await transaction.commit();
  const updatedEvent = await getEventByUserId({ id: id, userId: req.user.id });
  res.status(200).json(updatedEvent);
});

const getEventByIdController = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const event = await getEventByCondition({ id: eventId, userId: req.user.id });
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(400);
    throw new Error("Event not found");
  }
});

const getLoggedInUserEvent = asyncHandler(async (req, res) => {
  const response = await getEventByUserId({userId: req.user.id});
  res.status(200).json(response);
});

export {
  getEvents,
  insertEventDetail,
  updateEventDetail,
  getEventByIdController,
  getLoggedInUserEvent,
};

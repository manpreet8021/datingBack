import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { imageUpload } from "../config/imageUpload.js";
import { addEvent, updateEvent, getEventByCondition, getEventById } from "../model/eventModel.js";
import { checkIfMatchExist, insertMatch } from "../model/matchModel.js";
import { checkIfEventMatchExist, insertEventMatch } from "../model/eventMatchModel.js";
import { sequelize } from "../config/sequelize.js";
import { addEventDate } from "../model/eventDateModel.js";

const addEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dateTime: Joi.string().required(),
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

const getEvents = asyncHandler((req, res) => {
  
})

const insertEventDetail = asyncHandler(async (req, res) => {
  const { error } = addEventSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { title, description, dateTime, latitude, longitude, category } = req.body;
  const transaction = await sequelize.transaction();

  const EventInserted = await addEvent({ title, description, latitude, longitude, category, userId: req.user.id}, transaction);
  const event_id = EventInserted.dataValues.id
  const eventDateId = await addEventDate({date: dateTime,eventId: event_id}, transaction)
  if (eventDateId) {
    await transaction.commit();
    res.status(201).json();
  } else {
    await transaction.rollback();
    res.status(400);
    throw new Error("Event creation failed");
  }
})

const updateEventDetail = asyncHandler(async (req, res) => {
  const { error } = updateEventSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { title, description, dateTime, latitude, longitude, category, id } = req.body;

  const event = await getEventByCondition({id: id, userId: req.user.id})
  if(event) {
    const imagesInfo = await imageUpload(req.files.image, 'event', req.user.id, 'thumbnail')

    const EventInserted = await updateEvent({ title, description, dateTime, latitude, longitude, category, image_id: imagesInfo.image_id, image_url: imagesInfo.image_url, public_id: imagesInfo.public_id}, id);

    if (EventInserted) {
      res.status(201).json();
    } else {
      res.status(400);
      throw new Error("Event update failed");
    }
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

const likeEvent = asyncHandler(async(req, res) => {
  const {eventid} = req.query;
  const event = await getEventById(eventid)
  let match = null
  if(event) {
    const matchExist = await checkIfMatchExist(event.userId, req.user.id)
    if(matchExist) {
      match = matchExist
    } else {
      match = await insertMatch({initiator: req.user.id, responder: event.userId})
    }
    const eventMatch = await insertEventMatch({event_id: eventid, match_id: match.id})
    res.status(201).json()
  } else {
    res.status(404)
    throw new Error("Event not found")
  }
})

export { getEvents, insertEventDetail, updateEventDetail, likeEvent }
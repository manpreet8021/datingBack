import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { imageUpload } from "../config/imageUpload.js";
import { addEvent } from "../model/eventModel.js";

const addEventSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  dateTime: Joi.string().required(),
  latitude: Joi.string().required(),
  longitude: Joi.string().required(),
  category: Joi.number().integer().required(),
});

const getEvents = asyncHandler((req, res) => {

})

const insertEvent = asyncHandler(async (req, res) => {
  const { error } = addEventSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { title, description, dateTime, latitude, longitude, category } = req.body;
  const imagesInfo = await imageUpload(req.files.image, 'event', req.user.id, 'thumbnail')

  const EventInserted = await addEvent({ title, description, dateTime, latitude, longitude, category, userId: req.user.id, image_id: imagesInfo.image_id, image_url: imagesInfo.image_url, public_id: imagesInfo.public_id});

  if (EventInserted) {
    res.status(201).json();
  } else {
    res.status(400);
    throw new Error("Event creation failed");
  }
})

export { getEvents, insertEvent }
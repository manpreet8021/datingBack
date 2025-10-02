import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getUserPreferenceByCondition } from "../model/userPreferenceModel.js";

const validateUserPreferenceSchema = Joi.object({
  dobStart: Joi.number().min(18).max(100).required(),
  dobEnd: Joi.number().min(Joi.ref('dobStart')).max(100).required(),
  recentlyActive: Joi.boolean().required(),
})

const getUserPreference = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const preferences = await getUserPreferenceByCondition({ userId }); // Corrected function usage
  if (!preferences) {
    return res.status(404).json({ message: 'Preferences not found' });
  }

  const { dobStart, dobEnd, distanceInKm } = preferences.dataValues;

  res.status(200).json({ dobStart, dobEnd, distanceInKm });
});

const insertUserPreference = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {error} = validateUserPreferenceSchema.validate(req.body, {abortEarly: false});

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const preferences = await getUserPreferenceByCondition({ userId });
  
  if (preferences) {
    await preferences.update(data, { transaction });
    return preferences;
  } else {
    const newPref = ({ ...data, userId }, { transaction });
    return newPref;
  }

  const { dobStart, dobEnd, distanceInKm } = preferences.dataValues;

  res.status(200).json({ dobStart, dobEnd, distanceInKm });
});

export { getUserPreference }
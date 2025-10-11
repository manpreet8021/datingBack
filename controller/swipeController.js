import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getUserForSwipe } from "../model/UserModel.js";
import { getLatestLocation } from "../model/userLocationModel.js";

const addMatchSchema = Joi.object({
  eventId: Joi.number().required()
})

const getNearbyUserForSwipe = asyncHandler(async (req, res) => {
  const user = req.user.id
  console.log("inside hehre")
  const limit = 20
  const offset = 0

  const earthRadius = 6371; // km
  const maxDistance = 50; // km

  const currentUserLocation = await getLatestLocation(user)

  const lat = currentUserLocation.dataValues.latitude;
  const lng = currentUserLocation.dataValues.longitude;

  const maxLat = lat + (maxDistance / earthRadius) * (180 / Math.PI);
  const minLat = lat - (maxDistance / earthRadius) * (180 / Math.PI);
  const maxLng = lng + (maxDistance / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  const minLng = lng - (maxDistance / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  console.log(user)
  const resposne = await getUserForSwipe({ userId: user, dobStart: 20, dobEnd: 30, maxDistance: 100, maxLat, minLat, maxLng, minLng, limit, offset})
  console.log(resposne)
  res.status(200).json(resposne)
})

export { getNearbyUserForSwipe }
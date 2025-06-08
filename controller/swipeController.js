import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getUserForSwipe } from "../model/UserModel.js";
import { getLatestLocation } from "../model/userLocationModel.js";

const addMatchSchema = Joi.object({
  eventId: Joi.number().required()
})

const getNearbyUserForSwipe = asyncHandler(async (req, res) => {
  const user = req.user.id
  const limit = 20
  const offset = 0

  const earthRadius = 6371; // km
  const maxDistance = 50; // km

  const currentUserLocation = await getLatestLocation(user.id)

  const lat = currentUserLocation.dataValues.latitude;
  const lng = currentUserLocation.dataValues.longitude;

  const maxLat = lat + (maxDistance / earthRadius) * (180 / Math.PI);
  const minLat = lat - (maxDistance / earthRadius) * (180 / Math.PI);
  const maxLng = lng + (maxDistance / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  const minLng = lng - (maxDistance / earthRadius) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
  console.log("here")
  // const resposne = await getUserForSwipe({ userId: user.id, dobStart: user.dobStart, dobEnd: user.dobEnd, maxDistance: 5, maxLat, minLat, maxLng, minLng, limit, offset})

  res.status(200).json([])
})

export { getNearbyUserForSwipe }
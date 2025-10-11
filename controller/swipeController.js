import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getUserForSwipe } from "../model/UserModel.js";
import { getLatestLocation } from "../model/userLocationModel.js";
import ngeohash from 'ngeohash';

const addMatchSchema = Joi.object({
  eventId: Joi.number().required()
})

const getNearbyUserForSwipe = asyncHandler(async (req, res) => {
  const user = req.user.id
  const limit = 20
  const offset = 0


  const currentUserLocation = await getLatestLocation(user)

  const lat = currentUserLocation.dataValues.latitude;
  const lng = currentUserLocation.dataValues.longitude;

  const precision = 6;
  const centerHash = ngeohash.encode(lat, lng, precision);
  const neighbors = ngeohash.neighbors(centerHash);
  const nearbyHashes = [centerHash, ...neighbors];
  
  const resposne = await getUserForSwipe({ userId: user, dobStart: '1990-01-01', dobEnd: '2010-01-01', maxDistance: 100, maxLat, minLat, maxLng, minLng, limit, offset, otherDobStart: '1990-01-01', otherDobEnd: '2010-01-01'})

  console.log(resposne)
  res.status(200).json(resposne)
})

export { getNearbyUserForSwipe }
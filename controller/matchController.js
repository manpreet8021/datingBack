import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getEventById } from "../model/eventModel.js";
import { checkIfMatchExist, insertMatch } from "../model/matchModel.js";
import { insertEventMatch } from "../model/eventMatchModel.js";

const addMatchSchema = Joi.object({
	event_id: Joi.number().required()
})

const matchUserForEvent = asyncHandler(async (req, res) => {
  const user = req.user.id
	const {error} = addMatchSchema.validate({event_id})
  
	if(error) {
		res.status(400)
		throw new Error("Event id is required")
	}
	
	const {event_id} = req.body
	
	const event = await getEventById(event_id)
	if (event) {
		const alreadyMatch = await checkIfMatchExist(user, event.user_id)
		if (alreadyMatch) {
			if (alreadyMatch.dataValues.status === "matched") {
				return res.status(200).json("Already a match");
			}
			if (alreadyMatch.dataValues.responder === user) {
				await alreadyMatch.update({
					responded_at: new Date(),
					status: "matched"
				});
				await insertEventMatch({event_id: event.dataValues.userId, match_id: alreadyMatch.dataValues.id})
			}
		} else {
			const data = {initiator: user,responder: event.dataValues.userId}
			const match = await insertMatch(data)
			const eventMatch = await insertEventMatch({event_id: event.dataValues.id, match_id: match.dataValues.id})
			res.status(201).json()
		}
	} else {
		res.status(404)
		throw new Error("Event not found")
	}
})

export { matchUserForEvent }
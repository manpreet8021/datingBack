import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getEventById } from "../model/eventService.js";
import { checkIfMatchExist, insertMatch } from "../model/userMatchModel.js";
import { insertEventMatch } from "../model/eventMatchModel.js";

const addMatchSchema = Joi.object({
	eventId: Joi.number().required()
})

const matchUserForEvent = asyncHandler(async (req, res) => {
	const user = req.user.id
	const { error } = addMatchSchema.validate({
		eventId: req.body.eventId
	})

	if (error) {
		res.status(400)
		throw new Error("Event id is required")
	}

	const { eventId } = req.body

	const event = await getEventById(eventId)

	if (event) {
		const alreadyMatch = await checkIfMatchExist(user, event.dataValues.userId)
		
		if (alreadyMatch) {
			if (alreadyMatch.dataValues.status === "matched") {
				return res.status(200).json("Already a match");
			}
			if (alreadyMatch.dataValues.responder === user) {
				await alreadyMatch.update({
					responded_at: new Date(),
					status: "matched"
				});
				await insertEventMatch({ event_id: event.dataValues.id, match_id: alreadyMatch.dataValues.id })
			}
		} else {
			const data = { initiator: user, responder: event.dataValues.userId }
			const match = await insertMatch(data)
			const eventMatch = await insertEventMatch({ event_id: event.dataValues.id, match_id: match.dataValues.id })
			res.status(201).json()
		}
	} else {
		res.status(404)
		throw new Error("Event not found")
	}
})

export { matchUserForEvent }
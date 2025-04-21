import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { getLookUpValueUsingData } from '../model/lookUpValueModel.js'

const addlookUpDataSchema = Joi.object({
  name: Joi.string().required(),
  active: Joi.boolean().required(),
});

const addlookUpValueSchema = Joi.object({
  name: Joi.string().required(),
  parent: Joi.string().required(),
  icon: Joi.string(),
  active: Joi.boolean().required(),
});

const addLookUpData = asyncHandler(async (req, res) => {
  const { error } = addlookUpDataSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { name, active } = req.body;
  const lookUpData = await saveLookUpData({ name, active });

  if (lookUpData) {
    res.status(201).json(lookUpData);
  } else {
    res.status(400);
    throw new Error("LookUp validation failed");
  }
});

const addLookUpValue = asyncHandler(async (req, res) => {
  const { error } = addlookUpValueSchema.validate(req.body, {
    abortEarly: true,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { name, active, parent, icon } = req.body;
  const lookUpValue = await saveLookUpValue({ name, parent, active, icon });

  if (lookUpValue) {
    res.status(201).json(lookUpValue);
  } else {
    res.status(400);
    throw new Error("LookUp validation failed");
  }
});

const getLookUpValues = asyncHandler(async (req, res) => {
  const {data} = req.params

  const orderby = data.toLowerCase() === 'gender' ? 'priority' : 'name'

  const values = await getLookUpValueUsingData({name: data.toLowerCase(), orderby: orderby}) 

  res.status(200).json(values)
})

export {
  addLookUpData,
  addLookUpValue,
  getLookUpValues
};

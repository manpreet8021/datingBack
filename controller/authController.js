import Joi from "joi";
import asyncHandler from "../middleware/asyncHandler.js";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import {updateOtpActive, insertOtp} from "../model/otpLogModel.js";
import twilio from 'twilio'
import { checkOrCreateUser } from "../model/userModel.js";
import { generateToken } from "../config/jwtTojen.js";

const validatePhoneNumber = (phone, countryCode) => {
  const phoneNumber = parsePhoneNumberFromString(phone, countryCode);
  return phoneNumber ? {number: phoneNumber.isValid() && phoneNumber.number, valid: phoneNumber.isValid()} : {number: null, valid: false};
};

const sendOtpValidationSchema = Joi.object({
  phone: Joi.string().required(),
  countryCode: Joi.string().required(),
})

const validateOtpSchema = Joi.object({
  phone: Joi.string().required(),
  otp: Joi.string().length(4).pattern(/^[0-9]+$/).required(),
})

const validateGoogleLoginSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  token: Joi.string().required(),
})

const sendOtp = asyncHandler(async (req, res) => {
  const { error } = sendOtpValidationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { phone, countryCode } = req.body;
  const validate = validatePhoneNumber(phone, countryCode)
  if(!validate.valid) {
    res.status(400)
    throw new Error('Invalid phone number')
  }
  const updated = await updateOtpActive({active: false}, {number: phone})

  const otp = Math.floor(1000 + Math.random() * 9000);
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  const response = await client.messages.create({
    body: `Your OTP is ${otp}. Please donot share with anyone.`,
    to: validate.number,
    from: process.env.TWILIO_NUMBER,
  })

  const inserted = await insertOtp({number: phone, otp: otp, active: true, response: response?.sid})

  res.status(200).json({ message: "OTP sent successfully" });
});

const validateOtp = asyncHandler(async (req, res) => {
  const { error } = validateOtpSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { phone, otp } = req.body;

  const [updatedCount] = await updateOtpActive({active: false}, {number: phone, otp: otp})

  if (updatedCount === 0) {
    res.status(400);
    throw new Error("OTP verification failed, please try again.");
  }

  const data = {
    condition: {
      mobile: phone,
      active: 1
    },
    defaults: {
      mobile: phone,
      authtype: 'mobile'
    }
  }

  const user = await checkOrCreateUser(data)

  const response = {
    isNewData: user.isNewRecord,
    name: user.name,
    token: generateToken(user.id)
  }

  res.status(200).json(response);
});

const updateUserDetail = asyncHandler(async (req, res) => {

})

const googleLogin = asyncHandler(async (req, res) => {
  const {error} = validateGoogleLoginSchema.validate(req.body, {abortEarly:false})

  if (error) {
    res.status(400);
    throw new Error(error.message);
  }

  const { token, name, email } = req.body;

  const data = {
    condition: {
      email,
      token,
      active: 1
    },
    defaults: {
      token,
      email,
      name,
      authtype: 'google'
    }
  }

  const user = await checkOrCreateUser(data)

  const response = {
    isNewData: user.isNewRecord,
    name: user.name,
    token: generateToken(user.id)
  }

  res.status(200).json(response);
})

export {
  sendOtp,
  validateOtp,
  googleLogin
};

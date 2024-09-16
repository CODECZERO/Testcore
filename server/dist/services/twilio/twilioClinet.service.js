import twilio from "twilio";
const AccountSid = process.env.TWILIO_ACCOUNT_SID;
const AuthToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN;
const clinet = twilio(AccountSid, AuthToken);
export { clinet };

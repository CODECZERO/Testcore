import twilio from "twilio";

const AccountSid = process.env.TWILIO_ACCOUNT_SID as string;
const AuthToken = process.env.TWILIO_ACCOUNT_AUTHTOKEN as string;

const clinet = twilio(AccountSid, AuthToken);

export {clinet}
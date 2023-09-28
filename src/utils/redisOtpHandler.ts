import redis from "../config/redisConfig";

interface IUserData {
  firstName?: string | undefined;
  lastName?: string | undefined;
  password?: string | undefined;
  newUser: boolean;
}

export const redisSetOTP = async (
  generatedOTP: string,
  phoneNumber: string,
  userData: IUserData
) => {
  const response = await redis.hmset(phoneNumber, {
    otp: generatedOTP,
    firstName: userData.firstName,
    lastName: userData.lastName,
    password: userData.password,
    newUser: userData.newUser,
    verified: false,
  }); // Returns a promise which resolves to "OK" when the command succeeds.
  return response;
};

export const redisVerifyUser = async (phoneNumber: string) => {
  const response = await redis.hmset(phoneNumber, {
    verified: true
  }); // Returns a promise which resolves to "OK" when the command succeeds.
  return response;
};

export const redisDelete = async (phoneNumber: string) => {
  let redisResponse = await redis.del(phoneNumber);
  return redisResponse;
};

export const redisGetOTP = async (phoneNumber) => {
  // ioredis supports the node.js callback style
  const keyList = [
    "firstName",
    "lastName",
    "password",
    "otp",
    "verified",
    "newUser",
  ];
  const response = await redis.hmget(phoneNumber, ...keyList);
  const result: {
    firstName: string;
    lastName: string;
    password: string;
    otp: string;
    verified: boolean|string;
    newUser: boolean|string;
  } = {
    firstName: "",
    lastName: "",
    password: "",
    otp: "",
    verified: false,
    newUser: false,
  };
  for (let index = 0; index < keyList.length; index++) {
    result[keyList[index]] = response[index];
  }
  return result;
};

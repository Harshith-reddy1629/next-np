import HTTP_STATUS from "@/constants/HTTP_STATUS.json";

import User from "@/models/user_schema";

import bcrypt from "bcrypt";

export const validateInputs = async (body: {
  username?: string;
  name?: string;
  email?: string;
  password: string;
}) => {
  const { name, username, email, password } = body;

  let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const errors: {
    username?: string;
    name?: string;
    email?: string;
    password?: string;
  } = {};

  if (!username) {
    errors.username = "Please enter the username";
  }
  if (!name) {
    errors.name = "Please enter the name";
  }
  if (!email) {
    errors.email = "Please enter the email";
  }
  if (!password) {
    errors.password = "Please enter the password";
  } else if (password.length < 8) {
    errors.password = "Password should have atleast 8 Characters";
  } else if (password.length > 16) {
    errors.password = "Password should have below 16 Characters";
  }

  if (Object.keys(errors).length > 0) {
    status = HTTP_STATUS.BAD_REQUEST;
    throw { ...errors, status };
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    return { ...body, password: hashedPassword };
  }
};

export const checkUserAndEmail = async (username: string, email: string) => {
  try {
    const errors: {
      username?: string;
      email?: string;
    } = {};

    let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      status = HTTP_STATUS.BAD_REQUEST;

      if (existingUser?.username === username) {
        errors.username = "User already exists with this username";
      }

      if (existingUser?.email === email) {
        errors.email = "User already exists with this email";
      }

      throw { ...errors, status };
    }
    return true;
  } catch (error: any) {
    throw { ...error, error: error.message };
  }
};

import mongoConnection from "@/dbConfig/DbConnection";

import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user_schema";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import HTTP_STATUS from "@/constants/HTTP_STATUS.json";

const validateInputs = async (body: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  let status = HTTP_STATUS.BAD_REQUEST;

  if (!body.email) {
    errors.email = "please enter your mail";
  }

  if (!body.password) {
    errors.password = "please enter your password";
  }

  if (Object.keys(errors).length > 0) {
    throw { ...errors, status };
  } else {
    return body;
  }
};

const validateUser = async (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};

  let status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const { isVerified, username, _id, name } = user;
        if (isVerified) {
          const payload = { username, email, _id, name, isVerified };
          const token = jwt.sign(payload, process.env.MY_SECRET_TOKEN!);
          return token;
        } else {
          errors.email = "Email isn't Verified";

          status = HTTP_STATUS.FORBIDDEN;

          throw errors;
        }
      } else {
        errors.password = "Password incorrect";

        status = HTTP_STATUS.BAD_REQUEST;

        throw errors;
      }
    } else {
      errors.email = "Invalid Email";

      status = HTTP_STATUS.NOT_FOUND;

      throw errors;
    }
  } catch (error: any) {
    throw { ...error, error: error.message, status };
  }
};

export async function POST(request: NextRequest) {
  try {
    await mongoConnection();

    const body = await request.json();

    await validateInputs(body);

    const token = await validateUser(body.email, body.password);

    return NextResponse.json({ token }, { status: HTTP_STATUS.OK });
  } catch (error: any) {
    const { status, ...err } = error;

    return NextResponse.json(
      { error: error.message, ...err },
      { status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

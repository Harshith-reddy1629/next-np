import mongoConnection from "@/dbConfig/DbConnection";

import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user_schema";

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

mongoConnection();

const validateInputs = async (body: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  if (!body.email) {
    errors.email = "please enter your mail";
  }

  if (!body.password) {
    errors.password = "please enter your password";
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  } else {
    return body;
  }
};

const validateUser = async (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};

  let status: number = 400;

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
          status = 403;
          throw new Error();
        }
      } else {
        errors.password = "Password incorrect";
        status = 400;
        throw new Error();
      }
    } else {
      errors.email = "Invalid Email";
      status = 404;
      throw new Error();
    }
  } catch (error: any) {
    throw new Error(
      JSON.stringify({ error: error.message, ...errors, status })
    );
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    try {
      await validateInputs(body);

      const token = await validateUser(body.email, body.password);

      return NextResponse.json({ token }, { status: 200 });
    } catch (error: any) {
      const { status, ...err } = JSON.parse(error.message);

      return NextResponse.json({ ...err }, { status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

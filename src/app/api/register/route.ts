import HTTP_STATUS from "@/constants/HTTP_STATUS.json";

import mongoConnection from "@/dbConfig/DbConnection";

import { NextRequest, NextResponse } from "next/server";

import User from "@/models/user_schema";

import sendMail from "@/utils/mailer";

import { checkUserAndEmail, validateInputs } from "./_helpers";

export async function POST(request: NextRequest) {
  try {
    await mongoConnection();

    let body = await request.json();

    body = await validateInputs(body);

    await checkUserAndEmail(body?.username, body?.email);

    const createUser = await User.create(body);

    await sendMail(createUser._doc, "Verify");

    return NextResponse.json({ ...createUser }, { status: HTTP_STATUS.OK });
  } catch (error: any) {
    const { status, ...err } = error;
    return NextResponse.json(
      { error: error.message, ...err },
      { status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

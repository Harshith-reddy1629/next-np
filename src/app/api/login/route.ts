import mongoConnection from "@/dbConfig/DbConnection";

import { NextRequest, NextResponse } from "next/server";

import HTTP_STATUS from "@/constants/HTTP_STATUS.json";

import { validateInputs, validateUser } from "./_helpers";

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

import HTTP_STATUS from "@/constants/HTTP_STATUS.json";

import tokenValidator from "@/utils/tokenValidator";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const verifiedUser = await tokenValidator(request);

    return NextResponse.json(verifiedUser, { status: HTTP_STATUS.OK });
  } catch (error: any) {
    const { status, ...err } = error;

    return NextResponse.json(
      { error: error.message, ...err },
      { status: status || HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

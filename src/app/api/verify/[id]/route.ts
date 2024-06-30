import HTTP_STATUS from "@/constants/HTTP_STATUS.json";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import User from "@/models/user_schema";
import { error } from "console";
import mongoConnection from "@/dbConfig/DbConnection";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: "string" } }
) {
  try {
    const { id } = params;
    await mongoConnection();
    const findIdAndVerify = await User.findOneAndUpdate(
      { verificationId: id, isVerified: false },
      {
        isVerified: true,
        verificationId: v4(),
      },
      {
        new: true,
      }
    );

    if (findIdAndVerify) {
      return NextResponse.json(findIdAndVerify, { status: HTTP_STATUS.OK });
    }

    return NextResponse.json(
      { error: "Invalid Request" },
      { status: HTTP_STATUS.BAD_REQUEST }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
    );
  }
}

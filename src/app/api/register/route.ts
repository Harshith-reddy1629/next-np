import mongoConnection from "@/DbConfig/DbConnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user_schema";
mongoConnection();

const validateInputs = async (body: any) => {
  const { name, username, email, password } = body;

  const errors: {
    username?: String;
    name?: String;
    email?: String;
    password?: String;
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
  }

  if (Object.keys(errors).length > 0) {
    throw new Error(JSON.stringify(errors));
  } else {
    return body;
  }
};

const checkUserAndEmail = async (username: String, email: String) => {
  const errors = {};

  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  console.log(existingUser);
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    try {
      await validateInputs(body);
    } catch (error: any) {
      return NextResponse.json(
        { ...JSON.parse(error.message) },
        { status: 400 }
      );
    }
    return NextResponse.json({ ...body });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

import mongoConnection from "@/dbConfig/DbConnection";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user_schema";
import bcrypt from "bcrypt";

mongoConnection();

const validateInputs = async (body: {
  username?: string;
  name?: string;
  email?: string;
  password: string;
}) => {
  const { name, username, email, password } = body;

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
    throw new Error(JSON.stringify(errors));
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    return { ...body, password: hashedPassword };
  }
};

const checkUserAndEmail = async (username: string, email: string) => {
  const errors: {
    username?: string;
    email?: string;
  } = {};
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (existingUser?.username === username) {
      errors.username = "User already exists with this username";
    }
    if (existingUser?.email === email) {
      errors.email = "User already exists with this email";
    }

    throw new Error(JSON.stringify(errors));
  }
  return true;
};

export async function POST(request: NextRequest) {
  try {
    let body = await request.json();

    try {
      body = await validateInputs(body);
      await checkUserAndEmail(body?.username, body?.email);
    } catch (error: any) {
      return NextResponse.json(
        { ...JSON.parse(error.message) },
        { status: 400 }
      );
    }

    const createUser = await User.create(body);

    return NextResponse.json({ ...createUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 501 });
  }
}

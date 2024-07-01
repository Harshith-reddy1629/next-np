import mongoose from "mongoose";

import { v4 } from "uuid";

const usersSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please add the Name"],
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add the email address"],
    },
    isVerified: {
      default: false,
      type: Boolean,
      required: true,
    },
    verificationId: {
      type: String,
      default: v4,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Please add the username"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please add the password"],
    },
    passChangeAllowed: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);
export default mongoose.models.npusers ||
  mongoose.model("npusers", usersSchema);

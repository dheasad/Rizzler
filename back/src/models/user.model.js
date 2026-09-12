import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../config/app.config.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const isValidObjectId = (value) =>
  mongoose.Types.ObjectId.isValid(value) &&
  String(new mongoose.Types.ObjectId(value)) === String(value);

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: function (v) {
          // Iranian mobile: starts with 09 followed by 9 digits (11 total)
          return /^09\d{9}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid phone number! Phone number must start with 09 and be 11 digits.`,
      },
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        config.passLen.min,
        `Password must be at least ${config.passLen.min} characters`,
      ],
      maxlength: [
        config.passLen.max,
        `Password cannot exceed ${config.passLen.max} characters (bcrypt limit)`,
      ],
      select: false,
      validate: {
        validator: function (value) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/.test(
            value
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      description:
        "Indicates if the user account is active and allowed to access the system. When false, the user is effectively suspended/deactivated.",
    },

    lastLogin: { type: Date, default: Date.now },

    isVerified: {
      type: Boolean,
      default: false,
      description:
        "Indicates if the user has verified their email address or phone number. Users must verify their account before accessing certain features. Set to true after successful verification.",
    },

    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, config.bcrypt.saltRounds);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    throw new AppError(500, "Password is not available for comparison", false);
  }
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateAccessToken = function () {
  try {
    return jwt.sign({ userId: this._id }, config.jwt.key, {
      expiresIn: config.jwt.expiresIn,
    });
  } catch (error) {
    throw new AppError(500, "Failed to generate access token", false);
  }
};

UserSchema.methods.generateRefreshToken = function () {
  try {
    return jwt.sign({ userId: this._id }, config.jwtRefresh.key, {
      expiresIn: config.jwtRefresh.expiresIn,
    });
  } catch (error) {
    throw new AppError(500, "Failed to generate refresh token", false);
  }
};

UserSchema.statics.existingUser = async function (
  identifier,
  { includePassword = false } = {}
) {
  const or = [{ email: identifier }, { phone: identifier }];

  if (isValidObjectId(identifier)) {
    or.push({ _id: identifier });
  }

  const query = this.findOne({ $or: or });
  if (includePassword) {
    query.select("+password");
  }

  return query;
};

export default mongoose.model("User", UserSchema);

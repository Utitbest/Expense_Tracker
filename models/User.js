import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.provider;
        },
        minlength: [6, "Password must be at least 6 characters"],
        select: false,    
    },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials",
    },
     providerId: {
      type: String,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    }
}, {timestamps: true})

export default mongoose.models.User || mongoose.model("User", UserSchema);
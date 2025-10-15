import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'bot'],
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
    title: { type: String, required: true },
    messages: [messageSchema]
});

const authUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    chatHistory: [chatSchema]
}, { timestamps: true });

// Hash password before saving
authUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare entered password with the hashed password
authUserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const AuthUser = mongoose.model("AuthUser", authUserSchema);

export default AuthUser;
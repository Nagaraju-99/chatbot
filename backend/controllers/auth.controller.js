import AuthUser from "../models/auth.user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await AuthUser.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "An account with this email already exists" });
        }

        const newUser = new AuthUser({ email, password });
        await newUser.save();

        res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await AuthUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
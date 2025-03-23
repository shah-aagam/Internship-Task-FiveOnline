import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};


export const register = async (req, res) => {
    const { name , email , password , age } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            age,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (user && isValidPassword) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to update this user" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.age = req.body.age || user.age;
        
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const alreadyExists = await User.findOne({ email: req.body.email })
        if( alreadyExists ){
            return res.status(400).json({ message: "Email entered already exists" });
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            age: updateUser.age,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.user._id.toString() !== user._id.toString()) {
            return res.status(401).json({ message: "Not authorized to delete this user" });
        }

        await user.deleteOne();
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

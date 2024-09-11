import User from "../models/authmodels.js";
import bcrypt, { compare } from 'bcrypt';
import JWT from 'jsonwebtoken';

export const comparePassword = async(password,hashedPassword)=>{
    return bcrypt.compare(password,hashedPassword);
}
export const registerControllers = async (req, res) => {
    try {
        const { name, email, password, securityAnswer } = req.body; // Include securityAnswer
        
        if (!name) {
            return res.send("Name is required");
        }
        if (!email) {
            return res.send("Email is required");
        }
        if (!password) {
            return res.send("Password is required");
        }
        if (!securityAnswer) { // Check for securityAnswer
            return res.send("Security Answer is required");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newRegister = await new User({
            name,
            email,
            password: hashedPassword,
            securityAnswer // Save securityAnswer
        }).save();

        return res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            newRegister,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error,
        });
    }
};

export const loginControllers = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email not found"
            });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            });
        }

        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.status(200).send({
            success: true,
            message: "User logged in successfully",
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error 
        });
    }
}

export const updateControllers = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        let updateData = { email }; 

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } 
        );

        res.status(200).json({ message: "User updated successfully.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user.", error: error.message });
    }
};

export const forgetpasswordcontrollers = async (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log the request body for debugging

        const { email, newpassword, answer } = req.body;

        // Validate inputs
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required!" });
        }
        if (!newpassword) {
            return res.status(400).json({ success: false, message: "New password is required!" });
        }
        if (!answer) {
            return res.status(400).json({ success: false, message: "Answer is required!" });
        }

        // Find the user by email and answer
        const user = await User.findOne({ email, securityAnswer: answer });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or answer",
            });
        }

        // Hash the new password and update the user's password
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Send success response
        res.status(200).json({
            success: true,
            message: "Password Reset Successfully",
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message || error,
        });
    }
};

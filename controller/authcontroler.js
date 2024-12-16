import User from "../schema/userschema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sendEmail from "../email/email.js";
import jwt from "jsonwebtoken";
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Enter All the filed" });
    }

    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Passwrod must be contain Atleast 6 characters",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email: email,
      password: hashPassword,
      role: role,
    });

    await user.save();

    // const user = await User.create({})  another method for creating

    //started jwt part

    const token = jwt.sign(
      { userid: user._id, role: user.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "5d",
      }
    );

    res.cookie("jwt-aevco", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User Created Successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User Not exist.Creat new Account",
      });
    }

    //checking the password
    const ismatch = await bcrypt.compare(password, user.password);
    if (!ismatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    //creat a jwt token

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "5d",
      }
    );

    await res.cookie("jwt-aevco", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Logged in Successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    console.log("Error occured", error.message);
    res.status(500).json({ message: "server error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt-aevco");
  res.json({ message: "Logged out Successfully" });
};

export const getcurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.log("error occured", error.message);
    res.status(500).json({ message: "server error" });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Provide a valid email" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Enter a valid Email Id" });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol || "http"}://${req.get(
      "host"
    )}/api/v1/auth/resetpassword/${resetToken}`;

    const message = `Forgot your password? Reset it using this link: ${resetURL}\nIf you didn't forget your password, please ignore this email.`;

    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message: message,
    });

    res.status(200).json({
      message: "Token sent to email",
      resetToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Enter a valid email" });
    }

    const isAvailableuser = await User.findOne({ email });
    if (!isAvailableuser) {
      return res.status(404).json({ message: "Email is not valid" });
    }

    const isMatch = await bcrypt.compare(password, isAvailableuser.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Not a valid User" });
    }

    isAvailableuser.password = newPassword;
    await isAvailableuser.save();

    const token = jwt.sign(
      {
        userId: isAvailableuser._id,
        role: isAvailableuser.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "5d" }
    );

    res.cookie("jwt-aevco", token, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000, // Corrected maxAge to seconds
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      status: "Password successfully updated",
      token,
    });
  } catch (error) {
    console.error("Error in resetPassword:", error); // Log the error
    return res.status(500).json({ message: "Internal server error" });
  }
};

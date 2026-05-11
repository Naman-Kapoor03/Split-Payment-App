const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
      });

    const token =
      generateToken(user._id);

    res.status(201).json({
      success: true,
      message:
        "User created successfully",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const isPasswordMatched =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(user._id);

    res.status(200).json({
      success: true,
      message:
        "Login successful",
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        upiId: user.upiId,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

const updateUpiId =
  async (req, res) => {
    try {
      const { upiId } =
        req.body;

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            upiId,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "UPI ID updated successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  signup,
  login,
  updateUpiId,
};
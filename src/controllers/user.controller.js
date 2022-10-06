import bcrypt from "bcryptjs";
import userService from "../services/user.service.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { email, password, id } = req.body;

  try {
    if (id) {
      const existingUser = await userService.findById(id);
      if (existingUser) {
        return res.status(400).json({ message: "user is exist" });
      }

      const newUser = await userService.addOne({ id });
      const token = userService.generateAccessToken(newUser.id);
      return res.json({ token });
    }

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "user is exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = await userService.addOne({
      email,
      password: hashPassword,
    });

    const token = userService.generateAccessToken(newUser.email, newUser.id);
    return res.json({ token });
  } catch (error) {
    res.status(500).json({
      message: "server error (user.controller.register)",
      details: error,
    });
  }
};

const login = async (req, res) => {
  const { id, email, password } = req.body;
  let existingUser;

  try {
    if (id) {
      existingUser = await userService.findById(id);
      if (!existingUser) {
        return res
          .status(400)
          .json({ message: "there is no user with this id" });
      }
    } else {
      existingUser = await userService.findByEmail(email);
      if (!existingUser) {
        return res.status(400).json({ message: "incorrect password or email" });
      }
      
      const passwordValid = bcrypt.compareSync(password, existingUser.password);
      if (!passwordValid) {
        return res.status(400).json({ message: "incorrect password or email" });
      }
    }

    const token = userService.generateAccessToken(
      existingUser.email,
      existingUser.id
    );

    return res.send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error (user.controller.login)",
      details: error,
    });
  }
};

export default { register, login };

import userService from "../services/user.service.js";
import tokenService from "../services/token.service.js";

const register = async (req, res) => {
  const { email, password, id } = req.body;

  try {
    if (id) {
      // with auth provider
      const existingUser = await userService.findById(id);
      if (existingUser) {
        return res.status(400).json({ message: "user is exist" });
      }

      const newUser = await userService.addOne({ id });
      const refreshToken = await tokenService.createRefreshToken(newUser.id);
      const accessToken = tokenService.generateAccessToken(
        newUser.email,
        newUser.id
      );
      return res.json({ accessToken, refreshToken });
    }

    // with email & password
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "user is exist" });
    }

    const hashPassword = userService.encryptPassword(password);
    const newUser = await userService.addOne({
      email,
      password: hashPassword,
    });
    const refreshToken = await tokenService.createRefreshToken(newUser.id);
    const accessToken = tokenService.generateAccessToken(
      newUser.email,
      newUser.id
    );
    return res.json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message || "Server error" });
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

      const isPasswordValid = userService.validatePassword(
        password,
        existingUser.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: "incorrect password or email" });
      }
    }

    const refreshToken = await tokenService.createRefreshToken(existingUser.email, existingUser.id);
    const accessToken = tokenService.generateAccessToken(
      existingUser.email,
      existingUser.id
    );

    return res.send({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message || "Server error" });
  }
};

export const refresh = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const existingRToken = await tokenService.getRefreshToken(requestToken);
    if (!existingRToken) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const isExpired = tokenService.verifyExpiration(existingRToken);
    if (isExpired) {
      await existingRToken.destroy();
      return res.status(403).json({ message: "Invalid token" });
    }

    const user = await existingRToken.getUser();
    if (!user) {
      await existingRToken.destroy();
      return res.status(403).json({ message: "Invalid token" });
    }

    const newAccessToken = tokenService.generateAccessToken(
      user.email,
      user.id
    );

    return res.json({
      refreshToken: existingRToken.token,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err.message || "Server error" });
  }
};

export default { register, login, refresh };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv/config');
const passport = require('passport');
const User = require('../db/models/User');
const Faculty = require('../db/models/Faculty');
/**
 * @DESC REGISTER USER
 */

const validateUserIndex = async (index) => {
  const user = await User.findOne({ numberOfIndex: index });
  return !user;
};
const validateUserEmail = async (email) => {
  const user = await User.findOne({ email });
  return !user;
};

const userRegister = async (user, res) => {
  try {
    const userIndex = await validateUserIndex(user.numberOfIndex);
    const userEmail = await validateUserEmail(user.email);
    if (!userIndex) {
      return res.status(400).json({
        message: 'Student with this index already exists!',
        success: false,
      });
    }
    if (!userEmail) {
      return res.status(400).json({
        message: 'Student with this email already exists!',
        success: false,
      });
    }
    // hashed password
    const hashedPassword = await bcrypt.hash(user.password, 12);
    // creat new user
    const newUser = new User({ ...user, password: hashedPassword });
    await Faculty.updateMany(
      { _id: newUser.faculties },
      { $push: { users: newUser.numberOfIndex } }
    );
    await newUser.save();
    return res.status(201).json({
      message: 'User successfully created',
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to create account: ${err}`,
      success: false,
    });
  }
};

/**
 * @DESC Passport middlewares
 */
const userAuth = passport.authenticate('jwt', { session: false });

const serializeUser = (user) => ({
  name: user.name,
  lastName: user.lastName,
  numberOfIndex: user.numberOfIndex,
  img: user.img,
  email: user.email,
  faculties: user.faculties,
});

const checkRole = (roles) => (req, res, next) => {
  if (roles.includes(req.user.role)) {
    return next();
  }
  return res.status(401).json('Unauthorized');
};

/**
 * @DESC LOGIN USER
 */
const userLogin = async (user, res) => {
  const { email, password } = user;
  // check if the user is on the db
  const findUser = await User.findOne({ email });
  if (!findUser) {
    return res.status(404).json({
      message: 'User is not found. Invalid login credentials',
      success: false,
    });
  }
  const isMatch = await bcrypt.compare(password, findUser.password);
  if (isMatch) {
    // sign in the token
    const token = jwt.sign(
      {
        user_id: findUser._id,
        email: findUser.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: '2 days' }
    );
    const result = {
      name: findUser.name,
      lastName: findUser.lastName,
      email: findUser.email,
      role: findUser.role,
      img: findUser.img,
      numberOfIndex: findUser.numberOfIndex,
      faculties: findUser.faculties,
      token: `Bearer ${token}`,
      expiresIn: 48,
    };
    return res.status(200).json({
      ...result,
      message: 'User logged in correctly',
      success: true,
    });
  }
  return res.status(403).json({
    message: 'Incorrect password.',
    success: false,
  });
};

module.exports = {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
};

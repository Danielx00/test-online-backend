const router = require('express').Router();
const {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
  updateUserProfile,
} = require('../Utils/Auth');
// login
router.post('/login', async (req, res) => {
  await userLogin(req.body, res);
});

// register
router.post('/register', async (req, res) => {
  await userRegister(req.body, res);
});

// user profile
router.get('/profile', userAuth, async (req, res) => {
  await serializeUser(req.user, res);
});

router.patch('/profile/:userId', userAuth, async (req, res) => {
  await updateUserProfile(req, res);
});

// todo: delete this route its just for testing
router.get('/protected', userAuth, checkRole(['employee']), async (req, res) =>
  res.json('protected route')
);
module.exports = router;

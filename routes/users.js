const router = require('express').Router();
const {
  userRegister,
  userLogin,
  userAuth,
  serializeUser,
  checkRole,
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
router.get('/profile', userAuth, async (req, res) =>
  res.json(serializeUser(req.user))
);

// todo: delete this route its just for testing
router.get('/protected', userAuth, checkRole(['employee']), async (req, res) =>
  res.json('protected route')
);
module.exports = router;

const router = require('express').Router();
const { userRegister, userLogin } = require('../Utils/Auth');
// login
router.post('/login', async (req, res) => {
  await userLogin(req.body, res);
});

// register
router.post('/register', async (req, res) => {
  await userRegister(req.body, res);
});

module.exports = router;

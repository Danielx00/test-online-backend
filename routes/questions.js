const router = require('express').Router();
const { createQuestion } = require('../Utils/Questions');
const { userAuth, checkRole } = require('../Utils/Auth');

router.post('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await createQuestion(req, res);
});

module.exports = router;

const router = require('express').Router();
const { createQuestion, getQuestions } = require('../Utils/Questions');
const { userAuth, checkRole } = require('../Utils/Auth');

router.post('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await createQuestion(req, res);
});
router.get('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await getQuestions(req, res);
});

module.exports = router;

const router = require('express').Router();
const {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
} = require('../Utils/Questions');
const { userAuth, checkRole } = require('../Utils/Auth');

// create question
router.post('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await createQuestion(req, res);
});

// get questions by set id
router.get('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await getQuestions(req, res);
});
router.patch('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await updateQuestion(req, res);
});
router.delete(
  '/:id/:setId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await deleteQuestion(req, res);
  }
);

module.exports = router;

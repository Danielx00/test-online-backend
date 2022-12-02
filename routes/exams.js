const router = require('express').Router();
const { createExam } = require('../Utils/Exams');
const { userAuth, checkRole } = require('../Utils/Auth');

// create exam
router.post(
  '/:facultyId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await createExam(req, res);
  },
);

module.exports = router;

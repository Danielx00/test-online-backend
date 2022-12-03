const router = require('express').Router();
const {
  createExam,
  deleteExam,
  getAllExams,
  getExamByFaculty,
} = require('../Utils/Exams');
const { userAuth, checkRole } = require('../Utils/Auth');

// create exam
router.post(
  '/:facultyId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await createExam(req, res);
  }
);
// delete exam
router.delete(
  '/:examId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await deleteExam(req, res);
  }
);
// get all exams
router.get('/', userAuth, checkRole(['employee']), async (req, res) => {
  await getAllExams(req, res);
});
router.get(
  '/:facultyId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await getExamByFaculty(req, res);
  }
);

module.exports = router;

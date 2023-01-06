const router = require('express').Router();
const {
  createExam,
  deleteExam,
  getAllExams,
  getExamByFaculty,
  editExam,
  getExamsForStudentByFaculty,
  getAllStudentTests,
  getAllExamQuestions,
  checkStudentAnswers,
  getStudentCheckedExam,
  getAllStudentsExams,
  getReturnedStudentExam,
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
// update exam
router.patch(
  '/:examId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await editExam(req, res);
  }
);

// get exam assigned for student by faculty
router.get('/:facultyId/student', userAuth, async (req, res) => {
  await getExamsForStudentByFaculty(req, res);
});

// get all student exams
router.get('/students/exams', userAuth, async (req, res) => {
  await getAllStudentTests(req, res);
});

// get questions for student exam to start exam
router.get('/students/:studentExamId', userAuth, async (req, res) => {
  await getAllExamQuestions(req, res);
});
// send student questions and check it on backend
router.patch('/students/:studentExamId', userAuth, async (req, res) => {
  await checkStudentAnswers(req, res);
});
// overview checked student's exam
router.get(
  '/students/overview-exam/:studentExamId',
  userAuth,
  async (req, res) => {
    await getStudentCheckedExam(req, res);
  }
);
router.get(
  '/students/allTests/:assignedExamId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await getAllStudentsExams(req, res);
  }
);
router.get(
  '/students/tests/:studentExamId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await getReturnedStudentExam(req, res);
  }
);

module.exports = router;

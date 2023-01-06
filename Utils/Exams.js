const Exam = require('../db/models/Exam');
const Faculty = require('../db/models/Faculty');
const Set = require('../db/models/Set');
const StudentExam = require('../db/models/StudentExam');
const Question = require('../db/models/Question');

const createExam = async (req, res) => {
  const exam = req.body;
  const { user } = req;
  const { facultyId } = req.params;
  const faculty = await Faculty.findById(facultyId);
  /**
   * TODO add relation to faculties [add employee to each faculty then check if employee exist in this faculty]
   */
  if (!faculty) {
    return res.status(400).json({
      success: false,
      message: "Faculty doesn't exist",
    });
  }
  try {
    const newExam = new Exam({
      ...exam,
      owner: user.id,
      faculty: facultyId,
    });

    const savedExam = await newExam.save();
    savedExam.students.forEach((student) => {
      StudentExam.insertMany({
        title: savedExam.title,
        description: savedExam.description,
        startExam: savedExam.startExam,
        endExam: savedExam.endExam,
        date: savedExam.date,
        assignedExam: savedExam._id,
        setId: savedExam.set,
        student,
        faculty: facultyId,
      });
    });
    res.status(200).json(savedExam);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const deleteExam = async (req, res) => {
  const { user } = req;
  const { examId } = req.params;
  try {
    const examToDelete = await Exam.findById(examId);
    if (examToDelete) {
      if (user.id !== examToDelete.owner.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to do it',
        });
      }
      const studentExams = await StudentExam.find({
        status: { $in: 'Inaccessible' },
      })
        .where('assignedExam')
        .in(examId)
        .select(['_id'])
        .exec();
      await StudentExam.deleteMany({ _id: { $in: studentExams } });
      await Exam.findByIdAndDelete(examId);
      return res.status(200).json({
        success: true,
        message: 'Exam successfully deleted',
      });
    }
    return res.status(404).json({
      success: false,
      message: "Exam doesn't exist",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const getExamByFaculty = async (req, res) => {
  const { user } = req;
  const { facultyId } = req.params;
  try {
    const exams = await Exam.find({
      $and: [{ owner: user.id }, { faculty: facultyId }],
    });
    const ids = exams.map(({ set }) => set);
    const sets = await Set.find({ _id: { $in: ids } });
    const serializeSets = sets.map((set) => ({
      _id: set._id,
      title: set.title,
    }));
    const serializeExams = exams.map((exam) => ({
      _id: exam._id,
      date: exam.date,
      description: exam.description,
      title: exam.title,
      startExam: exam.startExam,
      endExam: exam.endExam,
      students: exam.students,
      set: serializeSets.filter(
        (set) => set._id.toString() === exam.set.toString()
      ),
    }));
    res.status(200).json(serializeExams);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const getAllExams = async (req, res) => {
  const { user } = req;
  try {
    const exams = await Exam.find({ owner: user.id });
    const ids = exams.map(({ set }) => set);
    const sets = await Set.find({ _id: { $in: ids } });
    const serializeSets = sets.map((set) => ({
      _id: set._id,
      title: set.title,
    }));
    const serializeExams = exams.map((exam) => ({
      _id: exam._id,
      date: exam.date,
      description: exam.description,
      title: exam.title,
      startExam: exam.startExam,
      endExam: exam.endExam,
      students: exam.students,
      set: serializeSets.filter(
        (set) => set._id.toString() === exam.set.toString()
      ),
    }));
    res.status(200).json(serializeExams);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const editExam = async (req, res) => {
  const { user } = req;
  const exam = req.body;
  const { examId } = req.params;

  try {
    const examToEdit = await Exam.findById(examId);
    if (examToEdit) {
      if (user.id !== examToEdit.owner.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to do it',
        });
      }
      const updatedExam = await Exam.findByIdAndUpdate(
        examId,
        {
          $set: exam,
        },
        { new: true }
      );
      return res.status(200).json(updatedExam);
    }
    return res.status(404).json({
      success: false,
      message: "Exam doesn't exist",
    });

    // move this to upper to the if statement
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const getExamsForStudentByFaculty = async (req, res) => {
  const { user } = req;
  const { facultyId } = req.params;
  const ids = [];
  try {
    const exams = await StudentExam.find({
      $and: [{ student: user.numberOfIndex }, { faculty: facultyId }],
    });
    // TODO:try to refactor it to not filter just get properly data from db
    const filteredArray = exams.filter(
      (exam) => exam.status === 'Inaccessible' || exam.status === 'Accessible'
    );
    const faculty = await Faculty.findById(facultyId);
    filteredArray.forEach((exam) => ids.push(exam.assignedExam));
    const examsDetails = await Exam.find({ _id: { $in: ids } });
    const serializeStudentExam = examsDetails.map((exam, index) => ({
      _id: filteredArray[index]._id,
      title: exam.title,
      description: exam.description,
      date: exam.date,
      startExam: exam.startExam,
      endExam: exam.endExam,
      status: filteredArray[index].status,
      faculty: faculty.title,
    }));
    res.status(200).json(serializeStudentExam);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const getAllStudentTests = async (req, res) => {
  const { user } = req;
  try {
    const exams = await StudentExam.find({
      $and: [{ student: user.numberOfIndex }],
    });
    // TODO:try to refactor it to not filter just get properly data from db
    const filteredExams = exams.filter(
      (exam) => exam.status === 'Checked' || exam.status === 'Checking'
    );
    // TODO:   display here only checked tests(bug) if admin delete exam
    const serializeStudentExam = filteredExams.map((exam) => ({
      _id: exam._id,
      title: exam.title,
      description: exam.description,
      date: exam.date,
      startExam: exam.startExam,
      endExam: exam.endExam,
      status: exam.status,
      answers: exam.answers,
    }));
    res.status(200).json(serializeStudentExam);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const getAllExamQuestions = async (req, res) => {
  const { user } = req;
  const { studentExamId } = req.params;
  try {
    const exam = await StudentExam.findById(studentExamId);
    if (user.numberOfIndex === exam.student && exam.status === 'Accessible') {
      const assignedExam = await Exam.findById(exam.assignedExam);
      const set = await Set.findById(assignedExam.set);
      const questions = await Question.find({ _id: { $in: set.questions } });
      return res.status(200).json(questions);
    }
    return res.status(403).json({
      message: 'Forbidden',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const checkStudentAnswers = async (req, res) => {
  const { questions: studentQuestions } = req.body;
  const { studentExamId } = req.params;
  let openQuestions = 0;
  let points = 0;
  let maxPoints = 0;

  studentQuestions.forEach((question) => {
    if (question.answers.length === 1) openQuestions++;
    question.answers.forEach((answer) => {
      if (answer.checked && answer.points > 0) {
        points += answer.points;
      }
      if (answer.points > 0) {
        maxPoints += answer.points;
      }
    });
  });
  const questionWithAnswersToUpdate = studentQuestions.map((question) => ({
    _id: question._id,
    question: question.question,
    points: question.points,
    note: '',
    answers: question.answers,
  }));
  try {
    await StudentExam.update(
      { _id: studentExamId },
      {
        $set: {
          scoredPoints: points,
          maxPoints,
          questions: questionWithAnswersToUpdate,
          status: openQuestions ? 'Checking' : 'Checked',
          returnTime: `${new Date().getHours()}:${new Date().getMinutes()}`,
        },
      }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
  return res.status(200).json({
    success: true,
  });
};
const getStudentCheckedExam = async (req, res) => {
  const { studentExamId } = req.params;
  const { user } = req;
  try {
    const exam = await StudentExam.findById(studentExamId);
    if (user.numberOfIndex === exam.student && exam.status === 'Checked') {
      return res.status(200).json({
        scoredPoints: exam.scoredPoints,
        maxPoints: exam.maxPoints,
        questions: exam.questions,
      });
    }
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const getAllStudentsExams = async (req, res) => {
  const { assignedExamId } = req.params;
  try {
    const studentsExams = await StudentExam.find()
      .where('assignedExam')
      .in(assignedExamId)
      .select([
        '_id',
        'student',
        'returnTime',
        'status',
        'scoredPoints',
        'maxPoints',
      ])
      .exec();
    const examsToReturn = studentsExams.filter(
      (exam) => exam.returnTime.length !== 0
    );
    return res.status(200).json(examsToReturn);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const getReturnedStudentExam = async (req, res) => {
  const { studentExamId } = req.params;
  try {
    const exam = await StudentExam.findById(studentExamId);
    return res.status(200).json({
      questions: exam.questions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const checkStudentExam = async (req, res) => {
  const { questions: studentQuestions } = req.body;
  const { studentExamId } = req.params;

  let points = 0;
  let maxPoints = 0;
  studentQuestions.forEach((question) => {
    question.answers.forEach((answer) => {
      if (question.points > 0) {
        points += question.points;
      }
      if (answer.checked && answer.points > 0) {
        points += answer.points;
      }
      if (answer.points > 0) {
        maxPoints += answer.points;
      }
    });
  });
  const questionWithAnswersToUpdate = studentQuestions.map((question) => ({
    _id: question._id,
    question: question.question,
    points: question.points,
    note: question.note,
    answers: question.answers,
  }));
  try {
    await StudentExam.update(
      { _id: studentExamId },
      {
        $set: {
          scoredPoints: points,
          maxPoints,
          questions: questionWithAnswersToUpdate,
          status: 'Checked',
        },
      }
    );
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
  return res.status(200).json({
    success: true,
  });
};
module.exports = {
  createExam,
  deleteExam,
  getExamByFaculty,
  getAllExams,
  editExam,
  getExamsForStudentByFaculty,
  getAllStudentTests,
  getAllExamQuestions,
  checkStudentAnswers,
  getStudentCheckedExam,
  getAllStudentsExams,
  getReturnedStudentExam,
  checkStudentExam,
};

const Exam = require('../db/models/Exam');
const Faculty = require('../db/models/Faculty');
const Set = require('../db/models/Set');
const StudentExam = require('../db/models/StudentExam');

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
        assignedExam: savedExam._id,
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
    const faculty = await Faculty.findById(facultyId);
    exams.forEach((exam) => ids.push(exam.assignedExam));
    const examsDetails = await Exam.find({ _id: { $in: ids } });
    const serializeStudentExam = examsDetails.map((exam, index) => ({
      _id: exams[index]._id,
      title: exam.title,
      description: exam.description,
      date: exam.date,
      startExam: exam.startExam,
      endExam: exam.endExam,
      faculty: faculty.title,
    }));
    res.status(200).json({ serializeStudentExam });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
module.exports = {
  createExam,
  deleteExam,
  getExamByFaculty,
  getAllExams,
  editExam,
  getExamsForStudentByFaculty,
};

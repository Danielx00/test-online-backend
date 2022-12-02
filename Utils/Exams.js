const Exam = require('../db/models/Exam');
const Faculty = require('../db/models/Faculty');

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
    res.status(200).json(savedExam);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
module.exports = {
  createExam,
};

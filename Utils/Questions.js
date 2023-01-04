const Question = require('../db/models/Question');
const Set = require('../db/models/Set');
const Answer = require('../db/models/Answer');

const createQuestion = async (req, res) => {
  const question = req.body;
  const { user } = req;
  const { setId } = req.params;

  const set = await Set.findById(setId);
  if (set) {
    if (user.id !== set.owner.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to do it',
      });
    }
    try {
      const newAnswers = new Answer({
        answers: question.answers,
      });
      const newQuestion = new Question({
        question: question.question,
        disabledEdit: question.disabledEdit,
        points: question.points,
        answers:
          question.answers.length > 1
            ? newAnswers.answers
            : [{ answer: '', points: 0, checked: true }],
        setId,
      });
      const savedQuestion = await newQuestion.save();
      await Set.update(
        { _id: setId },
        { $push: { questions: savedQuestion.id } }
      );
      res.status(200).json(savedQuestion);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err}`,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Set doesn't exist",
    });
  }
};

const getQuestions = async (req, res) => {
  const { setId } = req.params;
  const { user } = req;
  const set = await Set.findById(setId);
  if (set) {
    if (user.id !== set.owner.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to do it',
      });
    }
    try {
      const questions = await Question.find({ _id: { $in: set.questions } });
      res.status(200).json({
        questions,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: `Error: ${err}`,
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Set doesn't exist",
    });
  }
};
const updateQuestion = async (req, res) => {
  const { user } = req;
  const { question } = req.body;
  const { setId } = req.params;
  try {
    const setToEdit = await Set.findById(setId);
    if (setToEdit) {
      if (user.id !== setToEdit.owner.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to do it',
        });
      }
      if (setToEdit.questions.includes(question._id)) {
        const questionEdited = await Question.findByIdAndUpdate(
          question._id,
          {
            $set: question,
          },
          { new: true, upsert: true }
        );
        return res.status(200).json({ questionEdited });
      }
      return res.status(404).json({
        success: false,
        message: "Question doesn't exist in this set",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Set doesn't exist",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const deleteQuestion = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const { setId } = req.params;

  try {
    const set = await Set.findById(setId);
    if (set) {
      if (user.id !== set.owner.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to do it',
        });
      }
      if (set.questions.includes(id)) {
        await Question.findByIdAndDelete(id);
        const questions = await Question.find({ setId });
        await Set.updateOne({ _id: setId }, { $set: { questions } });
        return res.status(200).json({
          success: true,
          message: 'Successfully deleted question',
        });
      }
      return res.status(404).json({
        success: false,
        message: "Question doesn't exist in this set",
      });
    }
    return res.status(400).json({
      success: false,
      message: "Set doesn't exist",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
};

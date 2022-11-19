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
        answers: question.answers.length ? newAnswers.answers : [],
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

module.exports = {
  createQuestion,
  getQuestions,
};

const Question = require('../db/models/Question');
const Set = require('../db/models/Set');

const createQuestion = async (req, res) => {
  const question = req.body;
  const { user } = req;
  const { setId } = req.params;

  const set = await Set.findById(setId);
  const newQuestion = new Question({
    ...question,
  });
  if (set) {
    if (user.id !== set.owner.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to do it',
      });
    }
    try {
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

module.exports = {
  createQuestion,
};

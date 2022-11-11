const Set = require('../db/models/Set');

const getUserSets = async (user, res) => {
  try {
    const sets = await Set.find({ owner: { $in: user.id } });
    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const getSetsByFaculty = async (req, res) => {
  const { user } = req;
  const { facultyId } = req.params;
  try {
    const sets = await Set.find({
      $and: [{ owner: user.id }, { faculty: facultyId }],
    });
    res.status(200).json(sets);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

const createSet = async (req, res) => {
  const set = req.body;
  const { user } = req;
  const { facultyId } = req.params;
  const newSet = new Set({
    ...set,
    owner: user.id,
    faculty: facultyId,
  });

  try {
    const savedSet = await newSet.save();
    res.status(200).json(savedSet);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const editSet = async (req, res) => {
  const { user } = req;
  const set = req.body;
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Set doesn't exist",
      });
    }
    const updatedSet = await Set.findByIdAndUpdate(
      setId,
      {
        $set: set,
      },
      { new: true }
    );
    res.status(200).json(updatedSet);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};
const deleteSet = async (req, res) => {
  const { user } = req;
  const { setId } = req.params;

  try {
    const setToDelete = await Set.findById(setId);
    if (setToDelete) {
      if (user.id !== setToDelete.owner.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not allowed to do it',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Set doesn't exist",
      });
    }
    await Set.findByIdAndDelete(setId);
    res.status(200).json({
      success: true,
      message: 'Set successfuly deleted',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error: ${err}`,
    });
  }
};

module.exports = {
  getUserSets,
  createSet,
  getSetsByFaculty,
  editSet,
  deleteSet,
};

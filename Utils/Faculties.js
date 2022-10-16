const Faculty = require('../db/models/Faculty');

const getAllFaculties = async (req, res) => {
  let data;
  try {
    data = await Faculty.find({});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.status(200).json(data);
};

module.exports = { getAllFaculties };

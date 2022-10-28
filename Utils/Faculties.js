const Faculty = require('../db/models/Faculty');

const getAllFaculties = async (req, res) => {
  let data;
  try {
    data = await Faculty.find({});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  const mappedFaculty = data.map((faculty) => ({
    id: faculty._id,
    title: faculty.title,
  }));
  res.status(200).json({
    faculties: mappedFaculty,
  });
};

module.exports = { getAllFaculties };

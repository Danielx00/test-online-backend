const { getAllFaculties } = require('../Utils/Faculties');
const router = require('express').Router();

// Get all faculties
router.get('/', async (req, res) => {
  await getAllFaculties(req.body, res);
});

module.exports = router;

const router = require('express').Router();
const {
  createSet,
  getSetsByFaculty,
  editSet,
  deleteSet,
} = require('../Utils/Sets');
const { userAuth, checkRole } = require('../Utils/Auth');

// create set on each faculty
router.post(
  '/:facultyId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await createSet(req, res);
  }
);

// get set by facylty id (for employee to display his sets on each faculty page)
router.get(
  '/:facultyId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await getSetsByFaculty(req, res);
  }
);

// update set by id
router.patch('/:setId', userAuth, checkRole(['employee']), async (req, res) => {
  await editSet(req, res);
});

// delete set by id
router.delete(
  '/:setId',
  userAuth,
  checkRole(['employee']),
  async (req, res) => {
    await deleteSet(req, res);
  }
);

module.exports = router;

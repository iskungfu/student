const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/', auth, StudentController.getAll);
router.get('/:id', auth, StudentController.getById);
router.post('/', auth, StudentController.create);
router.put('/:id', auth, StudentController.update);
router.delete('/:id', auth, StudentController.delete);

module.exports = router;

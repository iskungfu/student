const express = require('express');
const router = express.Router();
const ClassController = require('../controllers/classController');
const auth = require('../middleware/auth');

router.get('/', auth, ClassController.getAll);
router.get('/list', auth, ClassController.getList);
router.get('/:id', auth, ClassController.getById);
router.post('/', auth, ClassController.create);
router.put('/:id', auth, ClassController.update);
router.delete('/:id', auth, ClassController.delete);

module.exports = router;

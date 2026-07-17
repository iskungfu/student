const express = require('express');
const router = express.Router();
const MajorController = require('../controllers/majorController');
const auth = require('../middleware/auth');

router.get('/', auth, MajorController.getAll);
router.get('/list', auth, MajorController.getList);
router.get('/:id', auth, MajorController.getById);
router.post('/', auth, MajorController.create);
router.put('/:id', auth, MajorController.update);
router.delete('/:id', auth, MajorController.delete);

module.exports = router;

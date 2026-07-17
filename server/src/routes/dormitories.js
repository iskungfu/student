const express = require('express');
const router = express.Router();
const DormitoryController = require('../controllers/dormitoryController');
const auth = require('../middleware/auth');

router.get('/', auth, DormitoryController.getAll);
router.get('/list', auth, DormitoryController.getList);
router.get('/:id', auth, DormitoryController.getById);
router.post('/', auth, DormitoryController.create);
router.put('/:id', auth, DormitoryController.update);
router.delete('/:id', auth, DormitoryController.delete);

module.exports = router;

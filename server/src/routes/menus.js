const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');
const auth = require('../middleware/auth');

router.get('/', auth, MenuController.getAll);
router.get('/:id', auth, MenuController.getById);
router.post('/', auth, MenuController.create);
router.put('/:id', auth, MenuController.update);
router.delete('/:id', auth, MenuController.delete);

module.exports = router;

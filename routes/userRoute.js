import express from 'express';
import multer from 'multer';
import { insertUser } from '../controllers/insertUser.js';
import { loginUser } from '../controllers/loginUser.js';

const router = express.Router();
const upload = multer(); 

router.post('/register', upload.none(), insertUser);
router.post('/login', upload.none(), loginUser);

export default router;
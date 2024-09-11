import express from "express";
import { registerControllers, loginControllers,updateControllers,forgetpasswordcontrollers } from '../controllers/authcontrollers.js'

const router = express.Router();

router.post('/register', registerControllers)

router.post('/login', loginControllers)

router.put('/update/:userId', updateControllers);

router.put('/forget', forgetpasswordcontrollers);


export default router;
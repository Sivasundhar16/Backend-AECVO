import express from "express";

import {
  forgetPassword,
  getcurrentUser,
  login,
  logout,
  resetPassword,
  signup,
} from "../controller/authcontroler.js";
import { protectRoute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgetpassword", forgetPassword);
router.patch("/resetpassword/:token", resetPassword);

router.get("/me", protectRoute, getcurrentUser);

export default router;

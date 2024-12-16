import express from "express";
import {
  addCourse,
  updateCourse,
  deleteCourse,
  getAllCourse,
  getCourse,
} from "../controller/coursecontroller.js";
import { protectRoute } from "../middleware/authmiddleware.js";
import { roleAuth } from "../middleware/role.auth.js";

const router = express.Router();

router.get("/allcourses", getAllCourse);
router.get("/course/:id", getCourse);

router.post("/add", protectRoute, roleAuth("admin"), addCourse);
router.put("/update/:id", protectRoute, roleAuth("admin"), updateCourse);
router.delete("/delete/:id", protectRoute, roleAuth("admin"), deleteCourse);

export default router;

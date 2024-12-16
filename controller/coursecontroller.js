import mongoose from "mongoose";
import Course from "../schema/courseschema.js";

const addCourse = async (req, res) => {
  try {
    const { title, description, category, price, instructor } = req.body;

    if (!title || !description || !category || !price || !instructor) {
      return res.status(500).json({ message: "Enter the all field" });
    }

    const newCourse = new Course({
      title: title,
      description: description,
      category: category,
      price: price,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully" });
  } catch (error) {
    res.send({
      message: error,
    });
  }
};
const getAllCourse = async (req, res) => {
  try {
    const allCourse = await Course.find();
    res.status(200).json({ message: allCourse });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getCourse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const singleCourse = await Course.findById(id);

    if (!singleCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(singleCourse);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while retrieving the course",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Course ID" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({ message: updatedCourse });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Course is not found" });
    }

    await Course.findByIdAndDelete(id);
    return res.status(200).json({ message: "Course is Deleted" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export { addCourse, updateCourse, deleteCourse, getAllCourse, getCourse };

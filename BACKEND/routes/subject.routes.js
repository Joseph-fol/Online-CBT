const express = require("express")
const router = express.Router()
const { verifyToken, adminOnly } = require("../middleware/auth.middleware")
const { createSubject, getAllSubjects, getSubjectById, deleteSubject, updateSubject } = require("../controllers/subject.controller")

// POST /subjects - Create a new subject (Admin only)
router.post("/", verifyToken, adminOnly, createSubject)

// GET /subjects - Get all subjects (Authenticated users)
router.get("/", verifyToken, getAllSubjects)

// GET /subjects/:id - Get subject by ID (Admin only)
router.get("/:id", verifyToken, adminOnly, getSubjectById)

// DELETE /subjects/:id - Delete subject (Admin only)
router.delete("/:id", verifyToken, adminOnly, deleteSubject)

// PUT /subjects/:id - Update subject (Admin only)
router.put("/:id", verifyToken, adminOnly, updateSubject)

module.exports = router

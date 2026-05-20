const Subject = require("../models/subject.model")

const createSubject = (req, res) => {
    const { name, department, description, duration } = req.body

    // Validate required fields
    if (!name || !department || !duration) {
        return res.status(400).json({
            message: "Name, department, and duration are required"
        })
    }

    const newSubject = new Subject({
        name,
        department,
        description,
        duration
    })

    newSubject.save()
        .then((subject) => {
            console.log("Subject created successfully:", subject._id)
            return res.status(201).json({
                message: "Subject created successfully",
                subject: subject
            })
        })

        .catch((error) => {
            console.error("Error creating subject:", error.message)
            
            // Handle duplicate name error
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Subject name already exists",
                    error: error.message
                })
            }
            
            return res.status(500).json({
                message: "Failed to create subject",
                error: error.message
            })
        })
}

const getAllSubjects = (req, res) => {
    Subject.find()
        .then((subjects) => {
            console.log(`Retrieved ${subjects.length} subjects`)
            return res.status(200).json({
                message: "Subjects retrieved successfully",
                count: subjects.length,
                subjects: subjects
            })
        })
        .catch((error) => {
            console.error("Error fetching subjects:", error.message)
            return res.status(500).json({
                message: "Failed to fetch subjects",
                error: error.message
            })
        })
}

const getSubjectById = (req, res) => {
    const { id } = req.params

    Subject.findById(id)
        .then((subject) => {
            if (!subject) {
                return res.status(404).json({
                    message: "Subject not found"
                })
            }
            console.log("Subject retrieved successfully:", subject._id)
            return res.status(200).json({
                message: "Subject retrieved successfully",
                subject: subject
            })
        })
        .catch((error) => {
            console.error("Error fetching subject:", error.message)
            return res.status(500).json({
                message: "Failed to fetch subject",
                error: error.message
            })
        })
}

const deleteSubject = (req, res) => {
    const { id } = req.params

    Subject.findByIdAndDelete(id)
        .then((subject) => {
            if (!subject) {
                return res.status(404).json({
                    message: "Subject not found"
                })
            }
            
            console.log("Subject deleted successfully:", subject._id)
            return res.status(200).json({
                message: "Subject deleted successfully",
                subject: subject
            })
        })
        .catch((error) => {
            console.error("Error deleting subject:", error.message)
            return res.status(500).json({
                message: "Failed to delete subject",
                error: error.message
            })
        })
}

const updateSubject = (req, res) => {
    const { id } = req.params
    const { name, department, description, duration } = req.body

    // Validate required fields
    if (!name || !department || !duration) {
        return res.status(400).json({
            message: "Name, department, and duration are required"
        })
    }

    Subject.findByIdAndUpdate(
        id,
        { name, department, description, duration },
        { new: true, runValidators: true }
    )
        .then((subject) => {
            if (!subject) {
                return res.status(404).json({
                    message: "Subject not found"
                })
            }
            
            console.log("Subject updated successfully:", subject._id)
            return res.status(200).json({
                message: "Subject updated successfully",
                subject: subject
            })
        })
        .catch((error) => {
            console.error("Error updating subject:", error.message)
            
            // Handle duplicate name error
            if (error.code === 11000) {
                return res.status(409).json({
                    message: "Subject name already exists",
                    error: error.message
                })
            }
            
            return res.status(500).json({
                message: "Failed to update subject",
                error: error.message
            })
        })
}

module.exports = { createSubject, getAllSubjects, getSubjectById, deleteSubject, updateSubject }

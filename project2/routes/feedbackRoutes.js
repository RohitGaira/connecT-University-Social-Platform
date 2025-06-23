const express = require("express")
const router = express.Router()
const feedbackController = require("../controllers/feedbackController")
const { isAuthenticated } = require("../middleware/auth")

// Submit feedback for project member - FIXED ROUTE PATH
router.post("/feedback/submit", isAuthenticated, feedbackController.submitFeedback)

// Get feedback for a user
router.get("/feedback/user/:userId?", isAuthenticated, feedbackController.getUserFeedback)

// Get projects available for feedback
router.get("/feedback/projects", isAuthenticated, feedbackController.getProjectsForFeedback)

// Get feedback options for a project
router.get("/feedback/options/:projectId", isAuthenticated, feedbackController.getFeedbackOptions)

// Get feedback for a project
router.get("/feedback/project/:projectId", isAuthenticated, feedbackController.getProjectFeedback)

module.exports = router

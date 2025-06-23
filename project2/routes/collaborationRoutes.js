const express = require("express")
const router = express.Router()
const collaborationController = require("../controllers/collaborationController")
const { isAuthenticated } = require("../middleware/auth")

// All collaboration routes require authentication
router.use(isAuthenticated)

// Get collaboration settings for a project
router.get("/settings/:projectId", collaborationController.getCollaborationSettings)

// Update collaboration settings
router.put("/settings/:projectId", collaborationController.updateCollaborationSettings)

// Get project matches
router.get("/matches/:projectId", collaborationController.getProjectMatches)

// Get collaboration analytics
router.get("/analytics/:projectId", collaborationController.getCollaborationAnalytics)

module.exports = router

const Project = require("../models/projectSchema")
const User = require("../models/userSchema")
const ProjectCollaborationService = require("../services/projectCollaborationService")

/**
 * Collaboration Controller - Handles project collaboration features
 */

// Get collaboration settings for a project
exports.getCollaborationSettings = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    const project = await Project.findById(projectId)
      .populate("creator", "name email")
      .populate("currentMembers.user", "name email")

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user is project creator or member
    const isCreator = project.creator._id.toString() === userId.toString()
    const isMember = project.currentMembers.some((member) => member.user._id.toString() === userId.toString())

    if (!isCreator && !isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      })
    }

    res.json({
      success: true,
      settings: {
        projectId: project._id,
        title: project.title,
        status: project.status,
        maxMembers: project.maxMembers,
        currentMembers: project.currentMembers.length,
        availableSpots: project.maxMembers - project.currentMembers.length,
        canInvite: isCreator && project.status === "recruiting" && project.currentMembers.length < project.maxMembers,
      },
    })
  } catch (error) {
    console.error("Error getting collaboration settings:", error)
    res.status(500).json({
      success: false,
      message: "Error getting collaboration settings",
    })
  }
}

// Update collaboration settings
exports.updateCollaborationSettings = async (req, res) => {
  try {
    const { projectId } = req.params
    const { maxMembers } = req.body
    const userId = req.user._id

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Only creator can update settings
    if (project.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project creator can update settings",
      })
    }

    // Can't change settings for completed/cancelled projects
    if (project.status === "completed" || project.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot update settings for completed or cancelled projects",
      })
    }

    if (maxMembers && maxMembers >= project.currentMembers.length) {
      project.maxMembers = Math.min(10, Math.max(2, maxMembers))
      await project.save()
    }

    res.json({
      success: true,
      message: "Settings updated successfully",
      project,
    })
  } catch (error) {
    console.error("Error updating collaboration settings:", error)
    res.status(500).json({
      success: false,
      message: "Error updating collaboration settings",
    })
  }
}

// Get project matches using existing service
exports.getProjectMatches = async (req, res) => {
  try {
    const { projectId } = req.params
    const limit = Number.parseInt(req.query.limit) || 10

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user is project creator
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project creator can view matches",
      })
    }

    // Get potential users (exclude current members)
    const excludeUserIds = [project.creator, ...project.currentMembers.map((member) => member.user)]
    const potentialUsers = await User.find({
      university: project.university,
      _id: { $nin: excludeUserIds },
    }).limit(limit)

    // Simple match calculation (can be enhanced later)
    const matches = potentialUsers.map((user) => ({
      user,
      matchScore: 0.5, // Default score
      reasons: ["Same university"],
    }))

    res.json({
      success: true,
      matches,
      count: matches.length,
    })
  } catch (error) {
    console.error("Error getting project matches:", error)
    res.status(500).json({
      success: false,
      message: "Error getting project matches",
    })
  }
}

// Get collaboration analytics
exports.getCollaborationAnalytics = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user is project creator
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only project creator can view analytics",
      })
    }

    // Basic analytics
    const analytics = {
      totalMembers: project.currentMembers.length,
      maxMembers: project.maxMembers,
      availableSpots: project.maxMembers - project.currentMembers.length,
      status: project.status,
      createdAt: project.createdAt,
      lastUpdated: project.updatedAt,
    }

    res.json({
      success: true,
      analytics,
    })
  } catch (error) {
    console.error("Error getting collaboration analytics:", error)
    res.status(500).json({
      success: false,
      message: "Error getting collaboration analytics",
    })
  }
}

module.exports = {
  getCollaborationSettings: exports.getCollaborationSettings,
  updateCollaborationSettings: exports.updateCollaborationSettings,
  getProjectMatches: exports.getProjectMatches,
  getCollaborationAnalytics: exports.getCollaborationAnalytics,
}

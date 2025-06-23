const ProjectFeedback = require("../models/projectFeedbackSchema")
const Project = require("../models/projectSchema")
const User = require("../models/userSchema")

// Submit feedback for project member
exports.submitFeedback = async (req, res) => {
  try {
    const { projectId, revieweeId, ratings, comment, isAnonymous } = req.body

    // Validate project exists and user was a member
    const project = await Project.findById(projectId)
      .populate("creator", "name email")
      .populate("currentMembers.user", "name email")
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" })
    }

    // Only allow feedback for completed projects
    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback can only be submitted for completed projects",
      })
    }

    // Check if reviewer was part of the project
    console.log("=== DEBUG: Validating reviewer ===")
    console.log("Reviewer ID:", req.user._id.toString())
    console.log("Project creator ID:", project.creator._id.toString())
    console.log(
      "Project members:",
      project.currentMembers.map((m) => ({ id: m.user._id.toString(), name: m.user.name })),
    )

    const reviewerWasMember =
      project.currentMembers.some((member) => member.user._id.toString() === req.user._id.toString()) ||
      project.creator._id.toString() === req.user._id.toString()

    console.log("Reviewer was member:", reviewerWasMember)

    if (!reviewerWasMember) {
      return res.status(403).json({ success: false, message: "You were not a member of this project" })
    }

    // Check if reviewee was part of the project
    console.log("=== DEBUG: Validating reviewee ===")
    console.log("Reviewee ID:", revieweeId)

    const revieweeWasMember =
      project.currentMembers.some((member) => {
        const memberIdStr = member.user._id.toString()
        console.log("Comparing member:", memberIdStr, "with reviewee:", revieweeId)
        return memberIdStr === revieweeId
      }) || project.creator._id.toString() === revieweeId

    console.log("Reviewee was member:", revieweeWasMember)

    if (!revieweeWasMember) {
      return res.status(400).json({ success: false, message: "Reviewee was not a member of this project" })
    }

    // Cannot review yourself
    if (req.user._id.toString() === revieweeId) {
      return res.status(400).json({ success: false, message: "Cannot review yourself" })
    }

    // Check for existing feedback
    const existingFeedback = await ProjectFeedback.findOne({
      project: projectId,
      reviewer: req.user._id,
      reviewee: revieweeId,
    })

    if (existingFeedback) {
      return res.status(400).json({ success: false, message: "Feedback already submitted for this member" })
    }

    // Map UI fields to schema fields and validate ratings
    let mappedRatings = {}

    // Handle different possible input formats
    if (ratings.technical && ratings.communication && ratings.teamwork && ratings.reliability) {
      // Direct mapping (existing format)
      mappedRatings = {
        technical: ratings.technical,
        communication: ratings.communication,
        teamwork: ratings.teamwork,
        reliability: ratings.reliability,
      }
    } else if (ratings.teamSkills && ratings.commitment && ratings.technicalKnowledge && ratings.collaboration) {
      // Map from UI format to schema format
      mappedRatings = {
        technical: ratings.technicalKnowledge,
        communication: ratings.communication,
        teamwork: ratings.teamSkills,
        reliability: ratings.commitment,
      }
    } else {
      return res.status(400).json({ success: false, message: "All ratings are required" })
    }

    // Validate rating values (1-5 scale as per original schema)
    const ratingValues = Object.values(mappedRatings)
    if (ratingValues.some((rating) => rating < 1 || rating > 5)) {
      return res.status(400).json({ success: false, message: "Ratings must be between 1 and 5" })
    }

    // Create feedback
    const feedback = new ProjectFeedback({
      project: projectId,
      reviewer: req.user._id,
      reviewee: revieweeId,
      ratings: mappedRatings,
      comment: comment || "",
      isAnonymous: isAnonymous || false,
    })

    await feedback.save()

    res.json({ success: true, feedback })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    res.status(500).json({ success: false, message: "Error submitting feedback" })
  }
}

// Get feedback for a user
exports.getUserFeedback = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id

    const feedbacks = await ProjectFeedback.find({ reviewee: userId })
      .populate("project", "title")
      .populate("reviewer", "name department")
      .sort({ createdAt: -1 })

    // Calculate average ratings
    const totalRatings = {
      technical: 0,
      communication: 0,
      teamwork: 0,
      reliability: 0,
    }

    const count = feedbacks.length

    feedbacks.forEach((feedback) => {
      totalRatings.technical += feedback.ratings.technical
      totalRatings.communication += feedback.ratings.communication
      totalRatings.teamwork += feedback.ratings.teamwork
      totalRatings.reliability += feedback.ratings.reliability
    })

    const averageRatings =
      count > 0
        ? {
            technical: (totalRatings.technical / count).toFixed(1),
            communication: (totalRatings.communication / count).toFixed(1),
            teamwork: (totalRatings.teamwork / count).toFixed(1),
            reliability: (totalRatings.reliability / count).toFixed(1),
            overall: (
              (totalRatings.technical + totalRatings.communication + totalRatings.teamwork + totalRatings.reliability) /
              (count * 4)
            ).toFixed(1),
          }
        : null

    res.json({
      success: true,
      feedbacks: feedbacks.map((f) => ({
        ...f.toObject(),
        reviewer: f.isAnonymous ? null : f.reviewer,
      })),
      averageRatings,
      totalFeedbacks: count,
    })
  } catch (error) {
    console.error("Error getting user feedback:", error)
    res.status(500).json({ success: false, message: "Error getting user feedback" })
  }
}

// Get projects available for feedback
exports.getProjectsForFeedback = async (req, res) => {
  try {
    // Find completed projects where user was a member
    const projects = await Project.find({
      status: "completed",
      $or: [{ creator: req.user._id }, { "currentMembers.user": req.user._id }],
    })
      .populate("creator", "name department")
      .populate("currentMembers.user", "name department")
      .sort({ updatedAt: -1 })

    // For each project, get team members and check if feedback was already given
    const projectsWithFeedbackStatus = await Promise.all(
      projects.map(async (project) => {
        const teamMembers = [
          { user: project.creator, role: "creator" },
          ...project.currentMembers.filter((member) => member.user._id.toString() !== req.user._id.toString()),
        ]

        // Check feedback status for each member
        const membersWithFeedbackStatus = await Promise.all(
          teamMembers.map(async (member) => {
            if (member.user._id.toString() === req.user._id.toString()) {
              return null // Skip self
            }

            const existingFeedback = await ProjectFeedback.findOne({
              project: project._id,
              reviewer: req.user._id,
              reviewee: member.user._id,
            })

            return {
              ...member.user.toObject(),
              role: member.role,
              feedbackGiven: !!existingFeedback,
            }
          }),
        )

        return {
          ...project.toObject(),
          teamMembers: membersWithFeedbackStatus.filter((m) => m !== null),
        }
      }),
    )

    res.json({ success: true, projects: projectsWithFeedbackStatus })
  } catch (error) {
    console.error("Error getting projects for feedback:", error)
    res.status(500).json({ success: false, message: "Error getting projects for feedback" })
  }
}

// Get feedback options for a project (available team members to rate)
exports.getFeedbackOptions = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    // Check if project exists and is completed
    const project = await Project.findById(projectId)
      .populate("creator", "name email")
      .populate("currentMembers.user", "name email")

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user was part of the project
    const userInProject =
      project.currentMembers.some((member) => member.user._id.toString() === userId.toString()) ||
      project.creator._id.toString() === userId.toString()

    if (!userInProject) {
      return res.status(403).json({
        success: false,
        message: "You must have been part of the project to submit feedback",
      })
    }

    // Only allow feedback for completed projects
    if (project.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Feedback can only be submitted for completed projects",
      })
    }

    // Get team members excluding the current user
    const teamMembers = []

    console.log("=== DEBUG: Project team structure ===")
    console.log("Project creator:", project.creator)
    console.log("Current members:", project.currentMembers)
    console.log("Current user ID:", userId.toString())

    // Add creator if not current user
    if (project.creator._id.toString() !== userId.toString()) {
      console.log("Adding creator to team members:", project.creator.name)
      teamMembers.push({
        _id: project.creator._id,
        name: project.creator.name,
        email: project.creator.email,
        role: "creator",
      })
    }

    // Add other members
    project.currentMembers.forEach((member) => {
      console.log("Checking member:", member.user.name, "ID:", member.user._id.toString())
      if (member.user._id.toString() !== userId.toString()) {
        console.log("Adding member to team members:", member.user.name)
        teamMembers.push({
          _id: member.user._id,
          name: member.user.name,
          email: member.user.email,
          role: member.role,
        })
      }
    })

    console.log("Final team members for feedback:", teamMembers)

    // Check which team members already have feedback from current user
    const existingFeedback = await ProjectFeedback.find({
      project: projectId,
      reviewer: userId,
    })

    const feedbackGivenTo = existingFeedback.map((fb) => fb.reviewee.toString())

    const feedbackOptions = teamMembers.map((member) => ({
      ...member,
      feedbackGiven: feedbackGivenTo.includes(member._id.toString()),
    }))

    res.json({
      success: true,
      project: {
        _id: project._id,
        title: project.title,
        status: project.status,
      },
      feedbackOptions,
      totalMembers: teamMembers.length,
      feedbackRemaining: teamMembers.length - feedbackGivenTo.length,
    })
  } catch (error) {
    console.error("Error getting feedback options:", error)
    res.status(500).json({
      success: false,
      message: "Error getting feedback options",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

// Get feedback for a project
exports.getProjectFeedback = async (req, res) => {
  try {
    const { projectId } = req.params
    const userId = req.user._id

    // Check if project exists
    const project = await Project.findById(projectId)
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      })
    }

    // Check if user was part of the project
    const userInProject =
      project.currentMembers.some((member) => member.user.toString() === userId.toString()) ||
      project.creator.toString() === userId.toString()

    if (!userInProject) {
      return res.status(403).json({
        success: false,
        message: "You must have been part of the project to view feedback",
      })
    }

    // Get all feedback for the project
    const feedback = await ProjectFeedback.find({ project: projectId })
      .populate("reviewer", "name")
      .populate("reviewee", "name")
      .populate("project", "title")
      .sort({ createdAt: -1 })

    // Filter anonymous feedback
    const filteredFeedback = feedback.map((item) => {
      if (item.isAnonymous && item.reviewer._id.toString() !== userId.toString()) {
        return {
          ...item._doc,
          reviewer: { name: "Anonymous" },
        }
      }
      return item
    })

    res.json({
      success: true,
      feedback: filteredFeedback,
      count: filteredFeedback.length,
    })
  } catch (error) {
    console.error("Error getting project feedback:", error)
    res.status(500).json({
      success: false,
      message: "Error getting project feedback",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    })
  }
}

module.exports = {
  submitFeedback: exports.submitFeedback,
  getUserFeedback: exports.getUserFeedback,
  getProjectsForFeedback: exports.getProjectsForFeedback,
  getFeedbackOptions: exports.getFeedbackOptions,
  getProjectFeedback: exports.getProjectFeedback,
}

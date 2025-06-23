// Project Collaboration JavaScript
let currentUser = null
let currentProjects = []
let currentInvitations = []

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  await checkAuth()
  await loadUserProjects()
  await loadInvitations()
  setupEventListeners()
})

// Check authentication using cookies (not JWT tokens)
async function checkAuth() {
  try {
    const response = await fetch("/api/users/profile", {
      credentials: "include", // Important: include cookies
    })

    if (!response.ok) {
      window.location.href = "/login.html"
      return
    }

    const result = await response.json()
    if (result.success) {
      currentUser = result
    } else {
      window.location.href = "/login.html"
    }
  } catch (error) {
    console.error("Auth check failed:", error)
    window.location.href = "/login.html"
  }
}

// Setup event listeners
function setupEventListeners() {
  // Project creation form
  const createForm = document.getElementById("createProjectForm")
  if (createForm) {
    createForm.addEventListener("submit", handleCreateProject)
  }

  // Filter dropdown
  const filterSelect = document.getElementById("projectFilter")
  if (filterSelect) {
    filterSelect.addEventListener("change", filterProjects)
  }
}

// Handle project creation
async function handleCreateProject(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const projectData = {
    title: formData.get("title"),
    description: formData.get("description"),
    requiredSkills: formData
      .get("requiredSkills")
      .split(",")
      .map((s) => s.trim()),
    preferredInterests: formData
      .get("preferredInterests")
      .split(",")
      .map((s) => s.trim()),
    maxMembers: Number.parseInt(formData.get("maxMembers")),
    deadline: formData.get("deadline"),
    category: formData.get("category"),
  }

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(projectData),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Project created successfully!", "success")
      e.target.reset()
      await loadUserProjects()
      await loadRecommendations(result.project._id)
    } else {
      showNotification(result.message || "Failed to create project", "error")
    }
  } catch (error) {
    console.error("Error creating project:", error)
    showNotification("Error creating project", "error")
  }
}

// Load user projects
async function loadUserProjects() {
  try {
    const response = await fetch("/api/projects/my", {
      credentials: "include",
    })

    const result = await response.json()

    if (result.success) {
      currentProjects = [...result.createdProjects, ...result.joinedProjects]
      displayProjects(currentProjects)
    } else {
      console.error("Failed to load projects:", result.message)
    }
  } catch (error) {
    console.error("Error loading projects:", error)
  }
}

// Display projects with feedback forms for completed projects
function displayProjects(projects) {
  const container = document.getElementById("myProjectsList")
  if (!container) return

  if (projects.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No projects found.</p>'
    return
  }

  container.innerHTML = projects
    .map((project) => {
      const isCreator = project.creator._id === currentUser.user._id
      const statusBadge = getStatusBadge(project.status)
      const teamCount = project.currentMembers ? project.currentMembers.length : 1

      return `
        <div class="project-card border rounded-lg p-4 mb-4 bg-white shadow-sm">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="text-lg font-semibold text-gray-800">${project.title}</h3>
              <div class="flex items-center gap-2 mt-1">
                ${statusBadge}
                <span class="text-sm text-gray-600">(${isCreator ? "Creator" : "Member"})</span>
              </div>
            </div>
            <div class="flex gap-2">
              ${
                isCreator && project.status === "recruiting"
                  ? `<button onclick="findMembers('${project._id}')" class="btn btn-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                       <i class="fas fa-users"></i> Find Members
                     </button>`
                  : ""
              }
              ${
                isCreator && project.status !== "completed" && project.status !== "cancelled"
                  ? `<button onclick="updateProjectStatus('${project._id}')" class="btn btn-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                       <i class="fas fa-edit"></i> Update Status
                     </button>`
                  : ""
              }
            </div>
          </div>
          
          <p class="text-gray-600 text-sm mb-3">${project.description}</p>
          
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium">Category:</span> ${project.category || "other"}
            </div>
            <div>
              <span class="font-medium">Team:</span> ${teamCount}/${project.maxMembers} members
            </div>
            <div>
              <span class="font-medium">Required Skills:</span>
              <div class="flex flex-wrap gap-1 mt-1">
                ${(project.requiredSkills || [])
                  .map((skill) => `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${skill}</span>`)
                  .join("")}
              </div>
            </div>
            <div>
              <span class="font-medium">Created:</span> ${new Date(project.createdAt).toLocaleDateString()}
            </div>
          </div>

          ${project.status === "completed" ? generateFeedbackSection(project) : ""}
        </div>
      `
    })
    .join("")
}

// Generate feedback section for completed projects
function generateFeedbackSection(project) {
  return `
    <div class="feedback-section mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-md font-semibold text-gray-800 mb-3">Team Feedback</h4>
      <div id="feedback-${project._id}" class="feedback-container">
        <button onclick="loadFeedbackOptions('${project._id}')" class="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          <i class="fas fa-star"></i> Provide Feedback
        </button>
      </div>
    </div>
  `
}

// Load feedback options for a project
async function loadFeedbackOptions(projectId) {
  try {
    const response = await fetch(`/api/feedback/options/${projectId}`, {
      credentials: "include",
    })

    const result = await response.json()

    if (result.success) {
      displayFeedbackForm(projectId, result.feedbackOptions)
    } else {
      showNotification(result.message || "Failed to load feedback options", "error")
    }
  } catch (error) {
    console.error("Error loading feedback options:", error)
    showNotification("Error loading feedback options", "error")
  }
}

// Display feedback form
function displayFeedbackForm(projectId, feedbackOptions) {
  const container = document.getElementById(`feedback-${projectId}`)
  if (!container) return

  if (feedbackOptions.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No team members to provide feedback for.</p>'
    return
  }

  container.innerHTML = `
    <div class="feedback-form bg-gray-50 p-4 rounded-lg">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">Select Team Member</label>
        <select id="memberSelect-${projectId}" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="">Select a member...</option>
          ${feedbackOptions
            .filter((member) => !member.feedbackGiven && member._id !== currentUser.user._id)
            .map(
              (member) => `
            <option value="${member._id}">${member.name} (${member.role})</option>
          `,
            )
            .join("")}
        </select>
      </div>

      <div id="ratingForm-${projectId}" class="rating-form" style="display: none;">
        <h5 class="text-sm font-medium text-gray-700 mb-3">Rate this team member:</h5>
        
        <div class="grid grid-cols-1 gap-3 mb-4">
          <div class="rating-item">
            <label class="block text-sm text-gray-600 mb-1">Technical Skills:</label>
            <select name="technical" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div class="rating-item">
            <label class="block text-sm text-gray-600 mb-1">Communication:</label>
            <select name="communication" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div class="rating-item">
            <label class="block text-sm text-gray-600 mb-1">Teamwork:</label>
            <select name="teamwork" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div class="rating-item">
            <label class="block text-sm text-gray-600 mb-1">Reliability:</label>
            <select name="reliability" class="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Below Average</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm text-gray-600 mb-1">Comment (Optional):</label>
          <textarea name="comment" rows="3" class="w-full p-2 border border-gray-300 rounded-md" placeholder="Additional feedback..."></textarea>
        </div>

        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" name="isAnonymous" class="mr-2">
            <span class="text-sm text-gray-600">Submit as anonymous feedback</span>
          </label>
        </div>

        <div class="flex gap-2">
          <button onclick="submitFeedback('${projectId}')" class="btn bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Submit Feedback
          </button>
          <button onclick="cancelFeedback('${projectId}')" class="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  `

  // Add event listener for member selection
  const memberSelect = document.getElementById(`memberSelect-${projectId}`)
  memberSelect.addEventListener("change", (e) => {
    const ratingForm = document.getElementById(`ratingForm-${projectId}`)
    if (e.target.value) {
      ratingForm.style.display = "block"
    } else {
      ratingForm.style.display = "none"
    }
  })
}

// Submit feedback
async function submitFeedback(projectId) {
  const memberSelect = document.getElementById(`memberSelect-${projectId}`)
  const revieweeId = memberSelect.value

  if (!revieweeId) {
    showNotification("Please select a team member", "error")
    return
  }

  const ratingForm = document.getElementById(`ratingForm-${projectId}`)

  // Get ratings
  const ratings = {}
  const ratingSelects = ratingForm.querySelectorAll("select[name]")
  let allRatingsProvided = true

  ratingSelects.forEach((select) => {
    if (select.name !== "comment" && select.name !== "isAnonymous") {
      if (!select.value) {
        allRatingsProvided = false
      } else {
        ratings[select.name] = Number.parseInt(select.value)
      }
    }
  })

  if (!allRatingsProvided) {
    showNotification("Please provide all ratings", "error")
    return
  }

  // Get comment and anonymous flag
  const comment = ratingForm.querySelector('textarea[name="comment"]').value
  const isAnonymous = ratingForm.querySelector('input[name="isAnonymous"]').checked

  const feedbackData = {
    projectId,
    revieweeId,
    ratings,
    comment,
    isAnonymous,
  }

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(feedbackData),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Feedback submitted successfully!", "success")
      // Reload feedback options to update the form
      await loadFeedbackOptions(projectId)
    } else {
      showNotification(result.message || "Failed to submit feedback", "error")
    }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    showNotification("Error submitting feedback", "error")
  }
}

// Cancel feedback
function cancelFeedback(projectId) {
  const container = document.getElementById(`feedback-${projectId}`)
  container.innerHTML = `
    <button onclick="loadFeedbackOptions('${projectId}')" class="btn bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      <i class="fas fa-star"></i> Provide Feedback
    </button>
  `
}

// Get status badge HTML
function getStatusBadge(status) {
  const badges = {
    recruiting: '<span class="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">RECRUITING</span>',
    "in-progress": '<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">IN PROGRESS</span>',
    completed: '<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">COMPLETED</span>',
    cancelled: '<span class="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">CANCELLED</span>',
  }
  return (
    badges[status] || '<span class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">UNKNOWN</span>'
  )
}

// Load invitations
async function loadInvitations() {
  try {
    const response = await fetch("/api/projects/invitations", {
      credentials: "include",
    })

    const result = await response.json()

    if (result.success) {
      currentInvitations = result.invitations
      displayInvitations(currentInvitations)
    }
  } catch (error) {
    console.error("Error loading invitations:", error)
  }
}

// Display invitations
function displayInvitations(invitations) {
  const container = document.getElementById("invitationsList")
  if (!container) return

  if (invitations.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No pending invitations</p>'
    return
  }

  container.innerHTML = invitations
    .map(
      (invitation) => `
    <div class="invitation-card border rounded-lg p-4 mb-3 bg-white shadow-sm">
      <h4 class="font-semibold text-gray-800">${invitation.project.title}</h4>
      <p class="text-sm text-gray-600 mb-2">From: ${invitation.sender.name}</p>
      <p class="text-sm text-gray-600 mb-3">${invitation.message || "No message provided"}</p>
      <div class="flex gap-2">
        <button onclick="handleInvitation('${invitation._id}', 'accept')" class="btn bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
          Accept
        </button>
        <button onclick="handleInvitation('${invitation._id}', 'reject')" class="btn bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
          Decline
        </button>
      </div>
    </div>
  `,
    )
    .join("")
}

// Handle invitation response
async function handleInvitation(invitationId, action) {
  try {
    const response = await fetch("/api/projects/handle-invitation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ invitationId, action }),
    })

    const result = await response.json()

    if (result.success) {
      showNotification(`Invitation ${action}ed successfully!`, "success")
      await loadInvitations()
      await loadUserProjects()
    } else {
      showNotification(result.message || `Failed to ${action} invitation`, "error")
    }
  } catch (error) {
    console.error(`Error ${action}ing invitation:`, error)
    showNotification(`Error ${action}ing invitation`, "error")
  }
}

// Update project status
async function updateProjectStatus(projectId) {
  const newStatus = prompt("Enter new status (recruiting, in-progress, completed, cancelled):")
  if (!newStatus) return

  const validStatuses = ["recruiting", "in-progress", "completed", "cancelled"]
  if (!validStatuses.includes(newStatus)) {
    showNotification("Invalid status. Use: recruiting, in-progress, completed, or cancelled", "error")
    return
  }

  try {
    const response = await fetch("/api/projects/status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ projectId, status: newStatus }),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("Project status updated successfully!", "success")
      await loadUserProjects()
    } else {
      showNotification(result.message || "Failed to update project status", "error")
    }
  } catch (error) {
    console.error("Error updating project status:", error)
    showNotification("Error updating project status", "error")
  }
}

// Filter projects
function filterProjects() {
  const filterValue = document.getElementById("projectFilter").value
  let filteredProjects = currentProjects

  if (filterValue !== "all") {
    filteredProjects = currentProjects.filter((project) => project.status === filterValue)
  }

  displayProjects(filteredProjects)
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
    type === "success"
      ? "bg-green-500 text-white"
      : type === "error"
        ? "bg-red-500 text-white"
        : "bg-blue-500 text-white"
  }`
  notification.textContent = message

  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Load recommendations (placeholder)
async function loadRecommendations(projectId) {
  // This would load user recommendations for the project
  console.log("Loading recommendations for project:", projectId)
}

// Find members (placeholder)
function findMembers(projectId) {
  // This would open a modal or navigate to find members page
  console.log("Finding members for project:", projectId)
}

// Password validation function
function validatePassword(password) {
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasDigit = /\d/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
  const minLength = password.length >= 6

  return {
    isValid: hasLetter && hasDigit && hasSymbol && minLength,
    hasLetter,
    hasDigit,
    hasSymbol,
    minLength,
  }
}

// Show password requirements
function showPasswordRequirements() {
  const requirements = document.getElementById("password-requirements")
  if (!requirements) {
    const passwordField = document.getElementById("password")
    if (passwordField) {
      const reqDiv = document.createElement("div")
      reqDiv.id = "password-requirements"
      reqDiv.innerHTML = `
        <div style="font-size: 12px; color: #666; margin-top: 8px; border: 1px solid #ddd; padding: 12px; border-radius: 6px; background-color: #f8f9fa;">
          <strong style="color: #333;">🔒 Password Requirements:</strong>
          <ul style="margin: 8px 0; padding-left: 20px; list-style: none;">
            <li id="req-letter" style="margin: 4px 0;">❌ At least one letter (a-z, A-Z)</li>
            <li id="req-digit" style="margin: 4px 0;">❌ At least one digit (0-9)</li>
            <li id="req-symbol" style="margin: 4px 0;">❌ At least one special character (!@#$%^&*)</li>
            <li id="req-length" style="margin: 4px 0;">❌ At least 6 characters</li>
          </ul>
          <div id="password-status" style="margin-top: 8px; font-weight: bold; color: #dc3545;">
            ⚠️ Password does not meet requirements
          </div>
        </div>
      `
      passwordField.parentNode.insertBefore(reqDiv, passwordField.nextSibling)
    }
  }
}

// Update password requirements display
function updatePasswordRequirements(password) {
  const validation = validatePassword(password)

  const updateReq = (id, isValid, text) => {
    const elem = document.getElementById(id)
    if (elem) {
      elem.style.color = isValid ? "#28a745" : "#dc3545"
      elem.innerHTML = `${isValid ? "✅" : "❌"} ${text}`
    }
  }

  updateReq("req-letter", validation.hasLetter, "At least one letter (a-z, A-Z)")
  updateReq("req-digit", validation.hasDigit, "At least one digit (0-9)")
  updateReq("req-symbol", validation.hasSymbol, "At least one special character (!@#$%^&*)")
  updateReq("req-length", validation.minLength, "At least 6 characters")

  // Update password status
  const statusDiv = document.getElementById("password-status")
  if (statusDiv) {
    if (validation.isValid) {
      statusDiv.innerHTML = "✅ Password meets all requirements!"
      statusDiv.style.color = "#28a745"
    } else {
      statusDiv.innerHTML = "⚠️ Password does not meet requirements"
      statusDiv.style.color = "#dc3545"
    }
  }

  // Update submit button state
  const submitButton = document.querySelector('button[type="submit"]')
  if (submitButton) {
    if (validation.isValid) {
      submitButton.disabled = false
      submitButton.style.opacity = "1"
      submitButton.style.cursor = "pointer"
      submitButton.style.backgroundColor = "#007bff"
      submitButton.title = "Click to create account"
    } else {
      submitButton.disabled = true
      submitButton.style.opacity = "0.6"
      submitButton.style.cursor = "not-allowed"
      submitButton.style.backgroundColor = "#6c757d"
      submitButton.title = "Password must meet all requirements"
    }
  }
}

// Block form submission if password is invalid
function blockInvalidSubmission(password) {
  const validation = validatePassword(password)

  if (!validation.isValid) {
    const missingRequirements = []

    if (!validation.hasLetter) missingRequirements.push("• At least one letter")
    if (!validation.hasDigit) missingRequirements.push("• At least one digit")
    if (!validation.hasSymbol) missingRequirements.push("• At least one special character")
    if (!validation.minLength) missingRequirements.push("• At least 6 characters")

    alert(
      `🚫 ACCOUNT CREATION BLOCKED!\n\nYour password is missing:\n${missingRequirements.join("\n")}\n\nPlease fix your password to create an account.`,
    )
    return false
  }
  return true
}

// Main event listener
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form")

  if (form) {
    // Initially disable submit button
    const submitButton = document.querySelector('button[type="submit"]')
    if (submitButton) {
      submitButton.disabled = true
      submitButton.style.opacity = "0.6"
      submitButton.style.cursor = "not-allowed"
      submitButton.style.backgroundColor = "#6c757d"
      submitButton.title = "Password must meet all requirements"
    }

    // Form submission handler
    form.addEventListener("submit", async (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const university = document.getElementById("university").value
      const password = document.getElementById("password").value
      const studentId = document.getElementById("studentId").value

      // STRICT PASSWORD VALIDATION - BLOCKS SUBMISSION
      if (!blockInvalidSubmission(password)) {
        return // Stop form submission
      }

      try {
        const response = await axios.post("/signup", {
          name,
          email,
          university,
          studentId,
          password,
        })

        alert("🎉 SUCCESS! " + response.data.message)
        window.location.href = "/login"
      } catch (error) {
        if (error.response) {
          alert("❌ ERROR: " + error.response.data.message)
        } else {
          alert("❌ An error occurred. Please try again.")
        }
      }
    })

    // Password field event listeners
    const passwordField = document.getElementById("password")
    if (passwordField) {
      passwordField.addEventListener("focus", showPasswordRequirements)
      passwordField.addEventListener("input", function () {
        updatePasswordRequirements(this.value)
      })
      passwordField.addEventListener("blur", function () {
        if (this.value.length > 0) {
          const validation = validatePassword(this.value)
          if (!validation.isValid) {
            this.style.borderColor = "#dc3545"
            this.style.boxShadow = "0 0 0 0.2rem rgba(220, 53, 69, 0.25)"
          } else {
            this.style.borderColor = "#28a745"
            this.style.boxShadow = "0 0 0 0.2rem rgba(40, 167, 69, 0.25)"
          }
        }
      })
    }
  }
})

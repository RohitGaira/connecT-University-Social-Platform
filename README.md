# connecT – University Social Platform

![Platform](https://img.shields.io/badge/Platform-University%20Social%20Network-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-v16.0.0+-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Core Features Documentation](#core-features-documentation)
- [Algorithms & Services](#algorithms--services)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

**connecT** is a comprehensive social networking platform specifically tailored for university students. It's designed to foster collaboration, communication, and community engagement within the academic ecosystem. The platform enables students to discover peers, form project teams, exchange real-time messages, and participate in campus events.

### Vision

To create a vibrant, connected campus community where students can:
- **Network** with like-minded peers based on interests and skills
- **Collaborate** on academic and non-academic projects
- **Communicate** seamlessly through real-time messaging
- **Discover** events, opportunities, and team-building experiences
- **Grow** professionally through meaningful connections and partnerships

## Key Features

### 1. **User Authentication & Profiles** 🔐
- Secure signup and login system with bcrypt password hashing
- User role management
- Comprehensive profile creation and management
- Profile pictures and personal information
- Skills and interests tracking

### 2. **Friend Discovery & Recommendations** 👥
- Advanced friend finder with search functionality
- AI-powered recommendation algorithms based on:
  - Shared interests and skills
  - Compatible study habits
  - Academic focus areas
  - Project collaboration history
- Friend request management
- Friend list management

### 3. **Real-Time Messaging** 💬
- One-to-one real-time chat interface using Socket.io
- Persistent conversation history with MongoDB
- Message notifications
- User online/offline status tracking
- Conversation management

### 4. **Project Collaboration System** 🚀
- Create and manage academic/non-academic projects
- Project posting and discovery
- Team member recommendations for specific projects
- Skill-based matching for team formation
- Project application and invitation system
- Project feedback and rating system

### 5. **Team Finding & Matching** 🤝
- Smart team member recommendations
- Skill-based matching algorithms
- Compatibility scoring
- Interest-based team formation
- Feedback aggregation for team quality

### 6. **Event Board** 📅
- View and discover campus events and activities
- Event participation tracking
- Event filtering and search
- Campus community engagement

### 7. **Feedback System** ⭐
- User feedback and ratings
- Project-specific feedback
- Team collaboration feedback
- Feedback aggregation for insights

## Tech Stack

### Backend
- **Runtime**: Node.js (v16.0.0+)
- **Framework**: Express.js (v4.21.2)
- **Real-Time Communication**: Socket.io (v4.8.1)
- **Database**: MongoDB with Mongoose (v8.16.0)
- **Authentication**: JWT + Session-based (express-session)
- **Password Security**: bcryptjs (v2.4.3)
- **Validation**: express-validator (v7.0.1)
- **Security**: Helmet (v7.1.0), CORS (v2.8.5)
- **Rate Limiting**: express-rate-limit (v7.1.5)
- **File Upload**: Multer (v1.4.5-lts.1)

### Frontend
- **HTML5** for structure
- **CSS3** for styling with modern, responsive design
- **Vanilla JavaScript** for interactivity
- **Socket.io Client** for real-time communication
- **Modern, playful, and professional UI**

### Development Tools
- **Package Manager**: npm (v8.0.0+)
- **Development Server**: Nodemon (v3.0.2)
- **Testing**: Jest (v29.7.0) with Supertest (v6.3.3)

## Project Structure

```
connecT-University-Social-Platform/
├── project2/                          # Main application directory
│   ├── app.js                         # Express server setup
│   ├── package.json                   # Project dependencies
│   ├── .gitignore                     # Git ignore rules
│   │
│   ├── public/                        # Frontend files (static assets)
│   │   ├── index.html                 # Home page
│   │   ├── login.html                 # Login page
│   │   ├── signup.html                # Registration page
│   │   ├── profile.html               # User profile page
│   │   ├── users.html                 # Find users/friends page
│   │   ├── chat.html                  # Real-time messaging
│   │   ├── recommendations.html       # Friend & team recommendations
│   │   ├── project-collaboration.html # Project collaboration
│   │   ├── create-project.html        # Create new project
│   │   ├── projects.html              # Browse projects
│   │   ├── find-team-members.html     # Find team members
│   │   ├── collaboration.html         # Team collaboration
│   │   ├── events.html                # Campus events
│   │   ├── css/                       # Stylesheets
│   │   └── js/                        # Frontend JavaScript
│   │
│   ├── models/                        # MongoDB schemas
│   │   ├── userSchema.js              # User model
│   │   ├── messageSchema.js           # Message model
│   │   ├── conversationSchema.js      # Conversation model
│   │   ├── friendshipSchema.js        # Friendship model
│   │   ├── projectSchema.js           # Project collaboration model
│   │   ├── projectApplicationSchema.js# Project application model
│   │   ├── projectInvitationSchema.js # Project invitation model
│   │   ├── skillSchema.js             # Skill model
│   │   ├── interestSchema.js          # Interest model
│   │   ├── feedbackSchema.js          # Feedback model
│   │   ├── projectFeedbackSchema.js   # Project feedback model
│   │   ├── Team.js                    # Team model
│   │   └── Event.js                   # Event model
│   │
│   ├── routes/                        # API route handlers
│   │   ├── api.js                     # Main API setup
│   │   ├── userRoutes.js              # User authentication & profile
│   │   ├── chatRoutes.js              # Messaging endpoints
│   │   ├── recommendationRoutes.js    # Recommendation endpoints
│   │   ├── profileRoutes.js           # Profile management
│   │   ├── projectRoutes.js           # Project management
│   │   ├── teamRoutes.js              # Team management
│   │   ├── friendRoutes.js            # Friend management
│   │   ├── collaborationRoutes.js     # Collaboration endpoints
│   │   ├── feedbackRoutes.js          # Feedback endpoints
│   │   ├── homeroutes.js              # Home page routes
│   │   └── userRoutes.js              # Additional user routes
│   │
│   ├── controllers/                   # Business logic handlers
│   │   └── [Controller files for each route]
│   │
│   ├── services/                      # Business logic services
│   │   ├── recommendationService.js   # Friend recommendation logic
│   │   ├── friendshipService.js       # Friendship operations
│   │   ├── projectCollaborationService.js # Project collaboration logic
│   │   └── [Other service files]
│   │
│   ├── utils/                         # Utility functions & algorithms
│   │   ├── recommendationAlgorithm.js # Friend matching algorithm
│   │   ├── recommendationGenerator.js # Recommendation generation
│   │   ├── skillMatcher.js            # Skill matching logic
│   │   ├── interestSimilarityCalculator.js # Interest matching
│   │   ├── matchScoreCalculator.js    # Match scoring
│   │   ├── feedbackAggregator.js      # Feedback aggregation
│   │   ├── compatibilityCalculator.js # Compatibility scoring
│   │   ├── projectMatchingAlgorithm.js# Project team matching
│   │   ├── teamRecommendationAlgorithm.js # Team recommendations
│   │   ├── consolidatedRecommendationAlgorithms.js # Main algorithms
│   │   ├── consolidatedProjectMatching.js # Project matching
│   │   ├── findPotentialFriendsWithMetrics.js # Friend discovery
│   │   ├── passwordUtils.js           # Password utilities
│   │   ├── cacheUtils.js              # In-memory caching
│   │   └── [Other utility files]
│   │
│   ├── middleware/                    # Express middleware
│   │   └── [Authentication, validation, error handling]
│   │
│   ├── modules/                       # Feature modules
│   │   └── [Feature-specific modules]
│   │
│   └── scripts/                       # Utility scripts
│       └── seedData.js                # Database seeding script

├── CONSOLIDATION_SUMMARY.md           # Information about feature consolidation
├── CONSOLIDATION_VERIFICATION.md      # Consolidation verification details
├── update_log.md                      # Update and change log
└── README.md                          # This file
```

## Installation & Setup

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **Git**: For version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/RohitGaira/connecT-University-Social-Platform.git
cd connecT-University-Social-Platform/project2
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js and middleware
- Mongoose for MongoDB connection
- Socket.io for real-time communication
- Authentication libraries
- Validation and security packages

### Step 3: Create Environment Configuration

Create a `.env` file in the `project2` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/connect-university
# Or use MongoDB Atlas:
# MONGODB_URI=******cluster.mongodb.net/connect-university

# Session & Authentication
SESSION_SECRET=your-secret-key-here-change-in-production
JWT_SECRET=your-jwt-secret-key-here

# Email Configuration (optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=./public/uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Database Connection

Ensure MongoDB is running:

**For local MongoDB:**
```bash
mongod
```

**For MongoDB Atlas:**
- Create a cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string and add it to `.env`

### Step 5: Seed Sample Data (Optional)

```bash
npm run seed
```

This will populate the database with sample users, projects, and events for testing.

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment type | development |
| `MONGODB_URI` | MongoDB connection string | Required |
| `SESSION_SECRET` | Session encryption key | Required |
| `JWT_SECRET` | JWT signing key | Required |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_WINDOW` | Rate limit window in minutes | 15 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### Server Configuration

The application runs on the specified PORT (default: 3000). Key middleware includes:
- **CORS**: Enabled for cross-origin requests
- **Helmet**: Adds security headers
- **Rate Limiting**: Prevents abuse
- **Compression**: Compresses responses
- **Session Management**: Persistent user sessions

## Running the Application

### Development Mode

```bash
npm run dev
```

This runs the server with **Nodemon**, which automatically restarts when files change.

### Production Mode

```bash
npm start
```

This runs the server normally.

### Testing

```bash
npm test
```

Runs the test suite using Jest.

### Health Check

Once running, verify the server is healthy:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-06-24T06:35:18.919Z",
  "uptime": 45.123
}
```

## API Endpoints

### Authentication & User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/signup` | User registration |
| `POST` | `/api/users/login` | User login |
| `POST` | `/api/users/logout` | User logout |
| `GET` | `/api/users/profile/:id` | Get user profile |
| `PUT` | `/api/users/profile/:id` | Update user profile |
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/search` | Search users |

### Friend Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/friends/send-request/:userId` | Send friend request |
| `POST` | `/api/friends/accept-request/:requestId` | Accept friend request |
| `POST` | `/api/friends/reject-request/:requestId` | Reject friend request |
| `GET` | `/api/friends/:userId` | Get friend list |
| `DELETE` | `/api/friends/remove/:friendId` | Remove friend |
| `GET` | `/api/friends/pending/:userId` | Get pending requests |

### Messaging & Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/messages` | Send message |
| `GET` | `/api/messages/:conversationId` | Get messages |
| `GET` | `/api/conversations/:userId` | Get user conversations |
| `DELETE` | `/api/messages/:messageId` | Delete message |

### Recommendations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/recommendations/friends/:userId` | Get friend recommendations |
| `GET` | `/api/recommendations/team-members/:projectId` | Get team member recommendations |
| `GET` | `/api/recommendations/projects/:userId` | Get project recommendations |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects` | Get all projects |
| `GET` | `/api/projects/:id` | Get project details |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/projects/:id/apply` | Apply to project |
| `POST` | `/api/projects/:id/invite` | Invite team member |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/teams` | Create team |
| `GET` | `/api/teams` | Get all teams |
| `GET` | `/api/teams/:id` | Get team details |
| `POST` | `/api/teams/:id/members` | Add team member |
| `DELETE` | `/api/teams/:id/members/:memberId` | Remove team member |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/events` | Get all events |
| `POST` | `/api/events` | Create event |
| `GET` | `/api/events/:id` | Get event details |
| `POST` | `/api/events/:id/join` | Join event |
| `POST` | `/api/events/:id/leave` | Leave event |

### Feedback

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/feedback` | Submit feedback |
| `GET` | `/api/feedback/:userId` | Get user feedback |
| `GET` | `/api/feedback/project/:projectId` | Get project feedback |

## Database Models

### User Schema
Stores user account information, credentials, and profile details.

**Fields:**
- `username` (String, unique)
- `email` (String, unique)
- `password` (String, hashed)
- `firstName`, `lastName` (String)
- `bio` (String)
- `profilePicture` (String, URL)
- `skills` (Array of ObjectIds)
- `interests` (Array of ObjectIds)
- `createdAt`, `updatedAt` (Date)

### Message Schema
Stores individual messages in conversations.

**Fields:**
- `conversationId` (ObjectId)
- `sender` (ObjectId)
- `content` (String)
- `timestamp` (Date)
- `isRead` (Boolean)

### Conversation Schema
Manages conversation threads between users.

**Fields:**
- `participants` (Array of ObjectIds)
- `lastMessage` (String)
- `updatedAt` (Date)
- `createdAt` (Date)

### Project Schema
Stores project collaboration details.

**Fields:**
- `title` (String)
- `description` (String)
- `creator` (ObjectId)
- `members` (Array of ObjectIds)
- `skills` (Array of Strings)
- `status` (String: active, completed, paused)
- `deadline` (Date)
- `createdAt`, `updatedAt` (Date)

### Friendship Schema
Manages friend relationships and requests.

**Fields:**
- `user1` (ObjectId)
- `user2` (ObjectId)
- `status` (String: pending, accepted, blocked)
- `requestedAt` (Date)
- `acceptedAt` (Date)

### Skill & Interest Schemas
Store skills and interests with descriptions.

**Fields:**
- `name` (String)
- `description` (String)
- `category` (String)

### Feedback Schema
Stores user feedback and ratings.

**Fields:**
- `fromUser` (ObjectId)
- `toUser` (ObjectId)
- `rating` (Number: 1-5)
- `comment` (String)
- `createdAt` (Date)

### Team & Event Models
Store team and event information with member and participant tracking.

## Core Features Documentation

### 1. Friend Recommendation System

The platform uses advanced algorithms to suggest compatible friends:

**Algorithm Components:**
- **Shared Interests**: Matches users with overlapping interests
- **Skill Compatibility**: Identifies complementary skill sets
- **Academic Focus**: Aligns users in similar fields
- **Collaboration History**: Considers past team interactions

**Location:** `/project2/utils/recommendationAlgorithm.js`

### 2. Project Team Matching

Smart matching for assembling effective project teams:

**Features:**
- Skill-based member discovery
- Compatibility scoring
- Interest alignment
- Workload balancing

**Location:** `/project2/utils/projectMatchingAlgorithm.js`

### 3. Real-Time Chat System

Socket.io powered real-time messaging:

**Features:**
- Bidirectional communication
- Message persistence
- Online status tracking
- Notification support
- Conversation history

**Location:** `/project2/routes/chatRoutes.js`

### 4. Feedback Aggregation

Comprehensive feedback system for users and projects:

**Components:**
- User ratings and reviews
- Project quality metrics
- Team collaboration feedback
- Performance insights

**Location:** `/project2/utils/feedbackAggregator.js`

## Algorithms & Services

### Smart Recommendation Engine

**File:** `/project2/utils/consolidatedRecommendationAlgorithms.js`

Combines multiple algorithms for accurate recommendations:
- Interest similarity scoring
- Skill compatibility matching
- Project matching with team formation
- Dynamic score weighting

### Recommendation Service

**File:** `/project2/services/recommendationService.js`

Provides high-level recommendation operations:
- Generate friend recommendations
- Create team recommendations
- Filter and rank suggestions
- Cache results for performance

### Project Collaboration Service

**File:** `/project2/services/projectCollaborationService.js`

Manages project-related operations:
- Project creation and management
- Team formation
- Member assignment
- Project feedback

### Cache Utilities

**File:** `/project2/utils/cacheUtils.js`

In-memory caching for performance:
- Store and retrieve cached recommendations
- Manage cache expiration
- Improve response times

## Contributing

We welcome contributions from the community! Here's how to get started:

### Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Write clean, readable code
   - Add comments for complex logic

3. **Test Your Changes**
   ```bash
   npm test
   ```

4. **Commit Your Changes**
   ```bash
   git commit -m "feat: describe your changes"
   ```

5. **Push to Your Branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Ensure CI/CD tests pass

### Code Style Guidelines

- Use meaningful variable and function names
- Keep functions focused and modular
- Add error handling
- Include comments for complex logic
- Follow existing code patterns

### Reporting Issues

Found a bug? Create an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Problem:** `MongoServerError` or connection timeout

**Solutions:**
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env` file
- Verify network connection for MongoDB Atlas
- Check MongoDB credentials and network access

#### 2. Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::3000`

**Solutions:**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use a different port
PORT=3001 npm start
```

#### 3. Socket.io Connection Issues

**Problem:** Real-time chat not working

**Solutions:**
- Check browser console for errors
- Verify Socket.io is properly initialized
- Ensure CORS configuration allows connections
- Check firewall/proxy settings

#### 4. Module Not Found Error

**Problem:** `Cannot find module 'express'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 5. Authentication Issues

**Problem:** Unable to login or register

**Solutions:**
- Check user exists in database
- Verify password is correctly hashed
- Check session/JWT configuration
- Clear browser cookies and try again

#### 6. Email Not Sending

**Problem:** Email notifications not working

**Solutions:**
- Verify email credentials in `.env`
- Check email provider settings
- Enable "Less secure app access" (if using Gmail)
- Check server logs for errors

### Performance Optimization

#### Enable Caching

The platform includes built-in caching:
- Recommendations are cached to reduce computation
- Check `cacheUtils.js` for cache settings

#### Database Indexing

Ensure MongoDB indexes are created:
```javascript
// Add to userSchema.js
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ interests: 1 });
```

#### Load Testing

Test under load with Apache Bench:
```bash
ab -n 100 -c 10 http://localhost:3000/health
```

## License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## Support & Community

- **Issues**: Report bugs on [GitHub Issues](https://github.com/RohitGaira/connecT-University-Social-Platform/issues)
- **Discussions**: Join community discussions
- **Wiki**: Check the project wiki for additional resources

## Acknowledgments

Thank you to all contributors and the university community for feedback and support in making connecT a vibrant platform for academic collaboration and social engagement.

---

**Built with ❤️ for university students and their collaborative journey**

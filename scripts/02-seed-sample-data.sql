-- Seed sample data for demonstration

-- Insert sample users (extending existing user system)
INSERT IGNORE INTO user_skills (user_id, skill, proficiency_level) VALUES
('user1', 'JavaScript', 'advanced'),
('user1', 'React', 'advanced'),
('user1', 'Node.js', 'intermediate'),
('user1', 'Python', 'beginner'),
('user2', 'Python', 'expert'),
('user2', 'Machine Learning', 'advanced'),
('user2', 'Data Science', 'advanced'),
('user2', 'JavaScript', 'intermediate'),
('user3', 'UI/UX Design', 'advanced'),
('user3', 'React', 'intermediate'),
('user3', 'JavaScript', 'intermediate'),
('user3', 'Figma', 'expert'),
('user4', 'Java', 'advanced'),
('user4', 'Spring Boot', 'advanced'),
('user4', 'Database Design', 'advanced'),
('user4', 'Python', 'intermediate');

INSERT IGNORE INTO user_interests (user_id, interest) VALUES
('user1', 'Web Development'),
('user1', 'Mobile Apps'),
('user1', 'Startups'),
('user2', 'AI/ML'),
('user2', 'Data Science'),
('user2', 'Research'),
('user3', 'Design'),
('user3', 'User Experience'),
('user3', 'Creative Tech'),
('user4', 'Backend Development'),
('user4', 'System Architecture'),
('user4', 'Enterprise Software');

-- Insert sample projects
INSERT INTO projects (id, title, description, creator_id, team_size, current_members, required_skills, preferred_interests, duration, status) VALUES
('proj1', 'AI-Powered Study Assistant', 'Building an intelligent study companion using machine learning to help students optimize their learning process. The application will analyze study patterns, recommend resources, and provide personalized learning paths.', 'user2', 4, 2, '["Python", "Machine Learning", "React", "API Development"]', '["AI/ML", "Education Tech", "Data Science"]', '3 months', 'recruiting'),
('proj2', 'Campus Event Management App', 'A comprehensive mobile application for managing campus events, RSVPs, and social networking. Features include event discovery, calendar integration, and social features.', 'user1', 5, 3, '["React Native", "Node.js", "MongoDB", "UI/UX Design"]', '["Mobile Apps", "Social Networking", "Campus Life"]', '4 months', 'in_progress'),
('proj3', 'Sustainable Campus Initiative', 'Web platform to track and gamify sustainability efforts on campus. Students can log eco-friendly activities, compete in challenges, and see real-time campus environmental impact.', 'user3', 3, 1, '["React", "Node.js", "Data Visualization", "UI/UX Design"]', '["Environmental Tech", "Social Impact", "Web Development"]', '2 months', 'recruiting'),
('proj4', 'Student Marketplace Platform', 'E-commerce platform specifically for students to buy, sell, and trade textbooks, furniture, and other items. Includes secure payments and campus-specific features.', 'user4', 4, 2, '["Java", "Spring Boot", "React", "Payment Integration", "Database Design"]', '["E-commerce", "Student Services", "Web Development"]', '5 months', 'completed');

-- Insert project members
INSERT INTO project_members (project_id, user_id, role, joined_at) VALUES
('proj1', 'user2', 'Project Lead', '2024-01-15 10:00:00'),
('proj1', 'user1', 'Frontend Developer', '2024-01-20 14:30:00'),
('proj2', 'user1', 'Project Lead', '2024-01-10 09:00:00'),
('proj2', 'user3', 'UI/UX Designer', '2024-01-12 11:00:00'),
('proj2', 'user4', 'Backend Developer', '2024-01-18 16:00:00'),
('proj3', 'user3', 'Project Lead', '2024-02-01 10:00:00'),
('proj4', 'user4', 'Project Lead', '2023-12-01 10:00:00'),
('proj4', 'user1', 'Frontend Developer', '2023-12-05 14:00:00');

-- Insert sample applications
INSERT INTO project_applications (project_id, user_id, message, status, applied_at) VALUES
('proj1', 'user3', 'I have experience with UI/UX design and would love to help create an intuitive interface for the study assistant. I can also contribute to user research and testing.', 'pending', '2024-01-22 10:30:00'),
('proj1', 'user4', 'I have strong backend development skills with Java and Python. I can help with API development and database design for the ML components.', 'pending', '2024-01-23 15:45:00'),
('proj3', 'user2', 'I am passionate about environmental sustainability and have data science skills that could help with impact tracking and analytics.', 'pending', '2024-02-03 12:00:00'),
('proj3', 'user4', 'I can contribute to the backend development and help with data visualization components.', 'pending', '2024-02-04 09:15:00');

-- Insert sample feedback (for completed projects)
INSERT INTO project_feedback (project_id, from_user_id, to_user_id, technical_rating, communication_rating, teamwork_rating, reliability_rating, overall_rating, comment, is_anonymous) VALUES
('proj4', 'user4', 'user1', 4, 5, 4, 5, 4, 'Great frontend developer with excellent communication skills. Always delivered on time and helped other team members when needed.', FALSE),
('proj4', 'user1', 'user4', 5, 4, 4, 5, 5, 'Outstanding technical leadership and backend architecture. Very reliable and knowledgeable about best practices.', FALSE);

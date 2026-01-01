# Geriacare Backend API Schema & Endpoints

## Overview

This document outlines the complete backend API schema and endpoints for the Geriacare application. The backend should support authentication, user management, care questions, insights, caregiver management, and feedback functionality.

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Auth Tokens Table

```sql
CREATE TABLE auth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auth_tokens_user_id ON auth_tokens(user_id);
CREATE INDEX idx_auth_tokens_token ON auth_tokens(refresh_token);
```

### Care Questions Table

```sql
CREATE TABLE care_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    relation VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_care_questions_user_id ON care_questions(user_id);
CREATE INDEX idx_care_questions_status ON care_questions(status);
CREATE INDEX idx_care_questions_created_at ON care_questions(created_at);
```

### Question Messages Table

```sql
CREATE TABLE question_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES care_questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'admin')),
    sender_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_question_messages_question_id ON question_messages(question_id);
CREATE INDEX idx_question_messages_created_at ON question_messages(created_at);
```

### Insights Table

```sql
CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    category VARCHAR(100) NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id),
    author_name VARCHAR(255) NOT NULL,
    published_at TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insights_category ON insights(category);
CREATE INDEX idx_insights_published ON insights(is_published, published_at);
CREATE INDEX idx_insights_author ON insights(author_id);
```

### Caregivers Table

```sql
CREATE TABLE caregivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    experience_years INTEGER NOT NULL DEFAULT 0,
    city VARCHAR(255) NOT NULL,
    languages TEXT[], -- Array of languages
    skills TEXT[], -- Array of skills
    availability VARCHAR(20) DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
    contact_info TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_caregivers_city ON caregivers(city);
CREATE INDEX idx_caregivers_availability ON caregivers(availability);
CREATE INDEX idx_caregivers_verified ON caregivers(verified);
```

### Feedback Table

```sql
CREATE TABLE feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    feedback_type VARCHAR(100),
    message TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "user@example.com",
    "password": "securepassword"
}
```

**Response:**

```json
{
    "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "USER",
        "isEmailVerified": false,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    },
    "tokens": {
        "access": {
            "token": "jwt-access-token",
            "expires": "2024-01-01T00:15:00Z"
        },
        "refresh": {
            "token": "jwt-refresh-token",
            "expires": "2024-01-08T00:00:00Z"
        }
    }
}
```

#### POST /api/auth/login

Authenticate user and get tokens.

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "securepassword"
}
```

**Response:** Same as register response.

#### POST /api/auth/logout

Logout user and invalidate tokens.

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response:**

```json
{
    "message": "Logout successful"
}
```

#### POST /api/auth/refresh-tokens

Refresh access token using refresh token.

**Request Body:**

```json
{
    "refreshToken": "jwt-refresh-token"
}
```

**Response:** Same as login response with new tokens.

#### POST /api/auth/verify-email

Verify email address with token.

**Request Body:**

```json
{
    "token": "email-verification-token"
}
```

#### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**

```json
{
    "email": "user@example.com"
}
```

#### POST /api/auth/reset-password

Reset password with token.

**Request Body:**

```json
{
    "token": "password-reset-token",
    "password": "newpassword"
}
```

### Care Questions Endpoints

#### GET /api/questions

Get user's care questions (with pagination).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status ('pending' | 'answered')

**Response:**

```json
{
    "results": [
        {
            "id": "uuid",
            "name": "John Doe",
            "city": "Mumbai",
            "relation": "son",
            "phone": "+919876543210",
            "content": "My father is having trouble eating...",
            "status": "pending",
            "createdAt": "2024-01-01T00:00:00Z",
            "updatedAt": "2024-01-01T00:00:00Z"
        }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "totalResults": 1
}
```

#### POST /api/questions

Submit a new care question.

**Request Body:**

```json
{
    "name": "John Doe",
    "city": "Mumbai",
    "relation": "son",
    "phone": "+919876543210",
    "content": "My father is having trouble eating solid foods. What should I do?"
}
```

**Response:**

```json
{
    "id": "uuid",
    "name": "John Doe",
    "city": "Mumbai",
    "relation": "son",
    "phone": "+919876543210",
    "content": "My father is having trouble eating...",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### GET /api/questions/:id

Get specific question details.

#### POST /api/questions/:id/messages

Send message in question chat.

**Request Body:**

```json
{
    "content": "Thank you for the advice!"
}
```

#### GET /api/questions/:id/messages

Get question chat messages.

**Response:**

```json
{
    "results": [
        {
            "id": "uuid",
            "questionId": "uuid",
            "content": "Here's what you can do...",
            "sender": "admin",
            "createdAt": "2024-01-01T00:00:00Z"
        }
    ]
}
```

### Insights Endpoints

#### GET /api/insights

Get published insights (with pagination and filtering).

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `search` (optional): Search in title and content

**Response:**

```json
{
    "results": [
        {
            "id": "uuid",
            "title": "Healthy Eating Tips for Seniors",
            "excerpt": "Simple nutrition guidelines...",
            "category": "Food & Nutrition",
            "author": "Dr. Smith",
            "publishedAt": "2024-01-01T00:00:00Z"
        }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalResults": 50
}
```

#### GET /api/insights/:id

Get full insight article.

**Response:**

```json
{
    "id": "uuid",
    "title": "Healthy Eating Tips for Seniors",
    "content": "Full article content here...",
    "category": "Food & Nutrition",
    "excerpt": "Simple nutrition guidelines...",
    "author": "Dr. Smith",
    "publishedAt": "2024-01-01T00:00:00Z"
}
```

#### GET /api/insights/categories

Get available insight categories.

**Response:**

```json
{
    "categories": ["Food & Nutrition", "Bathing & Hygiene", "Daily Routine", "Emotional Wellbeing", "General Care"]
}
```

### Caregivers Endpoints

#### GET /api/caregivers

Get caregiver listings (with pagination and filtering).

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `city` (optional): Filter by city
- `experience` (optional): Minimum experience years
- `availability` (optional): Filter by availability status
- `search` (optional): Search in name and skills

**Response:**

```json
{
    "results": [
        {
            "id": "uuid",
            "name": "Sunita Sharma",
            "photo": "https://example.com/photo.jpg",
            "experience": 5,
            "city": "Mumbai",
            "languages": ["Hindi", "English", "Marathi"],
            "skills": ["Elderly Care", "Medication Management", "Physiotherapy Support"],
            "availability": "available",
            "verified": true
        }
    ],
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "totalResults": 25
}
```

#### GET /api/caregivers/:id

Get detailed caregiver profile.

**Response:**

```json
{
    "id": "uuid",
    "name": "Sunita Sharma",
    "photo": "https://example.com/photo.jpg",
    "experience": 5,
    "city": "Mumbai",
    "languages": ["Hindi", "English", "Marathi"],
    "skills": ["Elderly Care", "Medication Management", "Physiotherapy Support"],
    "availability": "available",
    "contactInfo": "Contact through admin",
    "verified": true,
    "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET /api/caregivers/search

Search caregivers with advanced filters.

### Feedback Endpoints

#### POST /api/feedback

Submit user feedback.

**Request Body:**

```json
{
    "name": "John Doe",
    "email": "user@example.com",
    "feedbackType": "suggestion",
    "message": "The website is great! Suggestion: add video calls.",
    "rating": 5
}
```

**Response:**

```json
{
    "id": "uuid",
    "message": "Thank you for your feedback!",
    "createdAt": "2024-01-01T00:00:00Z"
}
```

### Admin Endpoints

#### GET /api/admin/stats

Get dashboard statistics (Admin only).

**Response:**

```json
{
    "totalUsers": 150,
    "totalQuestions": 75,
    "pendingQuestions": 12,
    "answeredQuestions": 63,
    "totalInsights": 25,
    "publishedInsights": 20,
    "totalCaregivers": 30,
    "activeCaregivers": 25,
    "totalFeedback": 45,
    "recentFeedback": 8
}
```

#### GET /api/admin/questions

Get all questions for management (Admin only).

#### PUT /api/admin/questions/:id/status

Update question status (Admin only).

**Request Body:**

```json
{
    "status": "answered",
    "adminNotes": "Provided comprehensive guidance"
}
```

#### POST /api/admin/insights

Create new insight (Admin only).

**Request Body:**

```json
{
    "title": "New Care Tip",
    "content": "Full article content...",
    "excerpt": "Brief summary...",
    "category": "Food & Nutrition",
    "isPublished": true
}
```

#### PUT /api/admin/insights/:id

Update insight (Admin only).

#### DELETE /api/admin/insights/:id

Delete insight (Admin only).

#### POST /api/admin/caregivers

Add new caregiver (Admin only).

**Request Body:**

```json
{
    "name": "New Caregiver",
    "experience": 3,
    "city": "Delhi",
    "languages": ["Hindi", "English"],
    "skills": ["Elder Care"],
    "contactInfo": "Phone: +919876543210",
    "verified": true
}
```

#### PUT /api/admin/caregivers/:id

Update caregiver (Admin only).

#### DELETE /api/admin/caregivers/:id

Remove caregiver (Admin only).

#### GET /api/admin/feedback

Get all feedback (Admin only).

#### POST /api/admin/users

Create user (Admin only).

#### GET /api/admin/users

Get all users with pagination (Admin only).

#### PUT /api/admin/users/:id

Update user (Admin only).

## Security & Authentication

### JWT Token Configuration

- **Access Token**: 15 minutes expiry, contains user ID and role
- **Refresh Token**: 7 days expiry, stored in database
- **Email Verification Token**: 24 hours expiry
- **Password Reset Token**: 1 hour expiry

### Rate Limiting

- **Auth endpoints**: 5 requests per minute
- **Question submission**: 3 requests per hour per user
- **General endpoints**: 100 requests per minute per IP

### Data Validation

- All input data must be validated and sanitized
- Email format validation
- Password strength requirements (min 8 chars, special chars)
- Phone number format validation for Indian numbers
- Content length limits for questions and messages

### CORS Configuration

```javascript
{
    origin: ["https://geriacare.in", "https://admin.geriacare.in"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@host:port/dbname
DATABASE_SSL=true

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=7

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@geriacare.in

# WhatsApp Integration
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_TOKEN=your-whatsapp-business-token
WHATSAPP_PHONE_ID=your-phone-number-id

# File Upload
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application
PORT=3001
NODE_ENV=production
BASE_URL=https://api.geriacare.in
FRONTEND_URL=https://geriacare.in
ADMIN_URL=https://admin.geriacare.in

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
BCRYPT_ROUNDS=12
```

## File Upload Configuration

### Caregiver Photos

- **Allowed formats**: JPEG, PNG, WebP
- **Max size**: 5MB
- **Dimensions**: Max 1200x1200px
- **Storage**: Cloudinary with auto-optimization

### Document Uploads (Future)

- **Allowed formats**: PDF, JPEG, PNG
- **Max size**: 10MB per file
- **Virus scanning**: Required
- **Storage**: Secure cloud storage with signed URLs

## API Response Format

### Success Response

```json
{
    "success": true,
    "data": {}, // Response data
    "message": "Operation successful"
}
```

### Error Response

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input data",
        "details": [
            {
                "field": "email",
                "message": "Invalid email format"
            }
        ]
    }
}
```

### Pagination Response

```json
{
    "success": true,
    "data": {
        "results": [],
        "page": 1,
        "limit": 10,
        "totalPages": 5,
        "totalResults": 50
    }
}
```

## Error Codes

- `AUTHENTICATION_ERROR`: Invalid credentials
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `SERVER_ERROR`: Internal server error
- `EMAIL_NOT_VERIFIED`: Email verification required
- `TOKEN_EXPIRED`: JWT token expired
- `TOKEN_INVALID`: Invalid JWT token

This comprehensive backend schema provides the foundation for implementing the Geriacare application with proper authentication, data management, and security features.

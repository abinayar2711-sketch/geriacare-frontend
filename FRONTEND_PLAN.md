# Geriacare Frontend Implementation Plan

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Shadcn/ui** component library
- **Tailwind CSS v4** for styling
- **React Router** for navigation
- **React Query/TanStack Query** for data fetching
- **React Hook Form** for form management
- **Zustand** for state management
- **Supabase/Firebase** for backend integration

## Page-by-Page Implementation

### 1. Layout & Common Components

#### Layout Components

- `MainLayout.tsx` - Main app wrapper with header, footer
- `Header.tsx` - Navigation with logo, menu items
- `Footer.tsx` - Contact links, copyright
- `Sidebar.tsx` - Mobile navigation drawer
- `AdminLayout.tsx` - Admin dashboard layout

#### Common Components

- `Button.tsx` - Custom button variants (elder-friendly sizing)
- `Card.tsx` - Content cards with large text
- `Modal.tsx` - Accessible modal dialogs
- `Spinner.tsx` - Loading indicators
- `Toast.tsx` - Notification system
- `ErrorBoundary.tsx` - Error handling
- `ProtectedRoute.tsx` - Auth guard for admin routes

#### Utils

- `api.ts` - API client configuration
- `auth.ts` - Authentication helpers
- `constants.ts` - App constants
- `types.ts` - Global TypeScript types
- `validation.ts` - Form validation schemas

### 2. Home Page (`/`)

#### Components

- `Hero.tsx` - Tagline and introduction
- `FeaturesGrid.tsx` - Service highlights
- `CallToAction.tsx` - Quick access buttons
- `Testimonials.tsx` - User testimonials (optional)

#### Features

- Elder-friendly large fonts and buttons
- Clear navigation to main features
- Responsive design for mobile/tablet

#### API Endpoints

- GET `/api/stats` - Basic site statistics

### 3. About Page (`/about`)

#### Components

- `AboutContent.tsx` - Mission and vision
- `TeamSection.tsx` - Team information
- `Disclaimer.tsx` - Non-medical advice disclaimer

#### Features

- Clear explanation of services
- Prominent disclaimer placement
- Contact information

### 4. Care Questions Feature (`/questions`)

#### Pages & Components

- `QuestionsList.tsx` - View submitted questions
- `QuestionForm.tsx` - Submit new question form
- `QuestionDetail.tsx` - Individual question view
- `QuestionStatus.tsx` - Status indicator component
- `ChatInterface.tsx` - Admin-user chat component

#### Form Fields

- Name (required)
- City (required)
- Relation to senior (dropdown)
- Phone (optional with consent checkbox)
- Question details (textarea)

#### Features

- No anonymous submissions
- Status tracking (Pending/Answered)
- Chat interface for admin responses
- WhatsApp integration option

#### API Endpoints

- GET `/api/questions` - List user's questions
- POST `/api/questions` - Submit new question
- GET `/api/questions/:id` - Get question details
- POST `/api/questions/:id/messages` - Send chat message
- GET `/api/questions/:id/messages` - Get chat history

#### Types

```typescript
interface Question {
    id: string;
    name: string;
    city: string;
    relation: string;
    phone?: string;
    content: string;
    status: 'pending' | 'answered';
    createdAt: Date;
    updatedAt: Date;
}

interface Message {
    id: string;
    questionId: string;
    content: string;
    sender: 'user' | 'admin';
    createdAt: Date;
}
```

### 5. Observations & Opinions (`/insights`)

#### Components

- `InsightsList.tsx` - Grid of insight articles
- `InsightCard.tsx` - Individual insight preview
- `InsightDetail.tsx` - Full article view
- `CategoryFilter.tsx` - Filter by category
- `Disclaimer.tsx` - Medical disclaimer banner

#### Categories

- Food & Nutrition
- Bathing & Hygiene
- Daily Routine
- Emotional Wellbeing
- General Care

#### API Endpoints

- GET `/api/insights` - List published insights
- GET `/api/insights/:id` - Get insight details
- GET `/api/insights/categories` - Get categories

#### Types

```typescript
interface Insight {
    id: string;
    title: string;
    content: string;
    category: string;
    excerpt: string;
    publishedAt: Date;
    author: string;
}
```

### 6. Caregiver Listings (`/caregivers`)

#### Components

- `CaregiverGrid.tsx` - Grid layout of caregivers
- `CaregiverCard.tsx` - Individual caregiver profile card
- `CaregiverDetail.tsx` - Detailed caregiver profile
- `CaregiverFilters.tsx` - Filter by city, experience, languages
- `SearchBar.tsx` - Search functionality

#### Profile Fields

- Name and photo
- Experience years
- Availability status
- City/Location
- Languages spoken
- Skills/specializations
- Contact information (admin controlled)

#### Features

- No pricing display
- Admin-managed profiles
- Filter and search functionality
- Mobile-responsive cards

#### API Endpoints

- GET `/api/caregivers` - List available caregivers
- GET `/api/caregivers/:id` - Get caregiver details
- GET `/api/caregivers/search` - Search caregivers

#### Types

```typescript
interface Caregiver {
    id: string;
    name: string;
    photo?: string;
    experience: number;
    city: string;
    languages: string[];
    skills: string[];
    availability: 'available' | 'busy' | 'unavailable';
    contactInfo: string;
    verified: boolean;
}
```

### 7. Feedback Page (`/feedback`)

#### Components

- `FeedbackForm.tsx` - Feedback submission form
- `FeedbackSuccess.tsx` - Thank you message

#### Form Fields

- Name (required)
- Email (optional)
- Feedback type (dropdown)
- Message (textarea)
- Rating (optional)

#### API Endpoints

- POST `/api/feedback` - Submit feedback

### 8. Contact Page (`/contact`)

#### Components

- `ContactInfo.tsx` - Contact details display
- `ContactForm.tsx` - Quick contact form
- `WhatsAppButton.tsx` - WhatsApp quick contact
- `LocationMap.tsx` - Office location (if applicable)

#### Features

- WhatsApp integration
- Email contact
- Large, accessible contact buttons

### 9. Admin Dashboard (`/admin`)

#### Authentication ✅ COMPLETED

- `LoginPage.tsx` - ✅ Universal login form for users and admins
- `ProtectedRoute.tsx` - ✅ Protected routes with role-based access
- ✅ Header authentication UI with user dropdown
- ✅ Login redirect functionality implemented
- ✅ Authentication service integration

#### Dashboard Pages

- `AdminDashboard.tsx` - Overview stats
- `ManageQuestions.tsx` - Handle user questions
- `ManageInsights.tsx` - Create/edit insights
- `ManageCaregivers.tsx` - Caregiver profile management
- `ManageFeedback.tsx` - Review feedback
- `AdminSettings.tsx` - App configuration

#### Components

- `AdminSidebar.tsx` - Navigation menu
- `StatsCards.tsx` - Dashboard metrics
- `DataTable.tsx` - Reusable data tables
- `RichTextEditor.tsx` - Content creation
- `ImageUpload.tsx` - File upload handling

#### API Endpoints

- POST `/api/auth/admin/login` - Admin authentication
- GET `/api/admin/stats` - Dashboard statistics
- GET `/api/admin/questions` - All questions management
- PUT `/api/admin/questions/:id/status` - Update question status
- POST `/api/admin/insights` - Create insight
- PUT `/api/admin/insights/:id` - Update insight
- DELETE `/api/admin/insights/:id` - Delete insight
- POST `/api/admin/caregivers` - Add caregiver
- PUT `/api/admin/caregivers/:id` - Update caregiver
- DELETE `/api/admin/caregivers/:id` - Remove caregiver

## Elder-Friendly UI Considerations

### Typography

- Minimum 16px base font size
- High contrast color scheme
- Clear, readable fonts (Inter, Open Sans)

### Interactive Elements

- Large touch targets (minimum 44px)
- Clear hover/focus states
- Prominent call-to-action buttons

### Navigation

- Simple, consistent navigation
- Breadcrumbs for orientation
- Clear page titles

### Accessibility

- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation support
- Alt text for images

## State Management Structure

### Zustand Stores

- `authStore.ts` - User/admin authentication
- `questionsStore.ts` - Questions state management
- `insightsStore.ts` - Insights data
- `caregiversStore.ts` - Caregiver listings
- `uiStore.ts` - UI state (modals, loading)

## Responsive Design Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## Performance Optimizations

- React.lazy() for code splitting
- Image optimization and lazy loading
- Debounced search inputs
- Pagination for large datasets
- Service worker for caching

## Testing Strategy

- Unit tests for utilities and components
- Integration tests for forms and API calls
- E2E tests for critical user flows
- Accessibility testing with axe-core

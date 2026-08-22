# Server Actions API Documentation

## Overview

Server actions are Next.js 15 server-side functions that handle mutations (create, update, delete, vote, flag, etc.). They run on the server and are safe for sensitive operations.

**File Location**: `src/lib/actions.ts`

**Key Security Features**:
- `"use server"` directive ensures code runs only on server
- No API keys or secrets leak to client
- Database operations are server-only
- User authentication via NextAuth sessions

## Core Concepts

### FormData-Based API

Most actions accept `FormData` from HTML forms. This pattern:
- Works with progressive enhancement
- Handles file uploads naturally
- Provides CSRF protection via middleware
- Enables validation and error messages

Example:
```typescript
// Client side
<form action={createQuestion}>
  <input name="title" required />
  <input name="situation" required />
  <button type="submit">Ask</button>
</form>

// Server side (actions.ts)
export async function createQuestion(prev, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const situation = String(formData.get("situation") ?? "").trim();
  // ... validate and create
}
```

### Return Patterns

Actions return:

1. **Redirect on Success**: `redirect("/next-page")` 
2. **State on Error**: Return error object with `error` and `values`
3. **Void**: Some moderation actions return nothing

## Public Actions

Actions available to regular users (family role).

### createQuestion

Creates a new question with rich context about elder care situation.

**Parameters (FormData)**:
- `title` (required): Question title, 15+ characters
- `situation` (required): Describe the situation, 150+ characters
- `tried` (optional): What you've already tried
- `patientAge` (optional): Age of the elder
- `patientGender` (optional): Gender (male/female)
- `condition` (optional): Diagnosis or condition
- `medications` (optional): Current medications
- `city` (optional): City for locating local experts
- `urgency` (optional): low | normal | high | emergency (default: normal)
- `careSetting` (optional): home | assisted | hospital
- `relation` (optional): son | daughter | caregiver | other
- `authorName` (optional): Name if posting anonymously
- `tags[]` (optional): Array of tag slugs

**Returns**:
- Success: Redirects to `/post/{id}` or `/held` (if crisis flagged and anonymous)
- Error: `{ error: string, values: FormData values }`

**Validation**:
- Title: minimum 15 characters
- Situation: minimum 150 characters (MIN_CONTEXT constant)
- All text fields trimmed to max 60 characters

**Processing**:
1. Constructs body from situation, tried, condition, medications
2. Detects crisis language in body + title
3. Sets status: `needs_review` if crisis, `live` otherwise
4. First-time users always set to `needs_review`
5. Creates slug from title + random suffix
6. Inserts post and attaches tags
7. Revalidates home page cache

**Example**:
```typescript
const formData = new FormData();
formData.append("title", "Mother won't eat after medication change");
formData.append("situation", "My 78-year-old mother on diabetes meds stopped eating...");
formData.append("patientAge", "78");
formData.append("urgency", "high");
formData.append("tags", "appetite-loss");
formData.append("tags", "medication");

await createQuestion(null, formData);
// Redirects to /post/xyz or /held if crisis
```

### createAnswer

Creates a response to a question.

**Parameters**:
- `postId` (required, FormData): ID of question being answered
- `body` (required, FormData): Answer text, 20+ characters

**Returns**:
- Success: Redirects to `/post/{questionId}`
- Error: `{ error: string }`

**Validation**:
- Body: minimum 20 characters
- Post exists and is a question
- User authenticated

**Processing**:
1. Validates body length
2. Detects crisis language (answers with crisis language need review)
3. Creates answer post
4. Revalidates thread

### createComment

Adds a clarifying comment to an answer.

**Parameters**:
- `postId` (required): ID of answer being commented on
- `body` (required): Comment text, 10+ characters

**Returns**:
- Success: Redirects to `/post/{questionId}`
- Error: Returns error state

**Note**: Comments are for clarification only, not voting or debate.

### createArticle

Publish care tips/guides (expert-only).

**Parameters**:
- `title` (required): Article title, 10+ characters
- `body` (required): Article content, 200+ characters
- `tags[]` (optional): Array of tag slugs

**Returns**:
- Success: Redirects to `/post/{id}`
- Error: Throws error (must be caught by form error handler)

**Access Control**: Only `expert` or `moderator` role

**Note**: Articles are immediately published (status: live)

### toggleVote

Vote on helpfulness or unclear-ness of a post.

**Parameters**:
- `postId` (required): ID of post being voted on
- `kind` (required): `helpful` or `unclear`
- `up` (required): `true` to upvote, `false` to downvote

**Returns**: Void (optimistic UI update expected)

**Logic**:
- If vote exists: toggle or change kind
- If same vote: remove vote
- Only registered users can vote
- Cannot vote on own posts

### endorse

Expert endorses answer as medically sound.

**Parameters**:
- `postId` (required): ID of answer to endorse
- `rootId` (required): ID of original question
- `note` (optional): Endorsement reason (50 characters)

**Returns**: Void

**Access Control**: `expert` or `moderator` only

**Effect**: Adds endorsement badge visible on answer

### flagPost

Report inappropriate or dangerous content.

**Parameters**:
- `postId` (required): ID of post to flag
- `reason` (required): Flag reason (required for tracking)
- `rootId` (required): ID of original question (for threading)

**Returns**: Void

**Tracking**:
- Counts flags per post
- Auto-hides post after 2+ flags (status: hidden)
- Queues for moderator review

### submitFeedback

Send feedback to site admins.

**Parameters**:
- `message` (required): Feedback text, 10+ characters
- `email` (optional): User email for follow-up

**Returns**: Void

**Note**: Works even for anonymous users

## Expert-Only Actions

Actions requiring `expert` role or higher.

### createArticle

(See Public Actions above - repeated for reference)

### endorse

(See Public Actions above - repeated for reference)

## Moderator-Only Actions

Actions requiring `moderator` role.

### moderate

Moderator takes action on posts in review queue.

**Parameters**:
- `postId` (required): Post to moderate
- `action` (required): `approve` | `hide` | `escalate`
- `note` (optional): Internal moderator note

**Returns**: Void

**Actions**:
- `approve`: Change status to `live`
- `hide`: Change status to `hidden`
- `escalate`: Flag for leadership review

**Side Effects**:
- Clears flags when approving
- Creates audit log entry
- Revalidates affected pages

### setRole

Assign or change user role.

**Parameters**:
- `userId` (required): User ID to update
- `role` (required): `family` | `expert` | `moderator`

**Returns**: Void

**Access Control**: `moderator` only

**Audit**: Logged with moderator ID and timestamp

### Caregiver Management (Moderator)

Moderators manage searchable caregiver listings.

#### createCaregiver

**Parameters** (FormData):
- `name` (required): Caregiver name
- `specialization` (required): Expertise area
- `city` (required): City
- `phone` (optional): Contact number
- `bio` (optional): Professional bio
- `verified` (boolean): Verification status

**Returns**: Void

#### updateCaregiver

**Parameters**:
- `id` (required): Caregiver ID
- All fields same as create (FormData)

**Returns**: Void

#### deleteCaregiver

**Parameters**:
- `id` (required): Caregiver ID

**Returns**: Void

**Note**: Only moderators can manage caregiver listings (not public-facing).

## Error Handling

### Client-Side

Most actions return error state for display:

```typescript
const [state, formAction, pending] = useActionState(createQuestion, null);

if (state?.error) {
  return <p className="error">{state.error}</p>;
}
```

### Server-Side

Critical errors throw exceptions:

```typescript
if (user.role !== "expert") {
  throw new Error("Only experts can publish articles.");
}
```

The form component should wrap action calls in try/catch or use error boundary.

## Constants & Limits

```typescript
const AUTO_HIDE_FLAGS = 2;              // Posts with 2+ flags auto-hide
const MIN_CONTEXT = 150;                // Question situation min length
const ANON_COOKIE = "geriacare_anon";   // Cookie name for anonymous users
```

## Authentication Patterns

### Current User (Optional)

```typescript
async function currentUser() {
  const session = await auth();
  return session?.user ?? null;
}
```

Used when user might not be logged in (anonymous allowed).

### Require User (Throws)

```typescript
async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");
  return session.user;
}
```

Used when authentication is mandatory (throws redirect).

## Database Interactions

All actions use Drizzle ORM for type-safe database access:

```typescript
await db
  .insert(posts)
  .values({...})
  .returning();

await db
  .update(posts)
  .set({ status: "live" })
  .where(eq(posts.id, postId));

await db
  .select()
  .from(posts)
  .where(eq(posts.id, postId));
```

See DATABASE_SCHEMA.md for complete schema.

## Cache Invalidation

Actions use Next.js revalidation to update cached pages:

```typescript
revalidatePath("/");              // Revalidate home feed
revalidatePath("/post/[id]");     // Revalidate post thread
revalidatePath("/mod");           // Revalidate moderator dashboard
```

## Testing

Server actions are tested indirectly through integration tests. See crisis detection tests in `src/lib/__tests__/crisis.test.ts` for examples of testing related logic.

For action testing:
1. Test utility functions separately (utils.ts)
2. Test crisis detection (crisis.ts)
3. Integration tests exercise actions through form submission

## Performance Considerations

- Actions run on server (no network delays for DB)
- Forms support progressive enhancement (work without JavaScript)
- Revalidation is efficient (only affected paths)
- Voting/flagging is optimistic (returns quickly)

## Security Considerations

- All user input is trimmed and validated
- Server actions can't be called except through Next.js mechanism
- Database queries are parameterized (ORM protection)
- Crisis content is detected server-side (not in client code)
- Moderator actions are access-controlled

## Future Improvements

1. **Batch Operations**: Handle multiple post actions in one call
2. **Webhooks**: Notify external services of crisis posts
3. **Audit Log**: Complete history of all moderation actions
4. **Rate Limiting**: Prevent spam posting
5. **Scheduled Actions**: Automatic status updates
6. **Analytics Events**: Track user behavior patterns

## Common Issues & Solutions

**Issue**: Form errors don't show on client
**Solution**: Ensure `useActionState` hook is used and state is checked

**Issue**: Redirect doesn't work after action
**Solution**: Use `redirect()` not `router.push()` - it must be called server-side

**Issue**: Database errors crash the page
**Solution**: Wrap action in try/catch and return error state

## Questions?

- Technical: See DATABASE_SCHEMA.md or CRISIS_DETECTION.md
- Moderation workflow: See MODERATION.md
- Testing: Contact development team

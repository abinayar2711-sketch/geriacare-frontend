# Moderation System & Workflow

## Overview

Geriacare's moderation system maintains community safety by reviewing questionable content, managing user roles, and addressing violations. The system is designed for a small team of trusted moderators with clear workflows.

## Core Concepts

### User Roles

The system has three user roles:

| Role | Capabilities | Default Assignment |
|------|--------------|-------------------|
| **family** | Ask questions, answer, comment, vote, flag | All new users |
| **expert** | All family + answers highlighted with badge | Manually assigned by moderator |
| **moderator** | Review queue, user management, role management | Set via moderator email list at signup |

### Post Status

Posts flow through states based on content and community actions:

| Status | Visibility | Meaning |
|--------|-----------|---------|
| **live** | Public | Approved and published |
| **needs_review** | Hidden | Under moderation (crisis language or first-time poster) |
| **hidden** | Hidden | Removed by moderator or auto-hidden via flags |
| **closed** | Public | Question closed to new answers |

### Flagging System

Community members can flag posts for:
- **Inappropriate content**: Off-topic, spam, abuse
- **Medical concern**: Potentially dangerous advice
- **Other**: User-defined reason

**Auto-Hide Trigger**: Posts with 2+ flags are automatically hidden pending moderator review.

## Moderation Workflow

### Step 1: Review Queue

Moderators access `/mod` page which shows:

1. **Crisis Review** - Posts with crisis language (abuse, neglect, suicide)
2. **Flag Review** - Posts flagged 2+ times by community
3. **New Account First Posts** - First post from new accounts (risk of spam)

### Step 2: Assess Content

For each post in queue, moderator:

1. **Read Full Context**: Question + situation + all answers/comments
2. **Verify Crisis Status**: Is this a real crisis or false positive?
3. **Check User History**: Is this from a known problematic user?
4. **Consider Context**: Is the post helping or harming the community?

### Step 3: Take Action

Available moderator actions:

#### For Crisis Posts

- **✅ Publish Crisis Post**: Post contains real emergency
  - Move status to `live`
  - Optionally flag user as expert if answer is valuable
  - Copy user's contact to note
  - Consider contacting emergency services if appropriate

- **✅ Approve & Publish False Positive**: Crisis language but not a real crisis
  - Move status to `live`
  - Leave note for moderator team on what triggered false positive

- **⚠️ Escalate**: Potential legal issue, imminent danger, criminal activity
  - Flag post with reason
  - Contact organization leadership
  - May contact emergency services
  - Consider user suspension

- **❌ Hide Crisis Post**: Inappropriate or harmful response desired
  - Move status to `hidden`
  - Send user message explaining removal
  - Note reason

#### For Flagged Posts

- **✅ Unflag & Approve**: Community flagged incorrectly
  - Remove all flags
  - Move status to `live`
  - Post becomes visible again

- **👤 Assign Expert**: Author provided valuable, accurate advice
  - Give author `expert` role
  - Re-publish if hidden
  - Add badge to their answers

- **❌ Hide & Warn User**: Inappropriate but not severe
  - Move status to `hidden`
  - Send warning message
  - Track for pattern

- **❌ Hide & Suspend**: Severe violations or repeat offender
  - Move status to `hidden`
  - Disable user account temporarily
  - Log reason for future reference

### Step 4: User Communication

After action, moderate through the system:

```
For hiding posts:
"This post was hidden because: [reason]. We welcome respectful discussion 
about elder care. Please review our community guidelines."

For promoting to expert:
"Thank you for your valuable contribution! We've marked you as a verified expert."

For escalation:
"Your post describes a concerning situation. Here are resources that can help:
[helpline numbers]"
```

## Content Moderation Guidelines

### What Gets Published (✅)

- Genuine questions about elder care
- Authentic personal experiences
- Medical advice from experts
- Difficult topics (dementia, end-of-life care)
- Emotional support and encouragement

### What Gets Hidden (❌)

- **Spam**: Self-promotion, link farming, commercial content
- **Medical Danger**: Advice that could cause serious harm
- **Abuse**: Harassment, slurs, hate speech
- **Off-Topic**: Unrelated to elder care
- **Misinformation**: Clearly false health claims
- **Privacy Violation**: Sharing others' identifying information

### The Gray Area (⚠️)

These need moderator judgment:

- **Alternative Medicine**: Not evidence-based but not harmful
- **Emotional Venting**: Frustrated caregiver language but no abuse
- **Disagreement**: Respectful debate vs. escalating conflict
- **Cultural Practices**: Different care approaches across regions

**Principle**: When uncertain, ask "Is this helping the elder care community?"

## Special Workflows

### New Account First Posts

All posts from brand-new accounts go through moderation (status: `needs_review`):

- **If Good**: Approve immediately
- **If Suspicious**: Check for spam patterns
- **If Helpful**: Consider promoting to expert if relevant expertise

### Expert Promotion Criteria

Before marking someone as "expert", verify:

- ✅ Multiple quality contributions (3+ good answers)
- ✅ Consistent, evidence-based advice
- ✅ Professional background indicated (nurse, doctor, caregiver)
- ✅ No concerning user behavior history
- ✅ Engagement (responds to follow-ups)

### Crisis Escalation Decision Tree

```
Does post describe active abuse/neglect/suicide risk?
├─ YES: Is user asking for help/resources?
│   ├─ YES → Publish + contact helplines
│   └─ NO → Escalate to leadership
└─ NO: Is this false positive?
    ├─ YES → Approve & publish
    └─ NO → Review with senior moderator
```

## Moderator Dashboard Features

### Queue Overview

```
Crisis Review (5)
├─ "Mother hasn't eaten in 3 days..." - User ID: x2k3
├─ "My father is suicidal..." - User ID: m9p2
├─ "Being hit regularly..." - User ID: s1a4
├─ "Self-harm behaviors..." - User ID: k4b7
└─ "We're not giving medicine..." - User ID: n3x9

Flag Review (12)
├─ "Dangerous medication mix" - 2 flags
├─ "Aggressive caregiver post" - 3 flags
└─ ...

New Account First Posts (3)
├─ "Buy elder care products!" - User ID: new_1
├─ "My grandma has arthritis..." - User ID: new_2
└─ ...
```

### User Management

Moderators can:

- View user history (questions, answers, flags)
- Change user role (family ↔ expert ↔ moderator)
- View user's flagged posts
- Send messages to users
- Temporarily suspend accounts
- View anonymous poster keys (for tracking repeat problem users)

### Analytics (for moderators)

- Posts reviewed today/week/month
- Average review time
- Appeal rate (posts moderators approved after flagging)
- Crisis trends (types, locations, ages)
- User flagging patterns

## Escalation Path

For issues beyond individual moderator authority:

```
Single Moderator Review
        ↓
Senior Moderator Consultation
        ↓
Organization Leadership Decision
        ↓
Possible External Authority (Police, Hospital, etc.)
```

Examples requiring escalation:

- Potential child abuse (if elderly parent suspected abusing grandchild)
- Suspected criminal activity
- User threatening others
- Data privacy incidents
- Media/legal inquiries

## Moderation Best Practices

### Do's ✅

- **Be fair**: Consistent standards for all users
- **Document**: Note reasons for all actions
- **Communicate**: Explain to user why action taken
- **Escalate**: Ask for help when uncertain
- **Respect Privacy**: Don't share user info publicly
- **Update Knowledge**: Stay current on crisis resources
- **Take breaks**: Moderation is emotionally taxing

### Don'ts ❌

- **Act emotionally**: Make decisions based on anger/disgust
- **Shame users**: Avoid harsh language in communications
- **Make up rules**: Stick to stated community guidelines
- **Overstep authority**: Know your limits
- **Ignore patterns**: Track repeat violators
- **Burnout silently**: Communicate if overwhelmed

## Common Questions

**Q: What if someone's post is borderline crisis language?**
A: Err on the side of caution. Better to review and approve than miss real crisis.

**Q: Can moderators remove comments from experts?**
A: Yes, same rules apply. Expertise doesn't override community guidelines.

**Q: What about anonymous posters who violate rules?**
A: Flag them in system. System tracks via anonymous cookie. Multiple violations result in anonymous user restriction.

**Q: How do we handle cultural differences in caregiving?**
A: Respect different approaches unless they cause harm. Context matters in moderation.

**Q: What's the appeal process for hidden posts?**
A: Users can request review. Senior moderator reviews appeals.

## Resources

- **Crisis Helplines**: See CRISIS_DETECTION.md
- **Community Guidelines**: See site `/about` page
- **Database Schema**: See DATABASE_SCHEMA.md
- **Server Actions**: See SERVER_ACTIONS.md

## Questions?

- **Technical Issues**: Contact dev team
- **Moderation Policy**: Contact leadership
- **User Welfare Concerns**: Escalate immediately

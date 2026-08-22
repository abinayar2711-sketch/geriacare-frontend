# Crisis Detection System

## Overview

The crisis detection system automatically identifies posts containing elder abuse, neglect, or self-harm language and holds them for human review before publication. This is a critical safety feature for a healthcare community.

## How It Works

Posts are analyzed when submitted using pattern matching against known crisis language indicators. Posts flagged as containing crisis language are:

- **Status**: Set to `needs_review` instead of `live`
- **Visibility**: Hidden from the main feed until reviewed
- **Moderator Action**: Queued for immediate moderator review in the mod dashboard
- **User Experience**: User sees a message about content under review

## Crisis Language Categories

### 1. Elder Abuse Indicators

Patterns that detect direct violence or abuse:

- **Violence verbs**: `hitting`, `hurting`, `abusing`, `beating`, `slapping`, `pushing`
  - Example: "been hitting my mother" → **flagged**
  - Must be followed by a person reference: my, the, her, his, him, them

- **Abuse terminology**: 
  - "elder abuse", "senior abuse", "old age abuse"
  - Example: "experiencing elder abuse" → **flagged**

### 2. Neglect Patterns

Indicators of abandonment or withholding care:

- **Neglect terms**: `neglect`, `neglecting`, `abandoning`, `abandoned`, `left alone`, `left to die`
  - Example: "feeling abandoned by family" → **flagged**

- **Bedsores/Pressure sores**: `bedsore`, `bedsores`, `pressure sore`, `pressure sores`
  - Example: "has bedsores on her back" → **flagged**
  - Note: These indicate severe neglect requiring urgent intervention

- **Feeding/Medication neglect**: `not eating`, `not feeding`, `not giving water`, `not giving medicine`
  - Example: "not feeding him for days" → **flagged**

- **Untreated medical issues**: `untreated wound`, `untreated infection`, `untreated pain`, `untreated injury`
  - Example: "untreated wound that's getting infected" → **flagged**

- **Coping/Despair**: `can't go on`, `can't take it anymore`, `can't cope`
  - Example: "she can't take it anymore" → **flagged**

### 3. Self-Harm/Suicide Indicators

Patterns indicating suicidal ideation or self-harm:

- **Suicide terminology**: `suicide`, `suicidal`
  - Example: "suicidal thoughts" → **flagged**

- **Death wishes**: `want to die`, `no reason to live`, `no point in living`, `end my life`, `end it`
  - Example: "end it all" → **flagged**

- **Self-harm**: `self harm`, `self-harm`
  - Example: "self-harm behavior" → **flagged**

- **Harm/Kill**: `kill myself`, `hurt myself`, `harm myself` (with "myself" or variations)
  - Example: "trying to hurt myself" → **flagged**

## Example Scenarios

### ✅ Flagged as Crisis

```
"My mother hasn't eaten in 3 days and we're not giving her medicine. 
She has bedsores and I don't know what to do."
```
**Why**: Multiple neglect indicators (not eating, not giving medicine, bedsores)

```
"My father wants to end his life. He keeps saying he has no reason to live.
We are very worried."
```
**Why**: Direct suicide indicators (end life, no reason to live)

```
"My family has been hitting and pushing my elderly relative around."
```
**Why**: Direct violence language (hitting, pushing)

### ❌ Not Flagged as Crisis

```
"My mother is 85 and experiencing memory loss. Is this normal?
What can we do to help her remember things?"
```
**Why**: Normal aging concerns, no abuse/neglect/harm language

```
"We help her with meals every day. She takes her medications on schedule.
She's doing well with care."
```
**Why**: Positive care language, no crisis indicators

```
"The doctor treated her wound and it's healing nicely."
```
**Why**: Medical care and recovery, no neglect

## Known Limitations

1. **False Positives**: The system errs on the side of caution. Posts about discussing abuse (e.g., "he was abused as a child") may be flagged even if not currently happening.

2. **Context Sensitivity**: Pattern matching cannot understand full context. A post saying "we don't abuse them, we love them" will match the abuse pattern and be flagged.

3. **Regional Language**: Patterns are designed for Indian English and may miss terms in other English variants or regional languages.

4. **Evolution Needed**: Crisis language evolves. New patterns of elder abuse language may emerge that aren't currently detected.

## Moderator Workflow

When a post is flagged as crisis:

1. **Review Queue**: Post appears in moderator dashboard under "Crisis Review"
2. **Assessment**: Moderator reads full context and determines if crisis is real
3. **Actions**:
   - **Approve & Publish**: If false positive, move post to live status
   - **Approve with Care**: If real concern, publish + contact emergency services if applicable
   - **Escalate**: If involves potential legal issue or immediate danger
   - **Hide**: If dangerous or inappropriate, hide from feed

4. **Helplines**: Moderator has access to helpline list to provide to users if needed

## Helpline Resources

The system includes India-specific and international helpline contacts:

- **HelpAge India**: 1800-180-1253 (Toll-free)
- **Tele-MANAS**: 14416 / 1-800-891-4416 (24×7, 20 languages)
- **Vandrevala Foundation**: +91 99996 66555 (24×7, mental health)
- **Jeevandayee (Maharashtra)**: 104 (24×7)

These are shown to users when they submit crisis content.

## Implementation Details

### Crisis Detection Code

Located in: `src/lib/crisis.ts`

```typescript
export function detectCrisis(text: string): boolean {
  return PATTERNS.some((p) => p.test(text));
}
```

The function uses an array of RegExp patterns and returns `true` if any pattern matches.

### Testing

Comprehensive tests exist in `src/lib/__tests__/crisis.test.ts`:

- 24+ test cases covering all pattern types
- Edge cases (empty strings, whitespace, punctuation)
- Integration scenarios
- Helpline validation

Run tests:
```bash
npm test -- src/lib/__tests__/crisis.test.ts
```

### Status Determination

When a question is created, its status is determined:

```typescript
function statusForNewPost(body: string) {
  return detectCrisis(body) ? "needs_review" : "live";
}
```

This runs on the combined body text of the question (situation + tried + condition + medications).

## Future Improvements

1. **Machine Learning**: Move from regex to ML model for better accuracy
2. **Confidence Scoring**: Provide confidence level (very likely, possibly, unlikely)
3. **Language Support**: Add detection for Hindi and other regional languages
4. **User Blocking**: Ability for moderators to flag patterns from specific users
5. **Analytics**: Track crisis reporting trends (locations, ages, types)
6. **Automated Response**: Send immediate helpline info to users
7. **Emergency Integration**: Direct integration with local emergency services

## Questions?

Contact the development team for:
- Adding new crisis patterns
- Adjusting sensitivity
- Integrating with external crisis resources
- Improving the system based on moderator feedback

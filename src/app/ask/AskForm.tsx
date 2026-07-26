"use client";

import { useActionState } from "react";
import { createQuestion } from "@/lib/actions";
import { NameField } from "@/components/NameField";
import { btnPrimary, hint, input as field } from "@/lib/ui";

export default function AskForm({
  allTags,
  signedIn,
}: {
  allTags: { id: string; slug: string; name: string }[];
  signedIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(createQuestion, null);
  const v = state?.values;

  return (
    <form action={formAction} className="max-w-2xl space-y-5">
      {state?.error && (
        <p
          role="alert"
          className="rounded-md border-l-[3px] border-[var(--color-accent)] bg-[var(--color-accent-soft)]/60 px-4 py-3 text-sm text-[var(--color-accent)]"
        >
          {state.error}
        </p>
      )}

      <label className="block">
        <span className="text-sm font-medium">Your question, in one line</span>
        <input
          name="title"
          required
          minLength={15}
          defaultValue={v?.title}
          className={field}
          placeholder="e.g. Father with dementia refusing to eat — what can we try?"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">What&apos;s happening</span>
        <span className={hint}>
          Describe the situation as it is — the condition, context, what you
          notice. At least 150 characters.
        </span>
        <textarea
          name="situation"
          required
          rows={5}
          defaultValue={v?.situation}
          className={field}
          placeholder="My father (82) was diagnosed with moderate Alzheimer's 6 months ago. In the last two weeks he's been refusing meals, especially solid food..."
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">What you&apos;ve tried</span>
        <textarea
          name="tried"
          rows={3}
          defaultValue={v?.tried}
          className={field}
          placeholder="We've tried soft foods, smoothies, eating at different times..."
        />
      </label>

      {/* Patient info fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Patient&apos;s age</span>
          <input
            name="patientAge"
            type="number"
            min={0}
            max={120}
            defaultValue={v?.patientAge}
            className={field}
            placeholder="e.g. 82"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Patient&apos;s gender</span>
          <select
            name="patientGender"
            defaultValue={v?.patientGender}
            className={field}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium">Condition / Diagnosis</span>
        <input
          name="condition"
          defaultValue={v?.condition}
          className={field}
          placeholder="e.g. Alzheimer's, post-stroke, diabetes"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium">Current medications</span>
        <input
          name="medications"
          defaultValue={v?.medications}
          className={field}
          placeholder="e.g. Donepezil 10mg, Metformin 500mg"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">City / Location</span>
          <input
            name="city"
            defaultValue={v?.city}
            className={field}
            placeholder="e.g. Chennai"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Urgency</span>
          <select name="urgency" defaultValue={v?.urgency || "normal"} className={field}>
            <option value="low">Low — general information</option>
            <option value="normal">Normal — need guidance</option>
            <option value="high">High — situation is worsening</option>
            <option value="emergency">Emergency — need help now</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Care setting</span>
          <select name="careSetting" defaultValue={v?.careSetting} className={field}>
            <option value="">Select</option>
            <option value="home">Home care</option>
            <option value="hospital">Hospital</option>
            <option value="assisted_living">Assisted living</option>
            <option value="rehab">Rehabilitation center</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">Your relation to patient</span>
          <select name="relation" defaultValue={v?.relation} className={field}>
            <option value="">Select</option>
            <option value="son">Son</option>
            <option value="daughter">Daughter</option>
            <option value="spouse">Spouse</option>
            <option value="grandchild">Grandchild</option>
            <option value="self">Self</option>
            <option value="other">Other</option>
          </select>
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Tags</legend>
        <span className={hint}>
          Pick what this is about — readers browse by these.
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {allTags.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-1.5 text-xs transition hover:border-[var(--color-accent)] has-checked:border-[var(--color-accent)] has-checked:bg-[var(--color-accent-soft)] has-checked:text-[var(--color-accent)]"
            >
              <input
                type="checkbox"
                name="tags"
                value={t.slug}
                defaultChecked={v?.tags.includes(t.slug)}
              />
              {t.name}
            </label>
          ))}
        </div>
      </fieldset>

      {!signedIn && <NameField defaultValue={v?.authorName} />}

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-line)] pt-5">
        <button disabled={pending} className={btnPrimary}>
          {pending ? "Posting…" : "Post question"}
        </button>
        {!signedIn && (
          <span className="text-xs text-[var(--color-muted)]">
            Goes live immediately. No account needed.
          </span>
        )}
      </div>
    </form>
  );
}

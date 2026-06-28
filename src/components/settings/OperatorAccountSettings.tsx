"use client";

import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";
import { OperatorProfileCard } from "@/components/market-pulse/composer/OperatorProfileCard";
import {
  Field,
  SectionCard,
  textInputClassName,
  textareaClassName,
} from "@/components/market-pulse/composer/shared";
import { useOperatorAccountProfile } from "@/hooks/useOperatorAccountProfile";
import {
  buildOperatorPreviewProfile,
  clearOperatorAccountProfile,
  getDefaultOperatorAccountProfile,
  saveOperatorAccountProfile,
} from "@/lib/operator-profile";
import type { AdminProfile } from "@/types/admin";

export function OperatorAccountSettings({ admin }: { admin: AdminProfile | null }) {
  const [storedProfile] = useOperatorAccountProfile(admin);
  const [draft, setDraft] = useState(storedProfile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  function setField<K extends keyof typeof draft>(field: K, value: (typeof draft)[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setSaveState("idle");
    setSaveMessage("");
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        return;
      }

      setField("avatarSrc", reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaveState("saving");
    setSaveMessage("");

    let nextAvatarSrc = draft.avatarSrc;

    if (avatarFile) {
      const avatarFormData = new FormData();
      avatarFormData.append("file", avatarFile, avatarFile.name);

      const avatarResponse = await fetch("/api/admin/auth/me/avatar", {
        method: "POST",
        body: avatarFormData,
      });

      const avatarPayload = (await avatarResponse.json().catch(() => null)) as
        | { message?: string; avatarUrl?: string | null; avatarAssetKey?: string | null }
        | null;

      if (!avatarResponse.ok) {
        setSaveState("error");
        setSaveMessage(avatarPayload?.message ?? "Could not upload avatar image.");
        return;
      }

      nextAvatarSrc =
        avatarPayload?.avatarUrl?.trim() ||
        avatarPayload?.avatarAssetKey?.trim() ||
        nextAvatarSrc;
    }

    const response = await fetch("/api/admin/auth/me/profile", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        username: draft.username,
        displayName: draft.displayName,
        avatarAssetKey: nextAvatarSrc ? undefined : null,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setSaveState("error");
      setSaveMessage(payload?.message ?? "Could not save operator profile.");
      return;
    }

    const savedProfile = {
      ...draft,
      avatarSrc: nextAvatarSrc,
    };

    setDraft(savedProfile);
    setAvatarFile(null);
    saveOperatorAccountProfile(savedProfile);
    setSaveState("saved");
    setSaveMessage("Profile saved. Author identity is now persisted.");
  }

  function handleReset() {
    clearOperatorAccountProfile();
    setDraft(getDefaultOperatorAccountProfile(admin));
    setAvatarFile(null);
    setSaveState("idle");
    setSaveMessage("");

    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }

  const previewProfile = buildOperatorPreviewProfile(draft);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_25rem]">
      <SectionCard
        title="Operator account profile"
        description="Email stays locked to the admin account. Username, display name, avatar, and the post-page role line are managed here."
      >
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Account email">
              <input value={draft.email} disabled className={`${textInputClassName()} opacity-70`} />
            </Field>

            <Field label="Username">
              <input
                value={draft.username}
                onChange={(event) => setField("username", event.target.value)}
                className={textInputClassName()}
                placeholder="cryptodaily"
              />
            </Field>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Display name">
              <input
                value={draft.displayName}
                onChange={(event) => setField("displayName", event.target.value)}
                className={textInputClassName()}
                placeholder="CryptoDaily"
              />
            </Field>

            <Field label="Role line">
              <input value={draft.authorRole} disabled className={`${textInputClassName()} opacity-70`} />
            </Field>
          </div>

          <Field label="Avatar image">
            <div className="space-y-3">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/avif"
                onChange={handleAvatarChange}
                className="min-h-11 rounded-[1rem] border border-[color:var(--color-border)] bg-white px-4 py-3 text-[0.9rem] text-[var(--color-text)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-brand-soft)] file:px-3.5 file:py-2 file:text-[0.82rem] file:font-medium file:text-[var(--color-brand-strong)]"
              />

              <div className="rounded-[1.2rem] border border-dashed border-[color:var(--color-border)] bg-white/80 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {draft.avatarSrc ? (
                      <div className="relative h-14 w-14 overflow-hidden rounded-full shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
                        <Image
                          src={draft.avatarSrc}
                          alt={`${draft.displayName} avatar`}
                          fill
                          unoptimized
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(180deg,#f7f3ff_0%,#ffffff_100%)] text-[1rem] font-semibold text-[var(--color-brand)] shadow-[0_10px_24px_rgba(24,24,27,0.12)]">
                        {previewProfile.initials}
                      </div>
                    )}

                    <div>
                      <p className="text-[0.88rem] font-medium text-[var(--color-text)]">
                        {draft.avatarSrc ? "Avatar selected" : "No avatar uploaded yet"}
                      </p>
                      <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                        This image will be shown in the post author block and story preview.
                      </p>
                      <p className="mt-1 text-[0.8rem] text-[var(--color-text-soft)]">
                        Production note: store the file in R2 and keep only the asset key in the database.
                      </p>
                    </div>
                  </div>

                  {draft.avatarSrc ? (
                    <button
                      type="button"
                      onClick={() => {
                        setField("avatarSrc", null);
                        setAvatarFile(null);

                        if (avatarInputRef.current) {
                          avatarInputRef.current.value = "";
                        }
                      }}
                      className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--color-border)] bg-white px-3.5 text-[0.82rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50"
                    >
                      Remove avatar
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </Field>

          <Field label="Why this structure">
            <textarea
              value="Recommended backend shape: keep email and password on admin_users, then add username, display_name, role, and avatar_asset_key so querying the active operator is simple."
              readOnly
              className={`${textareaClassName()} min-h-24 opacity-75`}
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--color-border)] pt-4">
            <p className="text-[0.82rem] text-[var(--color-text-soft)]">
              {saveState === "saved"
                ? saveMessage
                : saveState === "saving"
                  ? "Saving operator profile..."
                  : saveState === "error"
                    ? saveMessage
                    : "Save these values now so the story preview and composer use them."}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex min-h-10 items-center rounded-full border border-[color:var(--color-border)] bg-white px-4 text-[0.84rem] font-medium text-[var(--color-text)] transition-colors hover:bg-zinc-50"
              >
                Reset defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveState === "saving"}
                className="inline-flex min-h-10 items-center rounded-full bg-[linear-gradient(180deg,var(--color-brand)_0%,var(--color-brand-strong)_100%)] px-4 text-[0.84rem] font-semibold text-white shadow-[0_10px_22px_rgba(90,40,223,0.2)]"
              >
                {saveState === "saving" ? "Saving..." : "Save profile"}
              </button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Post author preview"
        description="This is the exact operator identity block the composer will use for the post page preview."
      >
        <div className="space-y-4">
          <OperatorProfileCard operator={previewProfile} />

          <div className="rounded-[1.3rem] border border-[color:var(--color-border)] bg-white px-4 py-4 shadow-[0_10px_26px_rgba(24,24,27,0.04)]">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
              Public values
            </p>
            <dl className="mt-4 space-y-3 text-[0.84rem]">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--color-text-soft)]">Username</dt>
                <dd className="font-medium text-[var(--color-text)]">@{draft.username}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--color-text-soft)]">Display name</dt>
                <dd className="font-medium text-[var(--color-text)]">{draft.displayName}</dd>
              </div>
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--color-text-soft)]">Author line</dt>
                <dd className="max-w-[13rem] text-right font-medium text-[var(--color-text)]">
                  {draft.authorRole}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

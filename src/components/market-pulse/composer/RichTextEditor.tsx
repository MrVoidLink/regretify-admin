"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { editorEmojiOptions } from "@/components/market-pulse/composer/config";

function EditorToolbarButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--color-border)] bg-white px-3 text-[0.76rem] font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-brand-soft)]"
    >
      {label}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (nextValue: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function syncEditorHtml() {
    onChange(editorRef.current?.innerHTML ?? "");
  }

  function focusEditor() {
    editorRef.current?.focus();
  }

  function runCommand(command: string, commandValue?: string) {
    focusEditor();
    document.execCommand(command, false, commandValue);
    syncEditorHtml();
  }

  function insertHtml(html: string) {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    syncEditorHtml();
  }

  function insertEmoji(emoji: string) {
    insertHtml(`<span>${emoji}</span>`);
    setIsEmojiPickerOpen(false);
  }

  function handleAddLink() {
    const url = window.prompt("Link URL");

    if (!url) {
      return;
    }

    runCommand("createLink", url);
  }

  function handleAddImageUrl() {
    const url = window.prompt("Image URL");

    if (!url) {
      return;
    }

    insertHtml(
      `<figure><img src="${url}" alt="" style="width:100%;border-radius:1rem;margin:0;" /></figure>`,
    );
  }

  function handleEditorImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageSrc = typeof reader.result === "string" ? reader.result : "";

      if (!imageSrc) {
        return;
      }

      insertHtml(
        `<figure><img src="${imageSrc}" alt="${file.name}" style="width:100%;border-radius:1rem;margin:0;" /></figure>`,
      );
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  return (
    <div className="rounded-[1.3rem] border border-[color:var(--color-border)] bg-white shadow-[0_10px_26px_rgba(24,24,27,0.04)]">
      <div className="flex flex-wrap gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
        <EditorToolbarButton label="H2" onClick={() => runCommand("formatBlock", "<h2>")} />
        <EditorToolbarButton label="P" onClick={() => runCommand("formatBlock", "<p>")} />
        <EditorToolbarButton label="Bold" onClick={() => runCommand("bold")} />
        <EditorToolbarButton label="Italic" onClick={() => runCommand("italic")} />
        <EditorToolbarButton
          label="Bullet List"
          onClick={() => runCommand("insertUnorderedList")}
        />
        <EditorToolbarButton
          label="Quote"
          onClick={() => runCommand("formatBlock", "<blockquote>")}
        />
        <EditorToolbarButton label="Link" onClick={handleAddLink} />
        <EditorToolbarButton label="Image URL" onClick={handleAddImageUrl} />
        <EditorToolbarButton
          label="Upload Image"
          onClick={() => imageInputRef.current?.click()}
        />
        <EditorToolbarButton
          label={isEmojiPickerOpen ? "Close Emoji" : "Emoji"}
          onClick={() => setIsEmojiPickerOpen((current) => !current)}
        />
      </div>

      {isEmojiPickerOpen ? (
        <div className="flex flex-wrap gap-2 border-b border-[color:var(--color-border)] px-4 py-3">
          {editorEmojiOptions.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => insertEmoji(emoji)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-white text-[1.2rem] transition-colors hover:bg-[var(--color-brand-soft)]"
            >
              {emoji}
            </button>
          ))}
        </div>
      ) : null}

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncEditorHtml}
        className="min-h-[20rem] px-4 py-4 text-[0.95rem] leading-7 text-zinc-800 outline-none [&_blockquote]:rounded-[1rem] [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--color-brand)] [&_blockquote]:bg-[var(--color-brand-soft)] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:text-zinc-700 [&_figure]:my-5 [&_h2]:type-title [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:text-[1.35rem] [&_h2]:font-semibold [&_h2]:text-zinc-950 [&_img]:w-full [&_img]:rounded-[1rem] [&_img]:object-cover [&_li]:ml-5 [&_li]:list-disc [&_p]:mb-4"
      />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        onChange={handleEditorImageUpload}
        className="hidden"
      />
    </div>
  );
}

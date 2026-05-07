"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Eraser,
} from "lucide-react";
import { StudioFieldLabel } from "./StudioBrand";

/**
 * Convert legacy plain-text bodies into the same HTML the editor produces, so
 * that the first time an editor opens an old entry the content already looks
 * the way it will render on the public site. The legacy format is the one the
 * public event detail page used to render with `whitespace-pre-line`:
 * - paragraphs split on blank lines
 * - `*text*` rendered as `<em>text</em>`
 *
 * If the input already contains HTML tags, return it as-is.
 */
export function legacyBodyToHtml(input: string): string {
  if (!input) return "";
  if (/<[a-z][\s\S]*>/i.test(input)) return input;

  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const paragraphs = input
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return paragraphs
    .map((p) => {
      const escaped = escapeHtml(p)
        .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br />");
      return `<p>${escaped}</p>`;
    })
    .join("");
}

/**
 * True if the provided body string is already HTML (i.e. produced by the
 * rich text editor) rather than legacy plain text. Used by the public
 * renderer to choose between safe HTML rendering and the legacy fallback.
 */
export function isHtmlBody(input: string | null | undefined): boolean {
  if (!input) return false;
  return /<[a-z][\s\S]*>/i.test(input);
}

/* ------------------------------------------------------------------ */
/* Toolbar primitives                                                  */
/* ------------------------------------------------------------------ */

function ToolbarButton({
  active,
  onClick,
  ariaLabel,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
        active
          ? "bg-black text-white"
          : "text-black/65 hover:bg-black/[0.05] hover:text-black focus-visible:bg-black/[0.05] focus-visible:text-black"
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-black/10" />;
}

/* ------------------------------------------------------------------ */
/* Editor                                                              */
/* ------------------------------------------------------------------ */

export function StudioRichTextEditor({
  label,
  hint,
  value,
  onChange,
  placeholder = "Start writing…",
  minRows = 8,
}: {
  label: string;
  hint?: React.ReactNode;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  minRows?: number;
}) {
  // Convert legacy plain text on first mount so the editor opens with the
  // user's existing content already rendered as HTML.
  const initialContent = React.useMemo(() => legacyBodyToHtml(value), []); // eslint-disable-line react-hooks/exhaustive-deps

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Drop default code block / horizontal rule from the toolbar surface;
        // they're still available via shortcuts if anyone wants them.
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          class: "underline decoration-black/40 underline-offset-[0.18em]",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          "is-editor-empty before:content-[attr(data-placeholder)] before:text-black/35 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        // `prose` matches the public site's typography exactly (see globals
        // theming + tailwindcss-typography plugin), so what you see here is
        // what readers see. iOS Safari zooms into inputs <16px on focus so we
        // keep the body at base text size on phones and scale up on `sm+`.
        class:
          "prose prose-rcablk max-w-none focus:outline-none px-4 py-3 font-serif text-base leading-relaxed text-black sm:px-5 sm:py-4 sm:text-[1.05rem]",
        style: `min-height: ${minRows * 1.6}rem`,
      },
    },
    onUpdate({ editor }) {
      // Treat an empty document (just <p></p>) as empty string so the body
      // round-trips cleanly through the existing string field.
      const html = editor.isEmpty ? "" : editor.getHTML();
      onChange(html);
    },
    immediatelyRender: false,
  });

  // Keep the editor in sync if the parent reset the value externally (e.g.
  // form discards). Skip when the value is what we just emitted — TipTap's
  // own `getHTML()` is the source of truth in that case.
  React.useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    const next = legacyBodyToHtml(value);
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  function promptForLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("Link URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div>
      <StudioFieldLabel hint={hint}>{label}</StudioFieldLabel>

      <div className="mt-2 overflow-hidden rounded-md border border-black/15 bg-white transition-colors focus-within:border-black">
        {/* Toolbar — wraps to multiple rows on phones */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-black/[0.02] px-1.5 py-1.5 sm:px-2">
          <ToolbarButton
            ariaLabel="Bold"
            active={editor?.isActive("bold")}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={!editor}
          >
            <Bold size={15} strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            ariaLabel="Italic"
            active={editor?.isActive("italic")}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={!editor}
          >
            <Italic size={15} strokeWidth={2.25} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            ariaLabel="Heading 2"
            active={editor?.isActive("heading", { level: 2 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={!editor}
          >
            <Heading2 size={16} strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            ariaLabel="Heading 3"
            active={editor?.isActive("heading", { level: 3 })}
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={!editor}
          >
            <Heading3 size={16} strokeWidth={2.25} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            ariaLabel="Bulleted list"
            active={editor?.isActive("bulletList")}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={!editor}
          >
            <List size={16} strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            ariaLabel="Numbered list"
            active={editor?.isActive("orderedList")}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={!editor}
          >
            <ListOrdered size={16} strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            ariaLabel="Quote"
            active={editor?.isActive("blockquote")}
            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
            disabled={!editor}
          >
            <Quote size={15} strokeWidth={2.25} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            ariaLabel="Add link"
            active={editor?.isActive("link")}
            onClick={promptForLink}
            disabled={!editor}
          >
            <LinkIcon size={15} strokeWidth={2.25} />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            ariaLabel="Clear formatting"
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .clearNodes()
                .unsetAllMarks()
                .run()
            }
            disabled={!editor}
          >
            <Eraser size={15} strokeWidth={2.25} />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

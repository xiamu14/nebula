"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect, useState } from "react";
import { dayTemplate } from "./templates/day";

interface EditorProps {
  date?: string; // ISO date string (e.g., "2025-11-16")
  onSave?: (markdown: string) => Promise<void>;
}

// Our <Editor> component we can reuse later
export default function Editor({ date, onSave }: EditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    placeholders: {
      default: "Records bloom for myself",
    },
  });

  // Load data from API or use template
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        if (date) {
          // Try to load existing data
          const response = await fetch(`/api/day?date=${date}`);
          const { dayMeta } = await response.json();

          if (dayMeta && dayMeta.markdown) {
            const blocks = await editor.tryParseMarkdownToBlocks(
              dayMeta.markdown
            );
            editor.replaceBlocks(editor.document, blocks);
          } else {
            // Use template for new day
            const blocks = await editor.tryParseMarkdownToBlocks(dayTemplate);
            editor.replaceBlocks(editor.document, blocks);
          }
        } else {
          // No date provided, use template
          const blocks = await editor.tryParseMarkdownToBlocks(dayTemplate);
          editor.replaceBlocks(editor.document, blocks);
        }
      } catch (error) {
        console.error("Error loading day data:", error);
        // Fallback to template on error
        const blocks = await editor.tryParseMarkdownToBlocks(dayTemplate);
        editor.replaceBlocks(editor.document, blocks);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [editor, date]);

  // Save function
  const handleSave = async () => {
    if (!date) {
      console.error("Cannot save without a date");
      return;
    }

    setIsSaving(true);

    try {
      const markdown = await editor.blocksToMarkdownLossy(editor.document);

      if (onSave) {
        await onSave(markdown);
      } else {
        // Default save to API
        await fetch("/api/day", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, markdown }),
        });

        // Trigger AI analysis
        const analyticResponse = await fetch("/api/analytic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ date, markdown }),
        });

        if (analyticResponse.ok) {
        } else {
          const error = await analyticResponse.json();
        }
      }

      // Clear status after 3 seconds
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Renders the editor instance using a React component.
  return (
    <div className="w-full">
      <BlockNoteView editor={editor} className="w-full" />
      {date && (
        <div className="flex flex-col items-end gap-2 mt-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-lg text-white transition-colors disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

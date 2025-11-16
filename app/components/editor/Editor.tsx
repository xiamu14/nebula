"use client"; // this registers <Editor> as a Client Component
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEffect } from "react";
import { dayTemplate } from "./templates/day";

// Our <Editor> component we can reuse later
export default function Editor() {
  // Creates a new editor instance.
  const editor = useCreateBlockNote({
    placeholders: {
      default: "Records bloom for myself",
    },
  });

  useEffect(() => {
    async function loadInitialHTML() {
      const blocks = await editor.tryParseMarkdownToBlocks(dayTemplate);
      editor.replaceBlocks(editor.document, blocks);
    }
    loadInitialHTML();
  }, [editor]);

  // Renders the editor instance using a React component.
  return <BlockNoteView editor={editor} className="w-full" />;
}

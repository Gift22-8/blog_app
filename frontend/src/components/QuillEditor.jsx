import React, { useEffect, useRef } from "react";
import Quill from "quill";

export default function QuillEditor({ value, onChange, placeholder }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder: placeholder || "Write your story here... You can add headings, quotes, photos, and videos!",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    if (value) {
      quill.root.innerHTML = value;
    }

    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      if (onChange) {
        onChange(html === "<p><br></p>" ? "" : html);
      }
    });
  }, []);

  // Update content if value changes externally (e.g., loaded during edit)
  useEffect(() => {
    if (quillRef.current && value !== undefined && value !== quillRef.current.root.innerHTML) {
      if (document.activeElement !== quillRef.current.root) {
        quillRef.current.root.innerHTML = value || "";
      }
    }
  }, [value]);

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-[#202938] bg-white dark:bg-[#11161f]">
      <div ref={containerRef} style={{ minHeight: "280px" }} />
    </div>
  );
}

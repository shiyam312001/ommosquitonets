"use client";

import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function RichTextEditor({ label, value = "", onChange, className }) {
  const ref = useRef(null);
  const [html, setHtml] = useState(value || "");

  useEffect(() => setHtml(value || ""), [value]);

  useEffect(() => {
    if (ref.current && html !== ref.current.innerHTML) {
      ref.current.innerHTML = html;
    }
  }, [html]);

  function exec(command, arg = null) {
    document.execCommand(command, false, arg);
    const newHtml = ref.current?.innerHTML || "";
    setHtml(newHtml);
    onChange?.(newHtml);
  }

  function onInput() {
    const newHtml = ref.current?.innerHTML || "";
    setHtml(newHtml);
    onChange?.(newHtml);
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}

      <div className="mb-2 flex gap-2">
        <button type="button" onClick={() => exec("bold")} className="px-2 py-1 rounded-md bg-slate-100">B</button>
        <button type="button" onClick={() => exec("italic")} className="px-2 py-1 rounded-md bg-slate-100">I</button>
        <button type="button" onClick={() => exec("underline")} className="px-2 py-1 rounded-md bg-slate-100">U</button>
        <button type="button" onClick={() => exec("insertUnorderedList")} className="px-2 py-1 rounded-md bg-slate-100">• List</button>
        <button type="button" onClick={() => exec("insertOrderedList")} className="px-2 py-1 rounded-md bg-slate-100">1. List</button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) exec("createLink", url);
          }}
          className="px-2 py-1 rounded-md bg-slate-100"
        >
          Link
        </button>
        <button type="button" onClick={() => exec("removeFormat")} className="px-2 py-1 rounded-md bg-slate-100">Clear</button>
      </div>

      <div
        ref={ref}
        onInput={onInput}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[120px] px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

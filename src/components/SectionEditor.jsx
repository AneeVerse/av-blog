"use client"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const SectionEditor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    }
  })

  return (
    <div className="border rounded-md p-2">
      <EditorContent editor={editor} />
    </div>
  )
}

export default SectionEditor
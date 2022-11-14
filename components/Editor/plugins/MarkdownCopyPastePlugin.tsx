import { $convertFromMarkdownString } from "@lexical/markdown"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { COMMAND_PRIORITY_EDITOR, PASTE_COMMAND } from "lexical"
import { useEffect } from "react"
import { TRANSFORMERS } from "./MarkdownShortcutsPlugin"

export default function MarkdownCopyPastePlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        editor.registerCommand<ClipboardEvent>(
            PASTE_COMMAND,
            (event) => {
                const pastedText = event.clipboardData?.getData('Text')
                
                if (pastedText) {
                    editor.update(() => {
                        $convertFromMarkdownString(pastedText, TRANSFORMERS)
                    })
                }

                return true
            },
            COMMAND_PRIORITY_EDITOR
        )
    }, [editor])

    return null
}
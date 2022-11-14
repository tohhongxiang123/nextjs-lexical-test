import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CodeNode } from '@lexical/code';
import { useEffect } from "react";
import { $getNodeByKey, $createTextNode } from "lexical";
import { EquationNode } from "../nodes/EquationNode";

/**
 * Add trailing paragraph after Nodes
 */
export default function TrailingParagraphPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        const removeUpdateListener = editor.registerMutationListener(
            EquationNode,
            (mutatedNodes) => {
                for (let [nodeKey, mutation] of mutatedNodes) {
                    if (mutation === "created") {
                        editor.update(() => {
                            const equationNode = $getNodeByKey<EquationNode>(nodeKey)

                            if (equationNode?.isInline) {
                                equationNode?.insertAfter($createTextNode(" "))
                            }
                        })
                    }
                }
            }
        )

        return () => removeUpdateListener()
    }, [editor])

    useEffect(() => {
        const removeUpdateListener = editor.registerMutationListener(
            CodeNode,
            (mutatedNodes) => {
                for (let [nodeKey, mutation] of mutatedNodes) {
                    if (mutation === "created") {
                        editor.update(() => {
                            const codeNode = $getNodeByKey<CodeNode>(nodeKey)
                            codeNode?.insertAfter($createTextNode(" "))
                        })
                    }
                }
            }
        )

        return () => removeUpdateListener()
    }, [editor])

    return null
}
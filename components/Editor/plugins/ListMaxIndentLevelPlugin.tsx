import type { RangeSelection } from 'lexical';

import { $getListDepth, $isListItemNode, $isListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isElementNode,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    ElementNode,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

function getElementNodesInSelection(
    selection: RangeSelection,
): Set<ElementNode> {
    const nodesInSelection = selection.getNodes();

    if (nodesInSelection.length === 0) {
        return new Set([
            selection.anchor.getNode().getParentOrThrow(),
            selection.focus.getNode().getParentOrThrow(),
        ]);
    }

    return new Set(
        nodesInSelection.map((n) => ($isElementNode(n) ? n : n.getParentOrThrow())),
    );
}

function isIndentPermitted(): boolean {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
        return false;
    }

    const elementNodesInSelection: Set<ElementNode> =
        getElementNodesInSelection(selection);

    for (const elementNode of elementNodesInSelection) {
        if ($isListNode(elementNode)) {
            const previousList = elementNode.getPreviousSibling()
            const previousDepth = $isListNode(previousList) ? $getListDepth(previousList) : 0

            const currentDepth = $getListDepth(elementNode)
            return currentDepth <= previousDepth + 1
        } else if ($isListItemNode(elementNode)) {
            const parent = elementNode.getParent()

            if (!$isListNode(parent)) {
                throw new Error(
                    'ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.',
                );
            }

            const currentDepth = $getListDepth(parent)

            const previousItem = elementNode.getPreviousSibling()
            // if previous item is a list node, we can directly use it
            // if previous item is a list item node, we must access the list instead
            const previousList = $isListNode(previousItem) ? previousItem : $isListItemNode(previousItem) ? previousItem.getParent() : null
            const previousDepth = $isListNode(previousList) ? $getListDepth(previousList) : 0

            return currentDepth <= previousDepth + 1
        }
    }

    return false
}

function isOutdentPermitted(): boolean {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
        return false;
    }

    const elementNodesInSelection: Set<ElementNode> =
        getElementNodesInSelection(selection);

    for (const elementNode of elementNodesInSelection) {
        if ($isListNode(elementNode)) {
            const nextList = elementNode.getNextSibling()
            const nextDepth = $isListNode(nextList) ? $getListDepth(nextList) : 0

            const currentDepth = $getListDepth(elementNode)
            return currentDepth > nextDepth - 1
        } else if ($isListItemNode(elementNode)) {
            const parent = elementNode.getParent()

            if (!$isListNode(parent)) {
                throw new Error(
                    'ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.',
                );
            } 

            const currentDepth = $getListDepth(parent)

            const nextItem = elementNode.getNextSibling()
            // if previous item is a list node, we can directly use it
            // if previous item is a list item node, we must access the list instead
            const nextList = $isListNode(nextItem) ? nextItem : $isListItemNode(nextItem) ? nextItem.getParent() : null

            console.log({ nextItem, nextItemContent: nextItem?.getTextContent(), nextList, c: nextList?.getTextContent(), d: $getListDepth(nextList as any) })
            const nextDepth = $isListNode(nextList) ? $getListDepth(nextList) : 0

            return currentDepth > nextDepth - 1
        }
    }

    return false
}

export default function ListMaxIndentLevelPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            INDENT_CONTENT_COMMAND,
            () => !isIndentPermitted(),
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor]);
    useEffect(() => {
        return editor.registerCommand(
            OUTDENT_CONTENT_COMMAND,
            () => !isOutdentPermitted(),
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor]);
    return null;
}
import { $getRoot, $getSelection, EditorState, LexicalEditor } from 'lexical';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import allNodes from './nodes';
import theme from './themes';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import TrailingParagraphPlugin from './plugins/TrailingParagraphPlugin';
import MarkdownCopyPastePlugin from './plugins/MarkdownCopyPastePlugin';
import { TRANSFORMERS } from './plugins/MarkdownShortcutsPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import AutofocusPlugin from './plugins/AutofocusPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState, editor: LexicalEditor) {
    editorState.read(() => {
        // Read the contents of the EditorState here.
        const root = $getRoot();
        const selection = $getSelection();

        console.log(root, selection, root.getTextContent());
    });
}

export default function Editor() {
    const initialConfig = {
        namespace: 'LexicalMarkdownRichTextEditor',
        theme,
        onError: (error: Error) => console.error(error),
        nodes: [...allNodes],
    };

    return (
        <div style={{ position: 'relative' }}>
            <LexicalComposer initialConfig={initialConfig}>
                <ListPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                <RichTextPlugin
                    contentEditable={<ContentEditable />}
                    placeholder={<div>Enter some text...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <OnChangePlugin onChange={onChange} />
                <EquationsPlugin />
                <HistoryPlugin />
                <CodeHighlightPlugin />
                <TrailingParagraphPlugin />
                <MarkdownCopyPastePlugin />
                <AutofocusPlugin />
                <ListMaxIndentLevelPlugin />
            </LexicalComposer>
        </div>
    );
}
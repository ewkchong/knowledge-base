import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

function Editor() {
	return (
		<div>
			<CodeMirror extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} />
		</div>
	);
}

export default Editor;

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';

function EditorWindow({ value }: any) {
  const onChange = React.useCallback((value: any, viewUpdate: any) => {
    console.log('value:', value);
  }, []);
	return (
			<CodeMirror 
			value={value}
			extensions={[markdown({ base: markdownLanguage, codeLanguages: languages })]} 
			onChange={onChange}
			/>
	);
}

export default EditorWindow;

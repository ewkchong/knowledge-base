import {EditorState, Line} from "@codemirror/state"
import {EditorView, keymap, placeholder, ViewUpdate, ViewPlugin, Decoration, DecorationSet} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"

function setLineDecoration(decorations: any[], text: string) {
	if (text.length == 0) return;

	switch (text[0]) {
		case "#":
			break;
		case "":
			break;
		default:
			break;
	}
}

function specialMarkdowns(view: EditorView): DecorationSet {
  let decorations: any[] = []
  const doc = view.state.doc;
  for (let lineNum = 1; lineNum <= doc.lines; lineNum++) {
	 const line: Line = doc.line(lineNum);

	 setLineDecoration(decorations, line.text);
	 
     if (line.text && line.text[0] == "#") {
       let deco = Decoration.line({
		  class: "cm-h1"
       })
	  decorations.push(deco.range(line.from));
	}
  }
  return Decoration.set(decorations)
}

const markdownPlugin = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = specialMarkdowns(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = specialMarkdowns(update.view)
  }
}, {
  decorations: v => v.decorations,
})

let startState = EditorState.create({
  doc: "",
  extensions: [
	  keymap.of(defaultKeymap),
	  markdownPlugin,
	  placeholder("Start typing...")
  ]
})

let view = new EditorView({
  state: startState,
  parent: document.body
})



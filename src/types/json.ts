export type JsonEditorHandle = {
  /** Replaces the whole text as one undoable step. */
  replaceContent: (text: string) => void;
  undo: () => void;
  redo: () => void;
  goTo: (offset: number) => void;
  focus: () => void;
};

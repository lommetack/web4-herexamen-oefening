import { Editor } from "../components/Editor";

const Note = () => {
  const { note } = { note: {} };

  return <Editor note={note} key={note.id} />;
};

export default Note;

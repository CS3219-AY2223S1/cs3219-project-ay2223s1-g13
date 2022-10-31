import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebrtcProvider } from 'y-webrtc';

const CodeEditor = (props) => {
    let reactQuillRef = null;
    let quillRef = null;

    React.useEffect(() => {
        quillRef = reactQuillRef.getEditor();
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quillRef)
        console.log("connecting to room " + props.room_id)
        const provider = new WebrtcProvider(props.room_id, ydoc)
    }, [])

  return (
    <div>
        <ReactQuill ref={e => { reactQuillRef = e }} theme={'snow'} />
    </div>
  )
}

export default CodeEditor;
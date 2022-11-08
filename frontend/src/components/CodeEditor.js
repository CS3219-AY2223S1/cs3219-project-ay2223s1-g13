import React from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import * as Y from 'yjs';
import { QuillBinding } from 'y-quill';
import { WebrtcProvider } from 'y-webrtc';
import "./CodeEditor.css"

const CodeEditor = (props) => {
    let reactQuillRef = null;
    const quillRef = React.useRef(null);

    React.useEffect(() => {
        quillRef.current = reactQuillRef.getEditor();
        const ydoc = new Y.Doc()
        const ytext = ydoc.getText('quill')
        const binding = new QuillBinding(ytext, quillRef.current)
        const provider = new WebrtcProvider(props.room_id, ydoc)
    }, [props.room_id, reactQuillRef])

    const modules = {
        toolbar: [
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike',],
          [
            { indent: '-1' },
            { indent: '+1' },
          ],
        ]
      }

    return (
        <div>
            <ReactQuill 
                ref={e => { reactQuillRef = e }} 
                theme={'snow'} 
                modules={modules} />
        </div>
    )
}

export default CodeEditor;
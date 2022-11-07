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
        const provider = new WebrtcProvider(props.room_id, ydoc)
    }, [])

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
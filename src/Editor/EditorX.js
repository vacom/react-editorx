import React, { useEffect, useMemo } from "react";
import EditorJS from "@editorjs/editorjs";
//Tools
import Warning from "@editorjs/warning";
import Table from "@editorjs/table";
import SimpleImage from "@editorjs/simple-image";
import Marker from "@editorjs/marker";
import List from "@editorjs/list";
import InlineCode from "@editorjs/inline-code";
import Header from "@editorjs/header";
import Delimiter from "@editorjs/delimiter";
import CodeTool from "@editorjs/code";
import Checklist from "@editorjs/checklist";
import Quote from "@editorjs/quote";

const tools = {
  header: {
    class: Header,
    inlineToolbar: ["link"],
    config: {
      placeholder: "Header"
    },
    shortcut: "CMD+SHIFT+H"
  },
  image: {
    class: SimpleImage,
    inlineToolbar: ["link"]
  },
  list: {
    class: List,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+L"
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author"
    },
    shortcut: "CMD+SHIFT+O"
  },
  warning: Warning,
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M"
  },
  code: {
    class: CodeTool,
    shortcut: "CMD+SHIFT+C"
  },
  delimiter: Delimiter,
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+C"
  },
  table: {
    class: Table,
    inlineToolbar: true,
    shortcut: "CMD+ALT+T"
  }
};

function Editor({
  onChange,
  onReady,
  holderId,
  holderProps,
  as: Component,
  ...props
}) {
  const editorHolder = useMemo(() => holderId || "editor-holder", [holderId]);
  const editor = useMemo(
    () =>
      new EditorJS({
        holder: editorHolder,
        ...props,
        tools,
        onChange: async () => {
          if (editor) {
            const output = await editor.save();
            onChange(output);
          }
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props]
  );

  const onRemoveEditor = async () => {
    if (editor) {
      try {
        await editor.isReady;
        return editor.destroy();
      } catch (err) {
        throw err;
      }
    }

    return false;
  };

  const onInitEditor = async () => {
    try {
      await editor.isReady;
      const res = {
        loading: false,
        error: false,
        mgs: "Editor.js is ready to work!"
      };
      return onReady(res);
    } catch (error) {
      const res = {
        loading: false,
        error: true,
        mgs: `Editor.js initialization failed because of ${error}`
      };
      return onReady(res);
    }
  };

  useEffect(() => {
    onInitEditor();
    return () => onRemoveEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Component id={editorHolder} {...holderProps} />;
}

Editor.defaultProps = {
  editorHolder: "editor-holder",
  as: "div"
};

export default Editor;

import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  FileTree,
  FileTreeProps,
  TreeNode,
  utils,
} from "@sinm/react-file-tree";
import FileItemWithFileIcon from "@sinm/react-file-tree/lib/FileItemWithFileIcon";
import "@sinm/react-file-tree/icons.css";
import "@sinm/react-file-tree/styles.css";
import _ from "lodash";

const sorter = (treeNodes: TreeNode[]) =>
  _.orderBy(
    treeNodes,
    [
      (node: { type: string }) => (node.type === "directory" ? 0 : 1),
      (node: { uri: string }) => utils.getFileName(node.uri),
    ],
    ["asc", "asc"]
  );

const loadTree = () => {
  return import("./tree.json").then((module) => module.default as TreeNode);
};

const EditorComponent = () => {
  const languageOptions = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "C#", value: "csharp" },
    { label: "C++", value: "cpp" },
    { label: "TypeScript", value: "typescript" },
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "JSON", value: "json" },
  ];

  const [tree, setTree] = useState<TreeNode | undefined>();
  useEffect(() => {
    loadTree()
      // expand root node
      .then((tree) => Object.assign(tree, { expanded: true }))
      .then(setTree);
  }, []);
  const toggleExpanded: FileTreeProps["onItemClick"] = (treeNode) => {
    setTree((tree) =>
      utils.assignTreeNode(tree, treeNode.uri, {
        expanded: !treeNode.expanded,
      })
    );
  };

  // you can customize item renderer
  const itemRender = (treeNode: TreeNode) => (
    <FileItemWithFileIcon treeNode={treeNode} />
  );

  const [language, setLanguage] = useState("javascript");

  const files = {
    "index.html": "<!DOCTYPE html>...",
    "style.css": "body { background: #1e1e1e; }",
    "app.js": 'console.log("Hello World")',
  };

  // Track state
  const [currentFile, setCurrentFile] = useState("app.js");

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        style={{ marginBottom: "8px", width: "150px", padding: "4px" }}
      >
        {languageOptions.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* File Tree Panel - 25% width */}
        <div
          style={{
            width: "20%",
            minWidth: "150px",
            height: "100%",
            overflow: "auto",
            background: "#1e1e1e",
            borderRight: "1px solid #333",
            color:"white"
          }}
        >
          {tree && (
            <FileTree
              itemRenderer={itemRender}
              tree={tree}
              onItemClick={toggleExpanded}
              sorter={sorter}
            />
          )}
        </div>

        {/* Editor Panel - 75% width */}
        <div
          style={{
            flex: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Editor
            height="100%"
            language={language}
            value={files[currentFile as keyof typeof files]}
            onChange={(value) => {
              // Handle editor changes if needed
            }}
            theme="vs-dark"
            options={{
              padding: { top: 10 },
              fontSize: 14,
              automaticLayout: true,
            }}
          />
        </div>
      </div>

    </div>
  );
};

export default EditorComponent;

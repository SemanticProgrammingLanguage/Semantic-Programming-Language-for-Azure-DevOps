import * as SDK from "azure-devops-extension-sdk";
import {
  ICodeEditorContribution,
  ICodeEditorContributionEndpoints
} from "azure-devops-extension-api/Git/CodeEditorTypes";

const contributionId = "semantic-code-editor-contribution";

const monarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".semantic",
  keywords: [
    "program", "object", "list", "ranges", "types", "type",
    "scopes", "scope", "nodes", "node", "relations"
  ],
  constants: ["true", "false", "null", "unknown"],
  tokenizer: {
    root: [
      [/#.*$/, "comment"],
      [/^\s*(se|sp)\s+(\d+)\s*$/, ["keyword", "number"]],
      [/"(?:[^"\\]|\\.)*"/, "string"],
      [/%\d+/, "variable"],
      [/@\d+/, "type"],
      [/\b\d+-\d+\b/, "number"],
      [/[+-]?(?:0[xX][0-9A-Fa-f]+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)/, "number"],
      [/[A-Za-z_][A-Za-z0-9_.-]*/, {
        cases: {
          "@keywords": "keyword",
          "@constants": "constant",
          "@default": "identifier"
        }
      }],
      [/->|=/, "operator"],
      [/[{}\[\]()]/, "delimiter.bracket"],
      [/[:,;]/, "delimiter"]
    ]
  }
};

const configuration = {
  comments: { lineComment: "#" },
  brackets: [
    ["{", "}"] as [string, string],
    ["[", "]"] as [string, string],
    ["(", ")"] as [string, string]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "\"", close: "\"" }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "\"", close: "\"" }
  ]
};

console.log("[Semantic] legacy CodeEditorContribution bundle loaded");

SDK.register(contributionId, () => {
  console.log("[Semantic] legacy CodeEditorContribution requested");
  const contribution: ICodeEditorContribution = {
    register: (endpoints: ICodeEditorContributionEndpoints) => {
      console.log("[Semantic] legacy registerLanguage called");
      endpoints.registerLanguage({
        extensionPoint: { id: "semantic", extensions: [".se", ".sp"] },
        monarchLanguage,
        configuration
      });
    }
  };
  return contribution;
});

SDK.init();

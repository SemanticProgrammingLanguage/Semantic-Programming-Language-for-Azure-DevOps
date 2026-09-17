# Semantic Programming Language for Azure DevOps

Hybrid Azure Repos support for `.se` and `.sp` Semantic source files.

This package deliberately uses multiple Azure DevOps extension mechanisms at the same time:

- native Monaco/Monarch `code-editor-language` registration;
- legacy `CodeEditorContribution` registration as a compatibility fallback;
- a custom repository content renderer that displays Semantic source with highlighting driven from the bundled `semantic.tmLanguage.json` rules.

Website: https://www.semantic-programming-language.com/

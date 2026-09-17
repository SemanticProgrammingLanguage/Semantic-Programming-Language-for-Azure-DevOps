# Semantic Azure DevOps Hybrid Highlighting

## Build

Open PowerShell in this folder and run:

```powershell
.\build-vsix.ps1
```

The VSIX is written to `out\`.

## Test

After uploading version 1.0.3 to the Azure DevOps Marketplace and updating the extension in your organization:

1. hard refresh Azure DevOps (`Ctrl+F5`);
2. open a `.se` or `.sp` file under Repos > Files;
3. test both the normal editor/viewer and the rendered-content view if Azure DevOps offers the toggle;
4. use browser DevTools and search Console for `[Semantic]` or `[Semantic renderer]` when diagnosing the legacy/renderer paths.

The content renderer uses the bundled TextMate grammar as its rule source, while the native editor path uses a Monaco/Monarch definition.

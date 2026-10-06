# Beautiful Voice – Colourful Semantics

Prototype workbench for the Beautiful Voice Colourful Semantics activity.

## Open a live preview without installing anything

1. Open the repository on GitHub.
2. Select the **codex/vue-migration** branch.
3. Click **Code → Codespaces → Create codespace on codex/vue-migration**.
4. Wait for the browser editor to finish setting up. Dependencies install and the preview starts automatically.
5. When GitHub shows port **8443**, click **Open in Browser** (or open the forwarded preview link).

Every new commit can be inspected in the pull request's **Files changed** tab and checked by the automatic **Build preview** workflow.

## Run locally (optional)

Install Node.js 22 LTS, then run:

```bash
corepack enable
pnpm install
pnpm dev
```

Open http://localhost:8443.

To run the same check used by GitHub:

```bash
pnpm run build
```

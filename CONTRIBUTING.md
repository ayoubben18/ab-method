# Developing the plugin

The repository root *is* the plugin — there is no second copy of the skills to keep in sync. Both manifests point at the tree the `npx` installer already ships:

```
.claude-plugin/marketplace.json     Claude Code marketplace manifest
.claude-plugin/plugin.json          Claude Code plugin manifest   (skills → ./.agents/skills/)
.agents/plugins/marketplace.json    Codex marketplace manifest
.codex-plugin/plugin.json           Codex plugin manifest         (skills → ./.agents/skills/)
.agents/skills/                     SHARED — read by both, and by the npx installer
.ab-method/                         Bundled workflows + default index.yaml
```

```bash
claude plugin validate .                          # marketplace + plugin manifests
claude --plugin-dir .                             # load without installing; /reload-plugins after edits

codex plugin marketplace add .                    # a local path works too
codex debug prompt-input | grep -o "ab-method:[a-z-]*" | sort -u   # confirm the model sees the skills
```

Rules that keep a plugin install working:

- A skill that names a `.ab-method/...` path must carry the lookup rule — project root first, then `../../../.ab-method/` relative to its `SKILL.md`. That relative path is the same in all three layouts (plugin, `.claude/skills/`, `.agents/skills/`). Copy the paragraph from any `ab-*` skill.
- Never reference another skill's files by install path (`.claude/skills/...`). Name the skill instead — the path differs per install.
- Keep `package.json` free of `dependencies` and `devDependencies`. Claude Code runs `npm install` on a plugin whose root has any, and the root *is* the plugin — semantic-release alone put 226 packages (60 MB) into every user's plugin cache. The release workflow fetches its tooling with `npx -p` instead.

**Versioning is deliberately asymmetric.** `.codex-plugin/plugin.json` carries `version`, because Codex requires it and uses it as the cache directory name; `scripts/sync-plugin-version.js` sets it from `package.json` on every release (it runs as the npm `version` script, which semantic-release triggers). `.claude-plugin/plugin.json` omits `version`: Claude Code treats it as a pin, so leaving it out makes the commit SHA the version and every push reaches users. `claude plugin validate` warns about the missing field; the warning is expected.

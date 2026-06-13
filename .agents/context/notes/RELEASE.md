# std Release Plan

This plan covers only packages under `std/*`.

## Goals

- Keep package versions independent so a hotfix for one module does not force releases for every module.
- Validate every package on Linux, macOS, and Windows before merge.
- Validate Node, Bun, and Deno compatibility before release.
- Publish npm and JSR releases from Linux only.
- Generate changelogs from package tags in commit messages.
- Run lint, tests, and vulnerability checks on commits and on a twice-weekly schedule.

## Package Layout

- Each package owns its own `package.json`, `vite.config.ts`, `tsconfig.json`, `README.md`, `LICENSE.md`, `.gitignore`, and `.npmignore`.
- Source remains in `src/` with hyphenated filenames.
- Tests remain in top-level `tests/` and use `node:test` plus `node:assert/strict`.
- `package.json` is the npm source of truth for package name, version, exports, and dependencies.
- JSR needs a checked-in or generated `jsr.json` or `deno.json` per package because `jsr publish` reads JSR name, version, and exports from that file.

## Versioning

- Use independent versions per package.
- Publish npm and JSR packages under the `@neostd` scope.
- Keep all `std/*` packages on the same major and minor version where possible.
- Allow package-specific patch versions, prerelease labels, and build metadata when packages need different hotfix or release states.
- Use std release-train tags like `std/v0.0.0-alpha.3` or `std/v0.0.4`.
- Store the next std release-train version in `std/release.json`.
- Start std package publishing at `0.0.0-alpha.0` while validating npm and JSR publishing.
- Release-train tags do not need to exactly match every package version because patch, prerelease, and build metadata may differ per package.
- When the std major or minor version is incremented, bump every `std/*` package to that major/minor even if a package did not otherwise change.
- When the std prerelease label is added, changed, or removed, update affected `std/*` package versions to match the release-train label state.
- Patch-only release-train changes must not automatically update package versions.
- Prerelease label-number-only changes, like `0.0.0-alpha.0` to `0.0.0-alpha.2`, must not automatically update package versions.
- Developers or agents should bump package patch versions or prerelease label numbers explicitly, either by script or by hand.
- Use major/minor release bumps as the point to force dependant dependency range updates across `std/*`.
- Use `package.json` as the canonical version for npm.
- Sync JSR manifest versions from `package.json` before publishing.
- Only publish from `std/v*` release tags.

## Dependency Bumps

- Add release scripts under `eng/scripts` that detect updated packages.
- The scripts should find all dependants of updated packages across `std/*`.
- The scripts should update dependants when forced to do so.
- The scripts should also update dependants automatically when an updated package has a major or minor version change.
- Patch releases should not force dependant version updates unless requested.

## Commit Tags

- Changelog generation should parse package tags from commit messages.
- Use a stable message prefix like `[std/chars] fix: handle ascii bounds` or `[std/slices] feat: add split view`.
- Commits may include more than one package tag when a change legitimately spans packages.
- Release tooling should group changelog entries by package tag and semver type.

## CI

- Run on pull requests and pushes that touch `std/**`, `eng/scripts/**`, `pnpm-workspace.yaml`, lockfiles, or workflow files.
- Use a matrix with `ubuntu-latest`, `macos-latest`, and `windows-latest`.
- Use the latest stable versions of GitHub Actions.
- Pin GitHub Actions by full commit SHA to reduce supply-chain risk.
- Install with `vp install`.
- Run `vp check` for formatting, linting, and type checks.
- Run package tests for changed `std/*` packages.
- Run `vp test` where the package has Vite+ test config.
- Run direct Node tests with `pnpm --dir std/<pkg> run test`.
- Run Bun and Deno tests from package scripts once each package has working `test:bun` and `test:deno` commands.

## Scheduled Checks

- Run at least twice weekly on `main`.
- Run `vp install`, `vp check`, package tests, Bun tests, Deno tests, and dependency audit.
- Keep this job read-only except for cache writes.

## Release Checks

- Release jobs run only on Linux.
- Release jobs run after CI passes for the same commit.
- Use the latest stable versions of GitHub Actions.
- Pin GitHub Actions by full commit SHA to reduce supply-chain risk.
- Build each selected package with `vp pack`.
- Run Node, Bun, and Deno package tests.
- Run `pnpm audit` or the Vite+ audit command if one is added.
- Run `pnpm pack` and `npm publish --dry-run` for npm packages.
- Run `pnpm dlx jsr publish --dry-run` from each package directory for JSR packages.
- On `std/v*` tags only, publish to npm and JSR after dry-runs pass.
- Skip npm and JSR publish when the package version is already present in the target registry.

## npm Publishing

- Use `std/v*` release-train tags to publish selected std packages.
- Run publish from the package directory.
- Use npm trusted publishing with GitHub Actions OIDC; do not use long-lived npm publish tokens.
- Pack with `pnpm pack` first so workspace dependency ranges are converted correctly, then publish the tarball with `npm publish`.
- Configure each npm package's trusted publisher to this repository and the `std-release.yml` workflow.
- Check npm before publishing and skip versions that already exist.
- Keep `workspace:*` dependencies internal during development, but ensure published npm manifests resolve to concrete package versions.

## JSR Publishing

- Add or generate a `jsr.json` or `deno.json` for each package before enabling publish.
- Prefer publishing TypeScript source to JSR rather than generated `esm` output.
- JSR exports should point at `src/*.ts` entrypoints.
- JSR dependencies cannot rely on unpublished `workspace:*` ranges; the release step must publish dependencies first and use concrete compatible versions.
- Before JSR/Deno publish, rewrite internal `workspace:*` package dependencies and peer dependencies to concrete `jsr:@neostd/*@<version>` ranges in `package.json`.
- Use `deno publish --allow-dirty` for JSR publishing because the release step mutates `package.json` for publish-time dependency ranges.
- Publish std packages in dependency order; for example, publish `@neostd/chars` before `@neostd/slices`.
- Skip dependent JSR dry-runs when an internal JSR dependency is not published yet; actual JSR publish waits for internal dependencies, reruns a Deno dry-run, then publishes.
- Use GitHub Actions OIDC for JSR publishing with `id-token: write` after linking each JSR package to the GitHub repository.
- Check JSR metadata before publishing and skip versions that already exist.

## Implementation Order

- Finish converting all `std/*` packages to `@neostd/*` metadata and Vite+ package layout.
- Add working `test:bun` and `test:deno` scripts for each package.
- Add JSR manifests and a sync/check script for package versions and exports.
- Add release scripts under `eng/scripts` for changed package detection and dependant bumps.
- Add CI workflow for checks and scheduled audits.
- Add release workflow with dry-run-only jobs.
- Enable npm and JSR publishing after dry-runs pass and registry scopes/packages are linked.

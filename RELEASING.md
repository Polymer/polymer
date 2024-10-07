## How to release a new version of Polymer

- `npm ci`
- `npm i -g np`
- `npx gulp update-version`
- Update CHANGELOG.md
- Edit package.json back to the previous version so that `np` can be the one
  to bump the version.
- `np --yolo --preview`
  - Ensures that you have permission, does a final check of all the steps.
- `npm pack` and diff the tgz's contents against the previous version's.
  We release a new version of Polymer rarely enough that it's worth it to be
  careful.
- `np --yolo`
- After it completes successfully it will open the GitHub releases page for
  your new version. Edit the changelist there to remove irrelevent entries and publish.

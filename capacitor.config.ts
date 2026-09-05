import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ⚠ **Frozen from the first Play upload, and this project has never made one** — so it is still
  // free to move, and it has moved with the name twice: `com.marblesort.game` -> `com.ballflow.game`
  // -> here. After an upload it is an identity rather than a label, and changing it would give the
  // store a second application with its own listing, its own reviews and no upgrade path for anyone
  // who already had it.
  //
  // How to tell it has not shipped, rather than assuming: there is no signing keystore anywhere in
  // the repo, and Play will not take an unsigned build; `android/` is gitignored, i.e. a folder
  // `npx cap add android` regenerates rather than a maintained project.
  //
  // ⚠ **Not the same standing as the storage prefix in `save.ts`.** That one guards something that
  // is live — the game ships on CrazyGames, the host backs `localStorage` up verbatim, and a rename
  // restores old names into a build reading new ones. It was moved `bf_` -> `bs_` all the same, and
  // 3442 real players lost their progress for it; read the note there before treating that as a
  // precedent. Nothing here is live, so this move cost nothing at all.
  appId: 'com.ballsort.game',
  appName: 'Ball Sort',
  webDir: 'dist'
};

export default config;

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Run on iOS simulator
ns run ios --simulator

# Run on Android emulator
ns run android --emulator

# Build iOS (no run)
ns build ios

# Build Android (no run)
ns build android

# TypeScript type-check (no emit)
npx tsc --noEmit
```

There are no automated tests in this project.

## Architecture

This is a **NativeScript + Vue 3** mobile app (iOS/Android) called **Home Inventory**. It uses a SQLite database to manage a hierarchy of Levels → Rooms → Items (photos).

### Startup flow

`app/app.ts` creates the Vue app, registers the drawer plugin, then calls `app.start()`. The root component `App.vue` calls `initDatabase()` in its `created()` hook — this must happen after `app.start()` so native APIs are available. `Home.vue` only mounts once `dbReady` is set to `true` on `App.vue`.

### Navigation

The app uses a single `<Frame id="main">` inside a side-drawer layout (`@nativescript-community/ui-drawer`). Navigation is push/pop:

- `this.$navigateTo(Component, { props })` — from the root frame (Home)
- `this.$navigateTo(Component, { frame: Frame.topmost(), props })` — **required** when navigating from a non-root page (LevelScreen → RoomScreen), otherwise the frame isn't resolved correctly
- `Frame.topmost().goBack()` — used for back navigation instead of `$navigateBack()`, which is unreliable in NativeScript-Vue 3

### Screen hierarchy

```
Home (levels list) → LevelScreen (rooms list) → RoomScreen (photo grid)
```

Each level has a `levelId` that must be threaded through to `RoomScreen` because the `items` table requires both `level_id` and `room_id`.

### Modals

Modals use `this.$showModal(Component, { fullscreen: false, props })` and return a Promise. Inside a modal, `this.$modal.close(value)` sends the result back. Modals return structured objects like `{ action: 'save' | 'remove', ... }` so the caller can branch.

**Long-press guard**: `@longPress` fires for both gesture start and end states. Always guard with `if (args.state !== 1) return` to prevent the modal from opening twice.

### Database (`app/shared/database.ts`)

Uses `@nativescript-community/sqlite`. The DB file is stored at `knownFolders.documents().path + '/app.db'` — a relative path will fail on iOS. Schema:

- `levels` — level_id, level_name, level_order
- `rooms` — room_id, level_id, room_name, room_order
- `items` — item_id, level_id, room_id, photo_path, thumbnail_path

All three tables are created in `initDatabase()` with `CREATE TABLE IF NOT EXISTS`. Seed data (3 default levels) is inserted only when the levels table is empty.

### Photo storage (`app/shared/imageUtils.ts`)

`savePhotoFiles(asset)` receives an `ImageAsset` from `@nativescript/camera`, saves two files to the documents directory:

- Large: max 2048px wide, aspect-ratio preserved
- Thumbnail: 100×100px square

**Do not use `ImageSource.fromNativeSource()`** — it does not exist in `@nativescript/core` ~9.0.0. Instead, resize with native UIKit/Bitmap APIs and write directly to disk via `UIImageJPEGRepresentation` (iOS) or `Bitmap.compress` into a `FileOutputStream` (Android).

### Styling

Global styles are in `app/app.css` (imports Tailwind via `@import "tailwindcss"`). Shared button styles live in `.level-btn` and `.fab-btn` — add new component-specific styles here rather than inline. Font Awesome 5 Solid/Regular/Brands are available via `.fas`, `.far`, `.fab` classes.

### iOS permissions

`App_Resources/iOS/Info.plist` contains `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` — required for camera access. Any new native capability requiring a permission string must be added here.

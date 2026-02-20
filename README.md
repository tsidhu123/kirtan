# kirtan

Simple one-page kirtan streaming app.

## Directory streams (no hardcoded filenames)

If a stream URL ends with `/`, it is treated as a directory stream.

The app will:
- fetch that directory URL,
- scan `<a href>` links from the directory listing,
- keep only supported audio files,
- and play/track those files in order.

This means you should **not** define fixed filenames in `app.js` for directory streams.

If a `files` list is present for a directory stream, the app ignores it and uses scanned directory results only.

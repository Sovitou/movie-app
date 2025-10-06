// Minimal shim to satisfy Metro symbolicator when it looks for InternalBytecode.js
// This file intentionally contains no runtime logic. It's here to avoid ENOENT errors
// when Metro attempts to read a bundled source map referencing InternalBytecode.js.

// If you prefer to remove this later, try disabling source map symbolication or
// ensure your environment's metro/bundler configuration doesn't reference it.

// Export a no-op function so imports won't break if something references it.
module.exports = function InternalBytecode() {
  return null;
};

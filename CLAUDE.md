# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-browser (Chrome and Firefox) Manifest V3 extension that replaces instances of "Chinese Taipei" with "Taiwan 🇹🇼" on all web pages. The extension includes an enable/disable toggle and an emoji toggle in the browser action popup.

## Architecture

### Core Components

- **[script.js](script.js)**: Content script that runs on all pages (`*://*/*`). Uses cross-browser compatible API detection (`browser` or `chrome`). Monitors DOM changes using `MutationObserver` API with 500ms debouncing. Checks browser storage for enabled state and emoji preference before performing replacements. Replaces "Chinese Taipei" with either "Taiwan 🇹🇼" or "Taiwan" based on user preference. Targets text elements: `h1, h2, h3, h4, h5, p, li, td, caption, span, a`.

- **[popup.html](popup.html)** + **[popup.js](popup.js)** + **[popup.css](popup.css)**: Browser action popup with two checkboxes: one to enable/disable the extension, and one to toggle emoji display. Uses cross-browser compatible API detection. State is persisted to browser storage sync. When the extension is disabled or emoji setting changes, automatically reloads the current tab to apply changes.

- **[manifest.json](manifest.json)**: Manifest V3 configuration compatible with both Chrome and Firefox. Requires `storage` permission and `host_permissions` for all URLs. Includes `browser_specific_settings` for Firefox with minimum version 109.0 (Manifest V3 support). Content script runs at `document_end` in all frames.

### Text Replacement Flow

1. Content script performs initial replacement on page load
2. `MutationObserver` monitors DOM changes (childList, subtree, characterData)
3. Debounces changes with 500ms timeout to avoid excessive processing
4. Checks browser storage for `enabled` state and `showEmoji` preference
5. If enabled, performs regex replacement (`/Chinese Taipei/gi`) on matching elements using `innerHTML`
6. Replacement text is "Taiwan 🇹🇼" if `showEmoji` is true (default), or "Taiwan" if false

### Cross-Browser Compatibility

The extension detects the available browser API at runtime:
```javascript
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;
```

- **Firefox**: Uses `browser.*` namespace (Promise-based API)
- **Chrome**: Uses `chrome.*` namespace (callback-based, but also supports Promises in newer versions)

This pattern works because:
- Firefox provides both `browser.*` (preferred) and `chrome.*` (for compatibility)
- Chrome only provides `chrome.*`
- The code uses `browser` if available, otherwise falls back to `chrome`

### State Management

Extension uses browser storage sync API with two keys:
- `enabled` (boolean): Whether text replacement is active
- `showEmoji` (boolean): Whether to include 🇹🇼 emoji in replacement (defaults to `true`)

## Development

### Code Formatting

Uses Prettier with config in [.prettierrc](.prettierrc):
- Single quotes
- 2 space indentation

Format code:
```bash
npx prettier --write .
```

### Testing the Extension

**Chrome:**
1. Make code changes
2. Go to `chrome://extensions/`
3. Click "Reload" button on the extension
4. Refresh any web pages to see changes take effect

**Firefox:**
1. Make code changes
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Reload" button on the extension
4. Refresh any web pages to see changes take effect

### Loading the Extension

**Chrome:**
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select this directory

**Firefox:**
1. Go to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select `manifest.json` from this directory
4. Note: Temporary add-ons are removed on browser restart

## Important Patterns

- **Cross-browser API compatibility**: Detects and uses `browser` API (Firefox) or `chrome` API (Chrome) at runtime
- **MutationObserver**: Uses modern `MutationObserver` API instead of deprecated `DOMSubtreeModified` event to monitor DOM changes
- **Debouncing**: DOM change handler uses timeout-based debouncing (500ms) to prevent excessive executions
- **Async storage**: Storage operations use Promises (explicit `.then()` in popup.js, callback in script.js for broader compatibility)
- **Tab reload on changes**: When extension is disabled or emoji setting is changed via popup, current tab is automatically reloaded to apply changes
- **All frames**: Content script runs in all frames (`all_frames: true`), not just top-level documents
- **Host permissions**: Uses `host_permissions` for URL access (Manifest V3 requirement) instead of broad `tabs` permission
- **Firefox ID**: Includes `browser_specific_settings.gecko.id` required for Firefox submission (change if publishing)

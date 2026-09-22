import { browser } from "#imports"

/**
 * The fork owns its identity and local storage namespace. Do not import the
 * upstream product name here: it leaks into IndexedDB and default content.
 */
export const APP_NAME = "Leafling Local"
const manifest = browser.runtime.getManifest()
export const EXTENSION_VERSION = manifest.version

# Leafling Local

Leafling Local is a local-first, bring-your-own-key browser extension for immersive translation and language study. It is an independently maintained fork of [Read Frog](https://github.com/mengxi-ream/read-frog).

## What this fork provides

- Immersive webpage and selection translation using a provider and API key you configure.
- Custom AI actions and browser-native language-learning workflows.
- Local notes, vocabulary cards, and spaced-repetition review data stored in the browser.
- YouTube subtitle translation through your configured provider when source subtitles are available.

## What this fork does not provide

- No hosted account, subscription, entitlement check, or paid-plan unlock.
- No official hosted AI provider, vendor promotion, partner bridge, or upstream support channel.
- No access to the upstream service's server-side features, credits, or premium models.

## Build and install

Requirements: a current Node.js LTS release and pnpm.

```sh
pnpm install
pnpm build
```

Load the generated unpacked extension from `.output/chrome-mv3` in a Chromium browser's extension developer mode. Configure an API provider and key from the extension options page before using LLM-backed features.

For a distributable archive:

```sh
pnpm zip
```

## Data and privacy

Configuration and study data are stored in the extension's local browser storage. Requests to an AI provider are governed by that provider's terms and privacy policy; use only endpoints and keys you trust.

## Upstream attribution and license

This repository is a modified derivative of [Read Frog](https://github.com/mengxi-ream/read-frog). Upstream copyright notices are preserved in the source. Leafling Local is distributed under **GPL-3.0-or-later**; see [LICENSE](./LICENSE) and [FORK_NOTICE.md](./FORK_NOTICE.md).

Leafling Local is not affiliated with, endorsed by, or supported by the upstream hosted service.

# Angular 21 Upgrade Status

**Status:** Accepted with documented test-suite debt  
**Verified:** 2026-10-27  
**Scope:** Frontend only

## Completed upgrade work

The Angular 19 to 20 and Angular 20 to 21 upgrades are complete. The current frontend uses Angular 21.2.x and the compatible dependency set recorded in [package.json](./package.json), including Font Awesome 7.x.

The following checks were completed for the Angular 21 state:

- TypeScript compilation and the production build
- Clean dependency installation
- Browser smoke checks
- Google and Facebook authentication
- Core application workflows

No new test failures or confirmed application regressions were identified during the upgrade verification. Zone-based change detection remains enabled; zoneless adoption was not included.

## Known exceptions

The existing Karma/Jasmine suite remains non-green:

- Before the upgrade: 17 passing and 38 failing tests
- After the upgrade: 18 passing and 37 failing tests

These failures are carried forward as existing test debt. They are not represented as resolved, and the original “all tests pass” gate is not literally satisfied. The upgrade was accepted on the basis of the documented baseline exception.

`npm ls --all` also continues to report two unmet optional peer dependencies. These are documented as remaining dependency warnings rather than upgrade blockers.

## Deferred decisions

- **Karma to Vitest:** Migration remains deferred. Assess the experimental migration path separately, including Jasmine APIs, browser-dependent tests, and test configuration. Do not rewrite tests blindly.
- **Angular 21 to 22:** Deferred until separately approved. Before proceeding, verify the current official migration guide, Node.js and TypeScript requirements, third-party compatibility, and the exact `ng update` changes. Review the `Eager` migration and inspect HTTP upload behavior if relevant to JobNet.

## Explicitly out of scope

- Zoneless change detection
- Backend modernization or backend modifications
- Tailwind work
- `CommonModule` cleanup
- Unrelated refactoring

# v18 — Gold Room bar and Ring television

Created from the completed v17.18. Earlier versions are preserved. This is a local GitHub Pages release; nothing has been pushed or deployed.

The bar now has a warm, illuminated bottle wall with brass bays and reflective upper panels, a dark framed front, a luminous cream serving counter, burgundy stools and a brass-trimmed canopy. It follows the user's Gold Room film reference within the existing bar footprint. The library ladder that intersected the bar was moved to the clear shelving gap at x=24.9.

A Lloyd-inspired bartender stands behind the counter in a burgundy dinner jacket, black satin lapels, white shirt and bow tie. The realistic generated transparent character is a fixed-facing image plane, with very slight breathing and turning motion; it is not a full 3D facial rig. Reduced-motion preferences stop that movement. The existing gallery renderer is shared. The full-resolution source is 1024×1536; desktop delivery keeps that resolution, and the mobile image is 512×768. No upscaling is claimed.

The cigar lounge has an original modeled walnut console TV, with tapered legs, brass bezel, dials and a speaker grille, informed by the user's vintage-TV reference. Both chairs have been moved forward and aimed at the actual TV screen center. The low table sits between the viewers and screen. Tests check chair direction, rug containment and separation from the table and TV.

WATCH THE TAPE opens the exact supplied video, https://www.youtube.com/watch?v=iGqoLtIby9s, inside the physical screen via an official privacy-enhanced YouTube iframe and a CSS3D layer. In normal 360 mode the camera moves closer for viewing. Press the native YouTube play control to start it; TV POWER OFF stops it and restores the idle CRT screen. Changing gallery areas, interacting with the scene, hiding the page or leaving stops/unloads playback. A direct YouTube link remains available. No video is downloaded or bundled. Playback availability depends on YouTube and the viewer's browser/network; the linked player loaded in local review and its playback time advanced.

The existing COMING SOON/PIN entrance remains, using 1023. Its previously accepted client-side privacy-screen limitation is unchanged. All presentation sections, gallery features, Morgan, globe, records and existing media remain. Runtime asset names are versioned for v18 to avoid reusing earlier cached modules.

## Validation and delivery

Run `node tools/test-v18-room.mjs` for the new seating, visibility, camera, player lifecycle and asset checks. Run the remaining `tools/test-*.mjs` tests for inherited behavior. All 44 test scripts pass. `python3 tools/package_release.py --check` validates both the gate pages and preserved post-PIN documents, runtime references, syntax, movie/record covers and location data.

The static furniture uses 26 finish batches and 110,262 triangles in the desktop authoring review; finite geometry and normals were checked. The bartender adds one small alpha texture (about 118 KB desktop or 38 KB mobile). No additional WebGL renderer or video texture-copying pipeline is used; the TV uses a DOM/CSS3D renderer and only creates its YouTube iframe on explicit activation.

The authoring camera is available only on localhost with `?room-review=1`; it does not run on production. `tools/room-review.html?view=bar`, `?view=cigars` and `?view=tv` provide review views. The new bar, TV fit, corrected chair layout, embedded video, power-off behavior, normal 360 entry, phone-sized layout and close viewing position were checked in the browser. Source prompts, generated master and screenshots are kept in tools/ and excluded from the runtime ZIP.

Extract the contents of ISWAS_v18-release.zip into the GitHub Pages publishing root, preserving CNAME, .nojekyll and relative paths. No build is needed. The release package does not deploy the site or modify DNS.

## Generated asset and provenance

Generated with the built-in ImageGen tool. Final assets: `characters/lloyd/lloyd.webp` and `characters/lloyd/lloyd-mobile.webp`. Exact prompt: `tools/asset-sources/lloyd-prompt.txt`. Native generated master: `tools/asset-sources/lloyd-source.png`. Details: `characters/lloyd/PROVENANCE.json`.

The film still was used as character/costume guidance. The watermarked vintage-TV photo was used as modeling reference only; neither reference photograph is embedded in the site.

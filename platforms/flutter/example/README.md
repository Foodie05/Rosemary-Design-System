# Rosemary consumer gallery

This host application demonstrates all 33 controls with host-owned values, light/dark/system appearance, a complete Vigilo semantic palette, English/Chinese labels, RTL, text scaling, reduced motion and an explicit high-contrast palette. It performs no business networking.

Run `python3 platforms/flutter/scripts/verify.py test` from the repository root. The script packs rosemary_ui, extracts that source archive into an isolated vendor directory, and tests/builds this application against the extracted path dependency. `device` runs native editing, date cancellation and stopped-progress interactions on the target selected by `ROSEMARY_FLUTTER_DEVICE`.

Example deployment targets are Android API26, iOS17 and macOS12. Windows and Linux consumer builds run in hosted CI. A debug Android APK, unsigned iOS simulator app and desktop archives are development installation outputs; signing and public distribution belong to the host. Automated checks do not certify screen-reader behavior.

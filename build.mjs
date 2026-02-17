import { build } from 'esbuild';
import { mkdirSync, cpSync, writeFileSync, chmodSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const APP_NAME = 'HomeCloud';
const APP_BUNDLE = `release/${APP_NAME}.app`;
const CONTENTS = `${APP_BUNDLE}/Contents`;
const MACOS = `${CONTENTS}/MacOS`;
const RESOURCES = `${CONTENTS}/Resources`;

console.log('1. Bundling backend with esbuild...');
await build({
    entryPoints: ['server.js'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'cjs',
    outfile: `${RESOURCES}/server.cjs`,
    external: [],
    minify: false,
    sourcemap: false,
    banner: { js: '// HomeCloud - bundled by esbuild' },
});

console.log('2. Creating .app bundle structure...');
mkdirSync(MACOS, { recursive: true });
mkdirSync(RESOURCES, { recursive: true });

// Copy frontend build
mkdirSync(`${RESOURCES}/frontend/build`, { recursive: true });
cpSync('frontend/build', `${RESOURCES}/frontend/build`, { recursive: true });

console.log('3. Downloading portable Node.js...');
const nodeVersion = 'v20.18.3';
const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
const nodeTar = `node-${nodeVersion}-darwin-${arch}`;
const nodeUrl = `https://nodejs.org/dist/${nodeVersion}/${nodeTar}.tar.gz`;
const nodeBinSrc = `${nodeTar}/bin/node`;

if (!existsSync(`${RESOURCES}/node`)) {
    execSync(`curl -sL ${nodeUrl} | tar xz -C /tmp ${nodeBinSrc}`, { stdio: 'inherit' });
    cpSync(`/tmp/${nodeBinSrc}`, `${RESOURCES}/node`);
    chmodSync(`${RESOURCES}/node`, 0o755);
    console.log('   Node.js binary downloaded.');
} else {
    console.log('   Node.js binary already exists, skipping.');
}

console.log('4. Compiling menu bar app...');
// Find swiftc - prefer Xcode toolchain to avoid CLT module conflicts
let swiftc = 'swiftc';
const xcodeSwiftc = '/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/swiftc';
const xcodeSdk = '/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk';
if (existsSync(xcodeSwiftc)) {
    swiftc = `${xcodeSwiftc} -sdk ${xcodeSdk}`;
}
execSync(`${swiftc} -o ${MACOS}/${APP_NAME} menubar.swift -framework Cocoa`, { stdio: 'inherit' });

console.log('5. Generating app icon...');
if (!existsSync(`${RESOURCES}/AppIcon.icns`)) {
    execSync(`${swiftc} -o /tmp/generate_icon generate_icon.swift -framework Cocoa`, { stdio: 'inherit' });
    execSync('/tmp/generate_icon', { stdio: 'inherit' });
    execSync(`iconutil -c icns -o ${RESOURCES}/AppIcon.icns /tmp/HomeCloud.iconset`, { stdio: 'inherit' });
    execSync('rm -rf /tmp/HomeCloud.iconset /tmp/generate_icon');
    console.log('   App icon generated.');
} else {
    console.log('   App icon already exists, skipping.');
}

console.log('6. Creating Info.plist...');
const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleDisplayName</key>
    <string>${APP_NAME}</string>
    <key>CFBundleIdentifier</key>
    <string>com.homecloud.app</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundleExecutable</key>
    <string>${APP_NAME}</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>LSUIElement</key>
    <true/>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>`;

writeFileSync(`${CONTENTS}/Info.plist`, plist);

console.log(`\nBuild complete! ${APP_BUNDLE}`);
console.log('Config: ~/.homecloud/config.env');
console.log('Uploads: ~/HomeCloud-Uploads');

import fs from 'node:fs';
import path from 'node:path';

const filesToPatch = [
  'node_modules/next/dist/server/lib/router-utils/setup-dev-bundler.js',
  'node_modules/next/dist/esm/server/lib/router-utils/setup-dev-bundler.js',
];

for (const relPath of filesToPatch) {
  const fullPath = path.resolve(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  // CJS patch
  if (content.includes('if (isAtConventionLevel && fileBaseName === _constants1.MIDDLEWARE_FILENAME)')) {
    content = content.replace(
      'if (isAtConventionLevel && fileBaseName === _constants1.MIDDLEWARE_FILENAME) {\n                    middlewareFilePath = fileName;\n                }\n                if (isAtConventionLevel && fileBaseName === _constants1.PROXY_FILENAME) {\n                    proxyFilePath = fileName;\n                }',
      'const fileExists = _fs.default.existsSync(fileName);\n                if (fileExists && isAtConventionLevel && fileBaseName === _constants1.MIDDLEWARE_FILENAME) {\n                    middlewareFilePath = fileName;\n                }\n                if (fileExists && isAtConventionLevel && fileBaseName === _constants1.PROXY_FILENAME) {\n                    proxyFilePath = fileName;\n                }'
    );
    changed = true;
  }

  // ESM patch
  if (content.includes('if (isAtConventionLevel && fileBaseName === MIDDLEWARE_FILENAME)')) {
    content = content.replace(
      'if (isAtConventionLevel && fileBaseName === MIDDLEWARE_FILENAME) {\n                    middlewareFilePath = fileName;\n                }\n                if (isAtConventionLevel && fileBaseName === PROXY_FILENAME) {\n                    proxyFilePath = fileName;\n                }',
      'const fileExists = fs.existsSync(fileName);\n                if (fileExists && isAtConventionLevel && fileBaseName === MIDDLEWARE_FILENAME) {\n                    middlewareFilePath = fileName;\n                }\n                if (fileExists && isAtConventionLevel && fileBaseName === PROXY_FILENAME) {\n                    proxyFilePath = fileName;\n                }'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[patch-next] Successfully patched ${relPath}`);
  } else {
    console.log(`[patch-next] Already patched or pattern not found in ${relPath}`);
  }
}


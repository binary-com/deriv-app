const fs = require('fs');
const glob = require('glob');
const path = require('path');

const entries = { index: './src/index.ts' };
const basePath = './src';

glob.sync(`${basePath}/**/*.tsx`, { ignore: [`${basePath}/**/__tests__/**`, `${basePath}/**/*.d.ts`] }).forEach(
    item => {
        // Configure Webpack entry
        const splitPath = item.split('/');
        const entryName = splitPath[2]; // Adjust based on your directory structure
        entries[entryName] = item;
    }
);

fs.writeFileSync(path.join(__dirname, 'webpack-entries.json'), JSON.stringify(entries, null, 2), 'utf8');

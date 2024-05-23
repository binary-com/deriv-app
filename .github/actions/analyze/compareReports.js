const fs = require('fs');
const path = require('path');

function roundUpToDecimals(num, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.ceil(num * factor) / factor;
}

function readJsonFile(filePath) {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    }
    return null;
}

function calculateDiff(oldSize, newSize) {
    return newSize - oldSize;
}

function calculatePercentage(oldSize, newSize) {
    if (oldSize === 0) {
        return newSize === 0 ? 0 : 100;
    }
    return ((newSize - oldSize) / oldSize) * 100;
}

function formatSize(size, roundUp) {
    if (size === null) {
        return '-';
    }

    const formattedSize = roundUp ? roundUpToDecimals(size / 1024, 2) + 'kb' : (size / 1024).toFixed(2) + 'kb';
    return formattedSize;
}

const packagesDir = './packages';
const oldPackagesDir = './old/packages';
const packages = [...new Set([...fs.readdirSync(packagesDir), ...fs.readdirSync(oldPackagesDir)])];

let tableRows = '';

for (const pkg of packages) {
    const oldReport = readJsonFile(path.join(oldPackagesDir, pkg, 'report.json'));
    const newReport = readJsonFile(path.join(packagesDir, pkg, 'report.json'));

    const oldSize = oldReport ? oldReport[0].gzipSize : null;
    const newSize = newReport ? newReport[0].gzipSize : null;
    let diff = oldSize && newSize ? calculateDiff(oldSize, newSize) : null;

    if (oldSize === null) {
        diff = newSize;
    }

    if (newSize === null) {
        diff = oldSize;
    }

    let diffText = '-';

    if (diff !== 0) {
        diffText = diff < 0 ? '-' : '+' + formatSize(diff, true);
    } else {
        diffText = '+0kb';
    }

    let percentage = oldSize && newSize ? calculatePercentage(oldSize, newSize) : null;

    if (oldSize === null) {
        percentage = 100;
    }

    if (newSize === null) {
        percentage = -100;
    }

    let percentageText = '-';
    let percentageEmoji;

    if (percentage === 0) {
        percentageEmoji = '';
    } else if (percentage < 0) {
        percentageEmoji = '🟢'; // green for decrease
    } else if (percentage >= 0 && percentage <= 5) {
        percentageEmoji = '🟡'; // yellow for small increase
    } else {
        percentageEmoji = '🔴'; // red for larger increase
    }

    if (percentage !== 0) {
        percentageText = percentage.toFixed(2) + '%';
    } else {
        percentageText = '0%';
    }

    tableRows += `
    <tr>
      <td>${pkg}</td>
      <td>${formatSize(oldSize)}</td>
      <td>${formatSize(newSize)}</td>
      <td>${diffText}</td>
      <td>${percentageText} ${percentageEmoji}</td>
    </tr>
  `.trim();
}

console.log(
    `
<table>
  <thead>
    <th>package</th>
    <th>old</th>
    <th>new</th>
    <th>diff</th>
    <th>percentage</th>
  </thead>
  <tbody>
    ${tableRows}
  </tbody>
</table>
`.trim()
);

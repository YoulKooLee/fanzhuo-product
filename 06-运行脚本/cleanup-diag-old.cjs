// cleanup-diag-old.cjs —— 临时清理脚本，删完即弃
const fs = require('node:fs');
const old = 'C:\\Users\\游翔\\Documents\\AI work\\Axhub\\_diag_procs.mjs';
try {
  if (fs.existsSync(old)) {
    fs.unlinkSync(old);
    console.log('deleted:', old);
  } else {
    console.log('not found (可能已被删):', old);
  }
} catch (e) {
  console.error('delete failed:', e.message);
}

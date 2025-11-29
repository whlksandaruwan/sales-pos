// Simple script to send ESC/POS cash drawer open command to thermal printer
// ESC p m t1 t2 - Standard cash drawer kick command

const fs = require('fs');

// ESC/POS command to open cash drawer (pin 2, 100ms pulse)
const ESC = '\x1B';
const DRAWER_KICK = ESC + 'p\x00\x19\x19'; // ESC p 0 25 25

console.log('==============================================');
console.log('Cash Drawer Open Command');
console.log('==============================================\n');
console.log('This will send the ESC/POS command to open');
console.log('the cash drawer connected to your thermal printer.\n');

// Write command to file
const commandFile = 'drawer-open.prn';
fs.writeFileSync(commandFile, DRAWER_KICK, 'binary');
console.log(`✓ Created ${commandFile}\n`);

console.log('INSTRUCTIONS:\n');
console.log('1. Find your printer port in Device Manager');
console.log('   (e.g., COM3, COM4)\n');
console.log('2. Run this command in Command Prompt:\n');
console.log(`   copy /b ${commandFile} COM3\n`);
console.log('   (Replace COM3 with your actual port)\n');
console.log('The cash drawer should open!\n');
console.log('==============================================\n');


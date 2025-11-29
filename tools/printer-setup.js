// Simple Node.js script to send ESC/POS commands to thermal printer
// This will disable Chinese character mode and set code page to USA (PC437)

const fs = require('fs');

// ESC/POS commands
const ESC = '\x1B';
const INIT = ESC + '@';           // Initialize printer
const CODE_PAGE_USA = ESC + 't\x00';  // Select code page 0 (USA)
const DISABLE_CHINESE = ESC + '!\x00'; // Disable Chinese mode
const TEST_TEXT = '\n\n  AHASNA SALE CENTER\n  Test Print\n  English Mode Active\n\n\n\n\n';
const CUT = '\x1D\x56\x00';       // Cut paper (if supported)

// Combine commands
const commands = INIT + CODE_PAGE_USA + DISABLE_CHINESE + TEST_TEXT + CUT;

console.log('==============================================');
console.log('Thermal Printer Setup Tool');
console.log('==============================================\n');
console.log('This will send ESC/POS commands to switch your');
console.log('printer from Chinese to English (ASCII) mode.\n');

// Instructions for Windows
console.log('INSTRUCTIONS FOR WINDOWS:\n');
console.log('1. Find your printer port:');
console.log('   - Open Device Manager');
console.log('   - Expand "Ports (COM & LPT)"');
console.log('   - Look for your printer (e.g., "USB Printing Support" or "COM3")');
console.log('   - Note the port name (e.g., COM3)\n');
console.log('2. Run this command in PowerShell (as Administrator):\n');
console.log('   $port = new-Object System.IO.Ports.SerialPort COM3,9600,None,8,one');
console.log('   $port.Open()');
console.log('   $port.Write([byte[]](0x1B,0x40,0x1B,0x74,0x00,0x0A,0x0A,0x20,0x20,0x41,0x48,0x41,0x53,0x4E,0x41,0x20,0x53,0x41,0x4C,0x45,0x20,0x43,0x45,0x4E,0x54,0x45,0x52,0x0A,0x20,0x20,0x54,0x65,0x73,0x74,0x20,0x50,0x72,0x69,0x6E,0x74,0x0A,0x20,0x20,0x45,0x6E,0x67,0x6C,0x69,0x73,0x68,0x20,0x4D,0x6F,0x64,0x65,0x20,0x41,0x63,0x74,0x69,0x76,0x65,0x0A,0x0A,0x0A,0x0A,0x0A), 0, 67)');
console.log('   $port.Close()\n');
console.log('   (Replace COM3 with your actual port)\n');
console.log('==============================================\n');
console.log('ALTERNATIVE METHOD (Easier):\n');
console.log('Create a file named "setup.txt" with these commands,');
console.log('then send it to the printer using:');
console.log('   copy setup.txt COM3\n');
console.log('(Replace COM3 with your printer port)\n');
console.log('==============================================\n');

// Write commands to a file that can be copied to printer port
const setupFile = 'printer-setup.prn';
fs.writeFileSync(setupFile, commands, 'binary');
console.log(`✓ Created ${setupFile}`);
console.log('\nTo apply settings, run in Command Prompt:\n');
console.log(`   copy /b ${setupFile} COM3\n`);
console.log('(Replace COM3 with your printer port)\n');
console.log('==============================================\n');


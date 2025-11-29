# PowerShell script to open cash drawer via Windows printer
# Sends ESC/POS command through the printer queue

$printerName = "4BARCODE 3B-365B"

# ESC/POS command to open cash drawer (pin 2, 100ms pulse)
$ESC = [char]0x1B
$drawerCommand = $ESC + "p" + [char]0x00 + [char]0x19 + [char]0x19

Write-Host "=============================================="
Write-Host ""
Write-Host "Opening Cash Drawer on: $printerName"
Write-Host ""
Write-Host "=============================================="
Write-Host ""

try {
    # Create temporary file with drawer command
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllBytes($tempFile, [System.Text.Encoding]::Default.GetBytes($drawerCommand))
    
    # Send raw bytes to printer using copy command
    $printerPath = "\\localhost\$printerName"
    Copy-Item -Path $tempFile -Destination $printerPath -ErrorAction Stop
    
    Write-Host "Cash drawer command sent successfully!"
    Write-Host ""
    Write-Host "If the drawer did not open, check:"
    Write-Host "  1. Cash drawer is connected to printer drawer port"
    Write-Host "  2. Drawer is powered on"
    Write-Host "  3. Printer supports cash drawer kick"
    Write-Host ""
    
    # Clean up
    Remove-Item -Path $tempFile -Force
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=============================================="
Write-Host ""


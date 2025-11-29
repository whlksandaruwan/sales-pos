# PowerShell script to open cash drawer via Windows printer
# Sends ESC/POS command through the printer queue

$printerName = "4BARCODE 3B-365B"  # Your printer name from Device Manager

# ESC/POS command to open cash drawer (pin 2, 100ms pulse)
$ESC = [char]0x1B
$drawerCommand = $ESC + "p" + [char]0x00 + [char]0x19 + [char]0x19

Write-Host "==============================================`n"
Write-Host "Opening Cash Drawer on: $printerName`n"
Write-Host "==============================================`n"

try {
    # Create temporary file with drawer command
    $tempFile = [System.IO.Path]::GetTempFileName()
    [System.IO.File]::WriteAllBytes($tempFile, [System.Text.Encoding]::Default.GetBytes($drawerCommand))
    
    # Send to printer using raw print
    $printJob = Get-Content -Path $tempFile -Raw
    
    # Use .NET printing
    $printerSettings = New-Object System.Drawing.Printing.PrinterSettings
    $printerSettings.PrinterName = $printerName
    
    # Send raw bytes to printer
    Add-Type -AssemblyName System.Drawing
    $printDocument = New-Object System.Drawing.Printing.PrintDocument
    $printDocument.PrinterSettings = $printerSettings
    
    $printDocument.add_PrintPage({
        param($sender, $ev)
        # Just send the command, no actual page content
        $ev.HasMorePages = $false
    })
    
    # Alternative: Use copy command
    Copy-Item -Path $tempFile -Destination "\\localhost\$printerName" -ErrorAction Stop
    
    Write-Host "✓ Cash drawer command sent successfully!`n"
    Write-Host "If the drawer didn't open, check:`n"
    Write-Host "  1. Cash drawer is connected to printer's drawer port`n"
    Write-Host "  2. Drawer is powered on`n"
    Write-Host "  3. Printer supports cash drawer kick`n"
    
    # Clean up
    Remove-Item -Path $tempFile -Force
    
} catch {
    Write-Host "✗ Error: $_`n" -ForegroundColor Red
    Write-Host "Alternative method:`n"
    Write-Host "1. Create a text file with the drawer command`n"
    Write-Host "2. Right-click the file → Print`n"
    Write-Host "3. Select '$printerName'`n"
}

Write-Host "`n==============================================`n"


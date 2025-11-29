# Direct method to open cash drawer
# Creates a file and sends it to printer

$printerName = "4BARCODE 3B-365B"

# ESC/POS command to open cash drawer
$ESC = [char]0x1B
$drawerCommand = $ESC + "p" + [char]0x00 + [char]0x19 + [char]0x19

Write-Host "=============================================="
Write-Host "Opening Cash Drawer: $printerName"
Write-Host "=============================================="
Write-Host ""

try {
    # Save command to file
    $fileName = "drawer-kick.prn"
    [System.IO.File]::WriteAllBytes($fileName, [System.Text.Encoding]::Default.GetBytes($drawerCommand))
    
    Write-Host "Created file: $fileName"
    Write-Host ""
    Write-Host "Now printing to $printerName..."
    Write-Host ""
    
    # Print the file using Windows print command
    Start-Process -FilePath "notepad.exe" -ArgumentList "/p $fileName" -Wait -WindowStyle Hidden
    
    # Alternative: Use .NET printing
    Add-Type -AssemblyName System.Drawing
    Add-Type -AssemblyName System.Windows.Forms
    
    $fileContent = [System.IO.File]::ReadAllBytes($fileName)
    
    # Create print document
    $printDoc = New-Object System.Drawing.Printing.PrintDocument
    $printDoc.PrinterSettings.PrinterName = $printerName
    
    $printDoc.add_PrintPage({
        param($sender, $ev)
        # Send raw bytes
        $ev.HasMorePages = $false
    })
    
    # Send raw data to printer
    $printDoc.Print()
    
    Write-Host "Command sent to printer!"
    Write-Host ""
    Write-Host "If drawer did not open:"
    Write-Host "  1. Make sure drawer is connected to printer"
    Write-Host "  2. Make sure drawer has power"
    Write-Host "  3. Try unplugging and replugging the drawer cable"
    Write-Host ""
    
    # Keep the file for manual testing
    Write-Host "File saved as: $fileName"
    Write-Host "You can also right-click this file and select Print"
    Write-Host ""
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=============================================="


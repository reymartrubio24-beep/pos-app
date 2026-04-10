# PowerShell script to sync PHP files from the project to XAMPP htdocs
# Run this script after making changes to PHP files

$source = "c:\Users\anneb\OneDrive\Desktop\GUI-1\pos-app\php"
$destination = "C:\xampp\htdocs\GUI-1\pos-app\php"

# Copy all PHP files and folders
Copy-Item -Path "$source\*" -Destination $destination -Recurse -Force

Write-Host ""
Write-Host "✅ All PHP files synced to XAMPP htdocs successfully!" -ForegroundColor Green
Write-Host "   Source: $source" -ForegroundColor Gray
Write-Host "   Destination: $destination" -ForegroundColor Gray
Write-Host ""

# PowerShell Script to Build APK and Guide Through Release

Write-Host "🚀 Building Peer Sphere Mobile App..." -ForegroundColor Cyan

# Check if logged in to EAS
Write-Host "Checking EAS login status..." -ForegroundColor Yellow
$easStatus = eas whoami 2>&1

if ($easStatus -match "Not logged in") {
    Write-Host "❌ Not logged in to EAS!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run these commands first:" -ForegroundColor Yellow
    Write-Host "  cd PeerSphereMobile" -ForegroundColor Green
    Write-Host "  eas login" -ForegroundColor Green
    Write-Host ""
    Write-Host "After login, run this script again!" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Logged in!" -ForegroundColor Green
Write-Host ""

# Change to mobile directory
Set-Location PeerSphereMobile

# Check for eas.json
if (-not (Test-Path "eas.json")) {
    Write-Host "📝 Configuring EAS..." -ForegroundColor Yellow
    eas build:configure
    Write-Host ""
}

# Build the APK
Write-Host "🔨 Building Android APK..." -ForegroundColor Cyan
Write-Host "This will take 15-30 minutes. Grab some coffee! ☕" -ForegroundColor Yellow
Write-Host ""

eas build --platform android --profile preview

Write-Host ""
Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📥 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Download APK from: https://expo.dev/builds" -ForegroundColor White
Write-Host "  2. Create release at: https://github.com/Himanshuyadav23/Peer-sphere/releases/new" -ForegroundColor White
Write-Host "  3. Upload APK and publish!" -ForegroundColor White
Write-Host ""


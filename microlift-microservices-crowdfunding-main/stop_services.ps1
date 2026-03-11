# Stop all Java processes (Backend Microservices)
Stop-Process -Name "java" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "javaw" -Force -ErrorAction SilentlyContinue

# Force kill process on port 8084 (Media Service) if it persists
$mediaPort = 8084
$processMs = Get-NetTCPConnection -LocalPort $mediaPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processMs) {
    Stop-Process -Id $processMs -Force -ErrorAction SilentlyContinue
    Write-Host "Force killed process on port $mediaPort (Media Service)" -ForegroundColor Yellow
}

# Force kill process on port 8083 (Donation Service) if it persists
$donationPort = 8083
$processDs = Get-NetTCPConnection -LocalPort $donationPort -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processDs) {
    Stop-Process -Id $processDs -Force -ErrorAction SilentlyContinue
    Write-Host "Force killed process on port $donationPort (Donation Service)" -ForegroundColor Yellow
}

Write-Host "All Java processes have been terminated." -ForegroundColor Green

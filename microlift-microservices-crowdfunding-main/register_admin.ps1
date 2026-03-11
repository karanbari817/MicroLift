$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    fullName = "Super Admin"
    email = "superadmin@microlift.com"
    password = "password123"
    phoneNumber = "0000000000"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $body
    Write-Host "Registration Successful!" -ForegroundColor Green
    Write-Host "Email: superadmin@microlift.com"
    Write-Host "Password: password123"
    Write-Host "Role: ADMIN"
    $response | Format-List
} catch {
    Write-Host "Registration Failed!" -ForegroundColor Red
    $_.Exception.Response
    Write-Host "Error Details:"
    $_.ErrorDetails
}

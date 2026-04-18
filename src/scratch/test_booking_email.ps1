
$supabaseUrl = "https://ogzasprtfgimjqrtcseg.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nemFzcHJ0ZmdpbWpxcnRjc2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNDQ1MTQsImV4cCI6MjA5MDkyMDUxNH0.QauUTR5BE65rW5jtitsum6OIaagxUoucUathnH7RQqA"
$functionUrl = "$supabaseUrl/functions/v1/send-alert-email"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $anonKey"
}

# Test Admin Alert
$bodyAdmin = @{
    to = "marius.e.dobbin@gmail.com, veiga.yury@gmail.com"
    customerName = "Marius (Teste de Reserva)"
    customerEmail = "marius.test@example.com"
    customerPhone = "+55 21 99999-9999"
    total = 350.00
    isCustomerCopy = $false
    selectedPeriod = "Manhã"
    isPrivate = $true
    items = @(
        @{
            tour = "Test Tour - Corcovado & Christ"
            quantity = 1
            price = 350.00
            date = "2026-04-20"
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Enviando alerta de ADMIN..."
try {
    $responseAdmin = Invoke-RestMethod -Uri $functionUrl -Method Post -Headers $headers -Body $bodyAdmin
    Write-Host "Admin Alert Response: $($responseAdmin | ConvertTo-Json)"
} catch {
    Write-Host "Erro no alerta de Admin: $_"
}

# Test Customer Alert
$bodyCustomer = @{
    to = "veiga.yury@gmail.com" # Sending customer copy to user to verify
    customerName = "Yury (Teste de Cliente)"
    customerEmail = "veiga.yury@gmail.com"
    customerPhone = "+55 21 88888-8888"
    total = 350.00
    isCustomerCopy = $true
    selectedPeriod = "Manhã"
    isPrivate = $true
    items = @(
        @{
            tour = "Test Tour - Corcovado & Christ"
            quantity = 1
            price = 350.00
            date = "2026-04-20"
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Enviando alerta de CLIENTE..."
try {
    $responseCustomer = Invoke-RestMethod -Uri $functionUrl -Method Post -Headers $headers -Body $bodyCustomer
    Write-Host "Customer Alert Response: $($responseCustomer | ConvertTo-Json)"
} catch {
    Write-Host "Erro no alerta de Cliente: $_"
}

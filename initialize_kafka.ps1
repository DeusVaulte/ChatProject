# Relaunch as admin if needed
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}
Read-Host "Press Enter to continue and write UUID to file..."

# Temporarily bypass execution policy in this session
Set-ExecutionPolicy Bypass -Scope Process -Force

# Run your Kafka format script
& ".\format_kafka.ps1"
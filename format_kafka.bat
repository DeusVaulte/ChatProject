@echo off
:: Set Kafka directory and output file
set kafkaDir=%~dp0kafka
set uuidFile=%kafkaDir%\uuid.txt
set configFile=%kafkaDir%\config\kraft\broker.properties

:: Manually generate UUID using uuidgen
::for /f "tokens=*" %%i in ('uuidgen') do set uuid=%%i
for /f "tokens=*" %%i in ('"%kafkaDir%\bin\windows\kafka-storage.bat" random-uuid') do set uuid=%%i

:: Check if UUID was generated
if not defined uuid (
    echo Failed to generate UUID.
    pause
    exit /b
)

echo Generated UUID: %uuid%

:: Write UUID to text file
echo %uuid% > %uuidFile%
echo UUID written to %uuidFile%

:: Format the Kafka storage
"%kafkaDir%\bin\windows\kafka-storage.bat" format -t %uuid% -c "%configFile%"
echo Kafka storage formatted with UUID: %uuid%

pause
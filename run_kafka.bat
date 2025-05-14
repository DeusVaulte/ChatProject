@echo off
:: Set working directory to the folder where the .bat script is located
set kafkaDir=C:\ChatProject\kafka
set configFile=%kafkaDir%\config\kraft\broker.properties

:: Check if Kafka is already running by looking for a process (optional)
::tasklist /FI "IMAGENAME eq java.exe" | find ":" > nul
::if errorlevel 1 (
    ::echo Kafka is not running. Starting Kafka...
    :: Start Kafka server in the background
    ::start "" "%kafkaDir%\bin\windows\kafka-server-start.bat" "%configFile%"
::) else (
   :: echo Kafka is already running.
::)

"%kafkaDir%\bin\windows\kafka-server-start.bat" "%configFile%"

pause
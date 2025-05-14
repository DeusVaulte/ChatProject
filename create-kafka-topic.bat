@echo off
set kafkaCrTpc=%~dp0kafka\bin\windows
set topicName= %~dp0\topic.txt
echo "Step 1: Press enter after typing the name of the topic"
echo "Step 2: press ctrl  + z first and release"
echo "Step 3: then enter to exit"
TYPE CON > %topicName% 
if errorlevel 1 (
    echo failed to find the txt file
) else (
    echo Done Writing to file
)

pause

for /f "delims=" %%A in (%~dp0\topic.txt) do (
    set "line=%%A"
    goto breakLoop
)

:breakLoop
echo The first line is: %line%



::"%kafkaCrTpc%\kafka-topics.bat" "--create" "--bootstrap-server" "localhost:9092" "--topic" "%line%"

:: Run Kafka topic create and capture both stdout and stderr
for /f "delims=" %%O in ("%kafkaCrTpc%\kafka-topics.bat --create --bootstrap-server localhost:9092 --topic %line%) do (
    echo %%O
    echo %%O | find "already exists" >nul
    if not errorlevel 1 (
        echo Topic already exists. Pausing...
        pause
    )
)

pause





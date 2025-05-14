@echo off
set inputTest= %~dp0\test.txt
echo "Step 1: Press enter after typing the name of the topic"
echo "Step 2: press ctrl  + z first and release"
echo "Step 3: then enter to exit"
TYPE CON > %inputTest% 
if errorlevel 1 (
    echo failed to find the txt file
) else (
    echo Done Writing to file
)
pause
@echo off
setlocal
:PROMPT
echo node_red.bat^>^> press CTRL+C to exit

@REM version info
echo node_red.bat^>^> Current packages version info...
FOR /F "delims=" %%L in ('call npm show --version') do (set "npm_lversion=%%L")
FOR /F "delims=" %%L in ('call npm --version') do (set "npm_version=%%L")
echo node_red.bat^>^> npm version: %npm_version% (latest: %npm_lversion%)
FOR /F "delims=" %%L in ('call npm show node version') do (set "node-red_lversion=%%L")
FOR /F "delims=" %%L in ('call node --version') do (set "node-red_version=%%L")
echo node_red.bat^>^> node-red version: %node-red_version% (latest: %node-red_lversion%)


@REM update or not
SET /P ANS1=node_red.bat^>^> Do you want to update "npm"? (Y/[N])?
SET /P ANS2=node_red.bat^>^> Do you want to update "node-red"? (Y/[N])?

IF /I "%ANS1%" NEQ "Y" GOTO END
echo node_red.bat^>^> Updating npm...
call npm install -g npm
call node --version

IF /I "%ANS2%" NEQ "Y" GOTO END
echo node_red.bat^>^> Updating node_red...
call npm install -g --unsafe-perm node-red
call npm --version

:END
@REM start node-red
echo node_red.bat^>^> Awakening node-red...
start "" http://127.0.0.1:1880/
call node-red
pause
endlocal

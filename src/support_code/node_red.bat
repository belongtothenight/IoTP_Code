@echo off
setlocal
:PROMPT
echo node_red.bat^>^> press CTRL+C to exit

@REM version info
echo node_red.bat^>^> Current packages version info...

@REM node.js
FOR /F "delims=" %%L in ('call node --version') do (set "nodejs_version=%%L")
echo node_red.bat^>^> node-red version: %nodejs_version%

@REM npm
FOR /F "delims=" %%L in ('call npm show --version') do (set "npm_lversion=%%L")
FOR /F "delims=" %%L in ('call npm --version') do (set "npm_version=%%L")
echo node_red.bat^>^> npm version: %npm_version% (latest: %npm_lversion%)

@REM node-red
FOR /F "delims=" %%L in ('call npm show node-red version') do (set "node-red_lversion=%%L")
FOR /F "delims=" %%L in ('call npm info node-red version') do (set "node-red_version=%%L")
echo node_red.bat^>^> node-red version: %node-red_version% (latest: %node-red_lversion%)

@REM @REM print version table
@REM SET /P FortySpaces=                                        &REM 40 spaces
@REM @REM line 1
@REM SET /P Line=%nodejs_version%
@REM SET /P Line=!Line!%FortySpaces%
@REM SET /P Line=!Line:~0,40!
@REM SET /P Line=!Line!    The Beatles
@REM ECHO %Line%

@REM update or not
SET /P ANS1=node_red.bat^>^> Do you want to update "node.js"? (Y/[N])?
SET /P ANS2=node_red.bat^>^> Do you want to update "npm"? (Y/[N])?
SET /P ANS3=node_red.bat^>^> Do you want to update "node-red"? (Y/[N])?

@REM update node.js
IF /I "%ANS1%" NEQ "Y" GOTO END
echo node_red.bat^>^> Updating npm...
call npm update -g node
call node --version

@REM update npm
IF /I "%ANS2%" NEQ "Y" GOTO END
echo node_red.bat^>^> Updating npm...
call npm update -g npm
call node --version

@REM update node-red
IF /I "%ANS3%" NEQ "Y" GOTO END
echo node_red.bat^>^> Updating node_red...
@REM call npm update -g --unsafe-perm node-red
call npm update -g node-red
call npm --version

:END
@REM start node-red
echo node_red.bat^>^> Awakening node-red...
start "" http://127.0.0.1:1880/
call node-red
pause
endlocal

@echo off
rem Double-click to flip the client between local and GLC,
rem or run: switch-server.bat local ^| glc ^| official ^| status
if "%~1"=="" (
	node "%~dp0switch-server.js" toggle
	pause
) else (
	node "%~dp0switch-server.js" %*
)

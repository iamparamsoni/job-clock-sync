@echo off
echo Building and starting Job Clock Sync Backend...
call mvn clean install
call mvn spring-boot:run


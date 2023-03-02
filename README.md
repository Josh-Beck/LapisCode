# Lambda AP Security 

Lapis Code is an API security library designed to parse Lambda API code and associated infrastructure and find common vulnerabilities.


##### How to use
Lapis code currently runs as a command line application. In order to test it against the Lapis Code
Test Repo, perform the following command.

```
clear; ts; .\lapis.bat scan --handler "https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/js/handler.js" --url "https://github.com/Josh-Beck/LapisCode-Test-Code"
```

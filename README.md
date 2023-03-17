# Lambda API Security 

![GitHub](https://img.shields.io/github/license/Josh-Beck/LapisCode?color=green&style=for-the-badge)
![Version](https://img.shields.io/github/package-json/v/Josh-Beck/LapisCode?style=for-the-badge)


Lapis Code is an API security library designed to parse Lambda API code and associated infrastructure and find common vulnerabilities.

### How to use
Lapis code currently runs as a command line application, with direct file URLs required. Future development will include automated repository parsing to find relevant files and scan them accordingly.

In order to test it against the Lapis Code Test Repo, perform the following command.

```
clear; ts; .\lapis.bat scan --handler "https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/js/handler.js" --url "https://github.com/Josh-Beck/LapisCode-Test-Code"
```


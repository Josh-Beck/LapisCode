# Lambda API Security 

![GitHub](https://img.shields.io/github/license/Josh-Beck/LapisCode?color=green&style=for-the-badge)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Josh-Beck/LapisCode?include_prereleases&style=for-the-badge)
![GitHub commits since latest release (by date) for a branch](https://img.shields.io/github/commits-since/Josh-Beck/LapisCode/latest/v1.0.0?logo=github%20&style=for-the-badge)

Lapis Code is an API security library designed to parse Lambda API code and associated infrastructure and find common vulnerabilities.

### How to use
Lapis code currently runs as a command line application, with direct file URLs required. Future development will include automated repository parsing to find relevant files and scan them accordingly. Visit the [documentation](https://github.com/Josh-Beck/LapisCode/tree/main/documentation) folder for more detailed information.

In order to get started with Lapis Code, use the following command test command:

```
clear; ts; .\lapis.bat scan --handler "https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/js/handler.js" --url "https://github.com/Josh-Beck/LapisCode-Test-Code"
```


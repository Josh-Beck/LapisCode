# Scan CLI command

### Description
Main function for LAPISCode, the scan function performs the security scanning action on the input repositories. 


### Details

| Flag(s)                       | Description |
| ----------------------------  | ---------------|
| -u, --url                     | Base Github URL. Defaults to configuration file URL.|
| -t, --terraform <string>      | Terraform main.tf file URL.|
| --handler <string>            | Lambda handler file URL.|
| -h, --help                    | display help for command|


### Sample Command
The following command performs the `scan` function on the LAPISCode test repository, specifically the `handler.js` file.
`clear; ts; .\lapis.bat scan --handler "https://github.com/Josh-Beck/LapisCode-Test-Code/blob/main/js/handler.js" --url "https://github.com/Josh-Beck/LapisCode-Test-Code"`
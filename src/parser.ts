var HCLParser = require("js-hcl-parser")

// Takes in HCL string, parses out something...
function parse(input: string): string {
    HCLParser.parse(input);
    return "x";
}



const hclInput = `
scale {
  from = 72
  to = 24
}
`
 
const jsonInput = `
{
  "scale": {
    "from": 72,
    "to": 8
  }
}
`
var x = HCLParser.parse(hclInput);
console.log(x)

console.log(JSON.parse(x)["scale"][0]["from"])
console.log(JSON.parse(x).scale[0].from)
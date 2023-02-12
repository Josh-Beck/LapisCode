
// Actual Terraform object for lambda function
export interface LambdaFunctionObject {
    filename: string,
    function_name: string,
    handler: string,
    runtime: string
}

// Due to parsing constraints, 
export interface LambdaFunctionTerraform {
    name: string,
    lambdaObject: LambdaFunctionObject
}

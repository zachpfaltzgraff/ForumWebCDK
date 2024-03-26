import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";

export interface ApiEndpointProps {
  environment?: {
    [key: string]: string;
  };
  dbTables?: cdk.aws_dynamodb.Table[];
  apiRoot: cdk.aws_apigateway.Resource;
  lambdaPath: string;
  endpointPath: string;
  httpMethod: "GET" | "PUT" | "POST" | "DELETE";
  timeout?: number;
  memorySize?: number;
}

export class apiEndpoint extends Construct {
  newLambda: cdk.aws_lambda.Function;
  constructor(id: Construct, scope: string, props: ApiEndpointProps) {
    const {
      environment = {},
      dbTables,
      apiRoot,
      lambdaPath,
      endpointPath,
      httpMethod,
      timeout = 1,
      memorySize = 128,
    } = props;
    super(id, scope);
    
    //Create Lambda
    const newLambda = new cdk.aws_lambda.Function(this, "testLambda", {
      runtime: Runtime.NODEJS_20_X,
      code: cdk.aws_lambda.Code.fromAsset(lambdaPath),
      handler: "index.handler",
      functionName: `${scope}Lambda`,
      timeout: cdk.Duration.seconds(timeout),
      memorySize: memorySize,
      environment,
      tracing: Tracing.ACTIVE,
    });
    this.newLambda = newLambda;

    //Add path to api

    const endpoint = apiRoot.addResource(endpointPath, {
      defaultIntegration: new cdk.aws_apigateway.LambdaIntegration(newLambda),
    });

    //Add method
    endpoint.addMethod(httpMethod);

    //Give permisions
    if (dbTables) {
      for (let table of dbTables) {
        table.grantReadWriteData(newLambda);
      }
    }
  }

  getLambda() {
    return this.newLambda;
  }
}
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CognitoStack extends cdk.Stack {

  userPool: cdk.aws_cognito.UserPool;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      this.userPool = new cognito.UserPool(this, 'PflitzerUserPool', {
        passwordPolicy: {
            minLength: 8,
        },
        selfSignUpEnabled: true,
        signInAliases: {
            email: true,
            username: true,
        },
        signInCaseSensitive: false,
        email: cognito.UserPoolEmail.withCognito(),
        userVerification: {
            emailStyle: cognito.VerificationEmailStyle.CODE,
        },
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      });

      const client = this.userPool.addClient('app-client', {
        
      })

      client.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);

      new cdk.CfnOutput(this, "PoolId", {
        exportName: "USER-POOL-ID",
        value: this.userPool.userPoolId,
      });
      new cdk.CfnOutput(this, "ClientId", {
        exportName: "USER-POOL-CLIENT-ID",
        value: client.userPoolClientId,
      });
      new cdk.CfnOutput(this, "Region", {
        exportName: "REGION",
        value: this.region,
      });
    }
}
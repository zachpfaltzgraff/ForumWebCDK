import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DynamoDBStack extends cdk.Stack {
  postTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  
    this.postTable = new dynamodb.Table(this, 'postTable', {
        partitionKey: {name: 'UUID', type: dynamodb.AttributeType.STRING },
        sortKey: {name: 'dateCreated', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        encryption: dynamodb.TableEncryption.AWS_MANAGED,
        removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  }
}
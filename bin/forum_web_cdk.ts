#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ForumWebCdkStack } from '../lib/forum_web_cdk-stack';
import { S3CloudfrontStack } from '../lib/s3-cloudfront-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { DynamoDBStack } from '../lib/dynamoDB-stack';
import LambdaAPIStack from '../lib/lambdaAPI-stack';

const app = new cdk.App();
new ForumWebCdkStack(app, 'ForumWebCdkStack', {});
new S3CloudfrontStack(app, 'S3CloudfrontStack');
const cognitoStack = new CognitoStack(app, 'CognitoStack');
const dynamoDBStack = new DynamoDBStack(app, 'DynamoDBStack');
new LambdaAPIStack(app, 'LambdaAPIStack', {
    userPool: cognitoStack.userPool,
    postTable: dynamoDBStack.postTable,
})
import * as cdk from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { UserPool } from "aws-cdk-lib/aws-cognito";
import {
  Code,
  Function,
  Handler,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { apiEndpoint } from "./apiEndpoint";

interface APIStackProps extends cdk.StackProps {
  userPool: UserPool;
  postTable: Table;
}

export default class LambdaAPIStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props: APIStackProps) {
    super(scope, id, props);

    const api = new cdk.aws_apigateway.RestApi(this, "API", {
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowHeaders: [
          "*",
          ...cdk.aws_apigateway.Cors.DEFAULT_HEADERS,
        ],
        allowCredentials: true,
      },
    });

    // const auth = new cdk.aws_apigateway.CognitoUserPoolsAuthorizer(
    //   this,
    //   "CognitoAuthorizor",
    //   {
    //     cognitoUserPools: [props.userPool],
    //   }
    // );

    // const userResource = api.root.addResource("user", {
    //   defaultMethodOptions: { authorizer: auth },
    // });
    const forumResource = api.root.addResource("forum", {});

    new apiEndpoint(this, "ForumGetTableData", {
        apiRoot: forumResource,
        endpointPath: 'get-forum-data',
        httpMethod: "GET",
        lambdaPath: "./lambdas/forum/get-data",
        environment: {
            USER_DATA_TABLE_NAME: props.postTable.tableName,
        },
        dbTables: [props.postTable],
        timeout: 3,
    });

    new apiEndpoint(this, "UserPostTableData", {
      apiRoot: forumResource,
      endpointPath: 'post-forum-data',
      httpMethod: "POST",
      lambdaPath: "./lambdas/forum/post-data",
      environment: {
          USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

    new apiEndpoint(this, "UserPutLikeData", {
      apiRoot: forumResource,
      endpointPath: 'like-update',
      httpMethod: "PUT",
      lambdaPath: "./lambdas/forum/put-data/like",
      environment: {
        USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

    new apiEndpoint(this, "UserPutSaveData", {
      apiRoot: forumResource,
      endpointPath: 'save-update',
      httpMethod: "PUT",
      lambdaPath: "./lambdas/forum/put-data/save",
      environment: {
        USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

    new apiEndpoint(this, "UserUpdateLikeData", {
      apiRoot: forumResource,
      endpointPath: 'like-delete',
      httpMethod: "PUT",
      lambdaPath: "./lambdas/forum/update-data/like",
      environment: {
        USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

    new apiEndpoint(this, "UserUpdateSaveData", {
      apiRoot: forumResource,
      endpointPath: 'save-delete',
      httpMethod: "PUT",
      lambdaPath: "./lambdas/forum/update-data/save",
      environment: {
        USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

    new apiEndpoint(this, "UserPutCommentData", {
      apiRoot: forumResource,
      endpointPath: 'comment-put',
      httpMethod: "PUT",
      lambdaPath: "./lambdas/forum/put-data/comment",
      environment: {
        USER_DATA_TABLE_NAME: props.postTable.tableName,
      },
      dbTables: [props.postTable],
      timeout: 3,
    });

  }
}
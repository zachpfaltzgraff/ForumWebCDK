import {
    APIGatewayEventRequestContext,
    APIGatewayProxyEvent,
  } from "aws-lambda";
  import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  
  const client = new DynamoDBClient({});
  const db = DynamoDBDocumentClient.from(client);

  export const handler = async (
    event: APIGatewayProxyEvent,
    context: APIGatewayEventRequestContext
  ) => {
    const requestBody = JSON.parse(event.body ?? '');

    const params = {
        TableName: process.env.USER_DATA_TABLE_NAME
        ? process.env.USER_DATA_TABLE_NAME
        : '',
        Key: {
            UUID: requestBody.uuid,
            dateCreated: requestBody.dateCreated
        },
        Item: {
            commentArray: {
                username: requestBody.username,
                comment: requestBody.comment,
            }
        }
    }

    let command = new PutCommand(params);
    let userData = await db.send(command);
    console.log(JSON.stringify(userData));

    return {
        statusCode: 200,
        body: JSON.stringify({data: userData}),
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    }
  }
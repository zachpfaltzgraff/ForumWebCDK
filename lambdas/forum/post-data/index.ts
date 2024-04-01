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

    let uuid = crypto.randomUUID();
    const params = {
        TableName: process.env.USER_DATA_TABLE_NAME
        ? process.env.USER_DATA_TABLE_NAME
        : '',
        Item: {
            UUID: uuid,
            dateCreated: requestBody.dateCreated,
            username: requestBody.username,
            title: requestBody.title,
            body: requestBody.body,
            commentArray: requestBody.commentArray,
            likeArray: requestBody.likeArray,
            saveArray: requestBody.saveArray,
            likeCount: requestBody.likeCount,
        }
    }

    let command = new PutCommand(params);
    console.log(1);

    let userData = await db.send(command);
    console.log(2);

    console.log(JSON.stringify(userData));
    return {
      statusCode: 200,
      body: JSON.stringify({ data: userData }),
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
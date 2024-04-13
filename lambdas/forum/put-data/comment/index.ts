import {
    APIGatewayEventRequestContext,
    APIGatewayProxyEvent,
  } from "aws-lambda";
  import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  
  const client = new DynamoDBClient({});
  const db = DynamoDBDocumentClient.from(client);

  export const handler = async (
    event: APIGatewayProxyEvent,
    context: APIGatewayEventRequestContext
  ) => {
    const requestBody = JSON.parse(event.body ?? '');

    let existingComments = [];
    if (requestBody.uuid && requestBody.dateCreated) {
        const getParams = {
            TableName: process.env.USER_DATA_TABLE_NAME || '',
            Key: {
                UUID: requestBody.uuid,
                dateCreated: requestBody.dateCreated
            }
        };
        const getCommand = new GetCommand(getParams);
        const existingData = await db.send(getCommand);
        existingComments = existingData.Item?.commentArray || [];
    }

    existingComments.push({
        username: requestBody.username,
        comment: requestBody.comment
    });

    const params = {
        TableName: process.env.USER_DATA_TABLE_NAME ?? '',
        Key: {
            UUID: requestBody.uuid,
            dateCreated: requestBody.dateCreated,
        },
        UpdateExpression: "SET commentArray = :newCommentArray",
        ExpressionAttributeValues: {
            ":newCommentArray": existingComments,
        }
    };
    console.log(params);

    let command = new UpdateCommand(params);
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
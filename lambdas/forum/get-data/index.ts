import {
    APIGatewayEventRequestContext,
    APIGatewayProxyEvent,
  } from "aws-lambda";
  import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
  
  const client = new DynamoDBClient({});
  const db = DynamoDBDocumentClient.from(client);

  export const handler = async (
    event: APIGatewayProxyEvent,
    context: APIGatewayEventRequestContext,
  ) => {
    console.log("scanning");

    let command = new ScanCommand({
      TableName: process.env.USER_DATA_TABLE_NAME
      ? process.env.USER_DATA_TABLE_NAME 
      : "",
    });

    try {
      let result = await db.send(command);

      console.log("Scan Successful");
      console.log(JSON.stringify(result));

      return {
        statusCode: 200,
        body: JSON.stringify({data: result.Items}),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    } catch(error) {
      console.error("Error scanning table:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  }
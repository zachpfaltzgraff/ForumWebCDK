import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

export const handler = async (
  event: APIGatewayProxyEvent,
  context: APIGatewayEventRequestContext,
) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: " request body is missing"}),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                }
            }
        }

        const requestBody = JSON.parse(event.body ?? '');
        console.log(requestBody);
        const accountID = requestBody.accountID;

        const params = {
            TableName: process.env.USER_DATA_TABLE_NAME ?? '',
            Key: {
                UUID: requestBody.UUID,
                dateCreated: requestBody.dateCreated,
            },
            UpdateExpression: "SET saveArray = list_append(saveArray, :accountID)",
            ExpressionAttributeValues: {
                ":accountID": [accountID],
            }
        }

        console.log(params);
        await db.send(new UpdateCommand(params));

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Successful update of save"}),
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }
    } catch (error) {
        console.log("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({error: "Internal server error."}),
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }
    }
}
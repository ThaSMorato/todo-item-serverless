import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;

  console.log({ userId });

  const response = await document
    .query({
      TableName: "users_todos",
      IndexName: "UserIdIndex",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": userId,
      },
    })
    .promise();

  const todos = response.Items;

  if (todos.length > 0) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        todos,
      }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid user",
    }),
  };
};

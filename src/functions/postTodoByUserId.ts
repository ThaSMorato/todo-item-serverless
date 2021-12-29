import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface IEventBody {
  title: string;
  deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userId } = event.pathParameters;

  const { title, deadline } = JSON.parse(event.body) as IEventBody;

  const id = uuidv4();

  const todo = {
    id,
    user_id: userId,
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
  };

  await document
    .put({
      TableName: "users_todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      todo,
    }),
  };
};

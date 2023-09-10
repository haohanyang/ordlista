import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Update a user profile
    PATCH /users/{userId}/profile
    {
        "username": string,
        "bio": string,
    }
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        params: dict = event["pathParameters"]
        body: dict = json.loads(event["body"])

        if "userId" not in params:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing userId"}),
            }
        user_id: str = params["userId"]

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if user_id != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os.environ["USER_TABLE"])
        table.load()
        user: dict = table.get_item(Key={"id": user_id})

        if "Item" not in user:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"User {user_id} not found"}),
            }

        if "username" in body:
            username = body["username"].strip()
            if len(username) < 4 or len(username) > 20:
                return {
                    "statusCode": 400,
                    "body": json.dumps(
                        {"message": "Username should be between 4 and 20 characters"}
                    ),
                }
            for char in username:
                if not (char.isalnum() or char == "_" or char == "-"):
                    return {
                        "statusCode": 400,
                        "body": json.dumps(
                            {
                                "message": "Username should only contain alphanumeric characters, underscores and dashes"
                            }
                        ),
                    }
            table.update_item(
                Key={"id": user_id},
                UpdateExpression=f"SET username=:username",
                ExpressionAttributeValues={":username": username},
                ReturnValues="NONE",
            )

            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Username updated"}),
            }

        elif "bio" in body:
            bio = body["bio"].strip()
            if len(bio) > 100:
                return {
                    "statusCode": 400,
                    "body": json.dumps(
                        {"message": "Bio should not be more than 100 characters"}
                    ),
                }
            table.update_item(
                Key={"id": user_id},
                UpdateExpression=f"SET bio=:bio",
                ExpressionAttributeValues={":bio": bio},
                ReturnValues="NONE",
            )

            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Bio updated"}),
            }

        return {
            "statusCode": 400,
            "body": json.dumps({"message": "Missing fields"}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Get a user profile
    GET /users/{userId}/profile
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        params: dict = event["pathParameters"]

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
                "statusCode": 404,
                "body": json.dumps({"message": f"User {user_id} not found"}),
            }

        return {
            "statusCode": 200,
            "body": json.dumps({"user": user["Item"]}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

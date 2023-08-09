import json
import boto3
import logging
import os
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    """
    Get all word lists for a user
    GET /users/{userId}/lists
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
        list_table = dyn_resource.Table(os.environ["LIST_TABLE"])
        list_table.load()

        word_table = dyn_resource.Table(os.environ["WORD_TABLE"])
        word_table.load()

        # TODO: Check if user exists
        query_result = list_table.query(
            IndexName="creatorId-createdAt-index",
            KeyConditionExpression=Key("creatorId").eq(user_id),
            ProjectionExpression="id, #name, description, createdAt",
            ExpressionAttributeNames={"#name": "name"},
        )

        list_items = query_result["Items"]
        for list_item in list_items:
            # Calculate word count
            list_id = list_item["id"]
            word_count = word_table.query(
                IndexName="listId-createdAt-index",
                KeyConditionExpression=Key("listId").eq(list_id),
                Select="COUNT",
            )["Count"]
            list_item["wordCount"] = word_count

        return {
            "statusCode": 201,
            "body": json.dumps({"lists": list_items}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

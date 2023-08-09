import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Delete a word list
    DELETE /lists/{listId}
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        # TODO: Check if user is logged in
        # creator_id: str = event["pathParameters"]["userId"]
        list_id: str = event["pathParameters"]["listId"]

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os["LIST_TABLE"])
        table.load()

        # Check if userId is valid
        list_item = table.get_item(Key={"id": list_id})
        if "Item" not in list_item:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"List {list_id} not found"}),
            }

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if list_item["Item"]["creatorId"] != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        # Delete word list
        table.delete_item(Key={"id": list_id})
        # TODO: delete all words in list

        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"List {list_id} was deleted"}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

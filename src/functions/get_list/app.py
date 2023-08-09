import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Get a word list
    GET /lists/{listId}
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        params: dict = event["pathParameters"]

        list_id: str = params["listId"]

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os.environ["LIST_TABLE"])
        table.load()
        list_item: dict = table.get_item(Key={"id": list_id})

        if "Item" not in list_item:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": f"List {list_id} not found"}),
            }

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if list_item["Item"]["creatorId"] != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        return {
            "statusCode": 200,
            "body": json.dumps({"list": list_item["Item"]}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

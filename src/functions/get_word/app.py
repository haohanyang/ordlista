import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Get a word
    GET /words/{wordId}
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        word_id = event["pathParameters"]["wordId"]

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os.environ["WORD_TABLE"])
        table.load()
        word: dict = table.get_item(Key={"id": word_id})
        if "Item" not in word:
            return {
                "statusCode": 404,
                "body": json.dumps({"message": f"Word {word_id} not found"}),
            }

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if word["Item"]["creatorId"] != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        return {
            "statusCode": 200,
            "body": json.dumps({"word": word["Item"]}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

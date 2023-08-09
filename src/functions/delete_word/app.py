import json
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Delete a word
    DELETE /words/{wordId}
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)

        # TODO: Check if user is logged in
        # creator_id: str = event["pathParameters"]["userId"]
        word_id: str = event["pathParameters"]["wordId"]

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os.environ["WORD_TABLE"])
        table.load()

        # Check if userId and listId are valid
        wordItem = table.get_item(Key={"id": word_id})
        if "Item" not in wordItem:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"Word {word_id} not found"}),
            }

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if wordItem["Item"]["creatorId"] != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        table.delete_item(Key={"id": word_id})
        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Word {word_id} was deleted"}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

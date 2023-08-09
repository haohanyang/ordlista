import json
import boto3
import logging
import os
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    """
    Get words in a word list
    GET /lists/{listId}/words
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        list_id: str = event["pathParameters"]["listId"]

        dyn_resource = boto3.resource("dynamodb")

        # Check if listId is valid
        list_table = dyn_resource.Table(os.environ["LIST_TABLE"])
        list_table.load()
        list_item = list_table.get_item(Key={"id": list_id})
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

        word_table = dyn_resource.Table(os.environ["WORD_TABLE"])
        word_table.load()

        fields = [
            "id",
            "swedishWord",
            "category",
            "audioUrl",
            "inflections",
            "examples",
            "synonyms",
            "translation",
        ]

        kwargs = {
            "IndexName": "listId-createdAt-index",
            "KeyConditionExpression": Key("listId").eq(list_id),
            "ExpressionAttributeNames": {f"#{field}": field for field in fields},
            "ProjectionExpression": ", ".join([f"#{field}" for field in fields]),
        }

        # query_result = word_table.query(
        #     IndexName="listId-createdAt-index",
        #     KeyConditionExpression=Key("listId").eq(list_id),
        #     ExpressionAttributeNames={"#translation": "translation"},
        #     ProjectionExpression="id, swedishWord, category, audioUrl, inflections, #translation, examples",
        # )
        query_result = word_table.query(**kwargs)

        return {
            "statusCode": 200,
            "body": json.dumps({"words": query_result["Items"]}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

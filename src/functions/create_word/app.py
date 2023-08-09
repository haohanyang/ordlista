import json
import boto3
import logging
import uuid
import os
from datetime import datetime


def lambda_handler(event, context):
    """
    Create a new word
    POST /words
    {
        "swedishWord": string
        "category": string
        "audioUrl": string
        "inflections": string
        "translation": string
        "examples": [string]
        "creatorId": string
        "listId": string
    }
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        body: dict = json.loads(event["body"])

        required_fields = [
            "swedishWord",
            "category",
            "audioUrl",
            "inflections",
            "translation",
            "examples",
            "creatorId",
            "listId",
            "synonyms",
        ]

        missing_fields = []
        for field in required_fields:
            if field not in body:
                missing_fields.append(field)

        if len(missing_fields) > 0:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"Missing fields: {missing_fields}"}),
            }

        creator_id = body["creatorId"]
        # Check if user is authorized
        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if creator_id != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        # Check if user exists
        # dyn_resource = boto3.resource("dynamodb")
        # user_table = dyn_resource.Table("ordlista-user")
        # user_table.load()
        # creator: dict = user_table.get_item(Key={"id": creator_id})
        # if "Item" not in creator:
        #     return {
        #         "statusCode": 400,
        #         "body": json.dumps({"message": f"User {creator_id} not found"}),
        #     }

        dyn_resource = boto3.resource("dynamodb")
        # Check if list exists
        list_id = body["listId"]
        word_list_table = dyn_resource.Table(os.environ["LIST_TABLE"])
        word_list_table.load()
        word_list: dict = word_list_table.get_item(Key={"id": list_id})
        if "Item" not in word_list:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"List {list_id} not found"}),
            }

        # Create word
        word_table = dyn_resource.Table(os.environ["WORD_TABLE"])
        word_table.load()

        word_id = uuid.uuid4().hex
        time = datetime.now().isoformat()

        word_item = {
            "id": word_id,
            "swedishWord": body["swedishWord"],
            "category": body["category"],
            "audioUrl": body["audioUrl"],
            "inflections": body["inflections"],
            "translation": body["translation"],
            "examples": body["examples"],
            "synonyms": body["synonyms"],
            "createdAt": time,
            "lastModifiedAt": time,
            "listId": list_id,
            "creatorId": creator_id,
        }
        word_table.put_item(Item=word_item)

        return {
            "statusCode": 201,
            "body": json.dumps({"word": word_item}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

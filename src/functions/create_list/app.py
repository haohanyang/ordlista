import json
import boto3
import logging
import uuid
import os
from datetime import datetime


def lambda_handler(event, context):
    """
    Create a new word list
    POST /lists
    {
        "name": string
        "description": string
        "creatorId": string
    }
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        body: dict = json.loads(event["body"])

        # Check if request body is valid
        if "name" not in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing name"}),
            }

        if "description" not in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing description"}),
            }

        if "creatorId" not in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing creatorId"}),
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
        #         "body": json.dumps({"message": "User not found"}),
        #     }

        # Create word list
        dyn_resource = boto3.resource("dynamodb")
        word_list_table = dyn_resource.Table(os.environ["LIST_TABLE"])
        word_list_table.load()

        list_id = uuid.uuid4().hex
        time = datetime.now().isoformat()

        list_item = {
            "id": list_id,
            "name": body["name"],
            "description": body["description"],
            "creatorId": creator_id,
            "createdAt": time,
            "lastModifiedAt": time,
        }
        word_list_table.put_item(Item=list_item)
        list_item["wordCount"] = 0
        return {
            "statusCode": 201,
            "body": json.dumps({"list": list_item}),
        }

    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

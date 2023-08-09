import json
import boto3
import logging
import os
from datetime import datetime


def lambda_handler(event, context):
    """
    Update a word
    PATCH /words/{wordId}
    {
        "swedishWord": string
        "category": string
        "audioUrl": string
        "inflections": string
        "translation": string
        "examples": [string]
    }
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)
        word_id: str = event["pathParameters"]["wordId"]

        body: dict = json.loads(event["body"])

        kwargs = {
            "Key": {"id": word_id},
            "UpdateExpression": "set ",
            "ExpressionAttributeValues": {},
            "ExpressionAttributeNames": {},
            "ReturnValues": "UPDATED_NEW",
        }

        has_update = False
        update_fields = [
            "swedishWord",
            "category",
            "audioUrl",
            "inflections",
            "translation",
            "synonyms",
            "examples",
        ]

        for field in update_fields:
            if field in body:
                kwargs["UpdateExpression"] += f"#{field}=:{field}Val, "
                kwargs["ExpressionAttributeValues"][f":{field}Val"] = body[field]
                kwargs["ExpressionAttributeNames"][f"#{field}"] = field
                has_update = True

        if has_update is False:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "No fields to update"}),
            }

        kwargs["UpdateExpression"] += "lastModifiedAt=:lastModifiedAtVal"
        kwargs["ExpressionAttributeValues"][
            ":lastModifiedAtVal"
        ] = datetime.now().isoformat()

        logger.info(kwargs)
        dyn_resource = boto3.resource("dynamodb")

        table = dyn_resource.Table(os.environ["WORD_TABLE"])
        table.load()

        word_item = table.get_item(Key={"id": word_id})
        if "Item" not in word_item:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": f"Word {word_id} not found"}),
            }

        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]
        if word_item["Item"]["creatorId"] != sub:
            return {
                "statusCode": 403,
                "body": json.dumps({"message": "Forbidden"}),
            }

        updated_item = table.update_item(**kwargs)["Attributes"]
        updated_item["id"] = word_id
        return {
            "statusCode": 200,
            "body": json.dumps({"word": updated_item}),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

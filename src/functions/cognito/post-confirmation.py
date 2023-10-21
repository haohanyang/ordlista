import boto3
import logging
import os
from datetime import datetime


def lambda_handler(event, context):
    logger = logging.getLogger(context.function_name)
    user_id: str = event["userName"]
    email: str = event["request"]["userAttributes"]["email"]
    username: str = event["request"]["userAttributes"]["preferred_username"]

    dyn_resource = boto3.resource("dynamodb")
    table = dyn_resource.Table(os.environ["USER_TABLE"])
    table.load()

    time = datetime.now().isoformat()
    user_item = {
        "id": user_id,
        "email": email,
        "username": username,
        "bio": "The user has not written a bio yet.",
        "avatar": "https://picsum.photos/200/300",
        "createdAt": time,
        "lastModifiedAt": time,
    }
    table.put_item(Item=user_item)
    logger.info(f"User {user_id} created")

    return event

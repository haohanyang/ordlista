import boto3
import logging
import os
from datetime import datetime


def lambda_handler(event, context):
    """
    Create a new user
    The function is triggered by AWS Cognito PreSignUp,
    thus not managed by API Gateway
    {
        "id": string
        "email": string
        "username": string
        "bio": string
        "avatar": string
        "createdAt": string
        "lastModifiedAt": string
    }
    """
    logger = logging.getLogger(context.function_name)
    user_id: str = event["userName"]
    email: str = event["request"]["userAttributes"]["email"]
    username: str = event["request"]["userAttributes"]["preferred_username"]

    dyn_resource = boto3.resource("dynamodb")
    table = dyn_resource.Table(os.environ["USER_TABLE"])
    table.load()

    # Username shoud be at least 4 characters long and at most 20
    # and contain only alphanumeric characters, underscores, and dashes
    if len(username) < 4 or len(username) > 20:
        raise Exception("Username should be between 4 and 20 characters long")

    for char in username:
        if not (char.isalnum() or char == "_" or char == "-"):
            raise Exception(
                "Username should only contain alphanumeric characters, underscores, and dashes"
            )

    time = datetime.now().isoformat()
    user_item = {
        "id": user_id,
        "email": email,
        "username": email.split("@")[0],
        "bio": "The user has not written a bio yet.",
        "avatar": "https://picsum.photos/200/300",
        "createdAt": time,
        "lastModifiedAt": time,
    }
    table.put_item(Item=user_item)
    logger.info(f"User {user_id} created")

    # We don't need to confirm the email for now
    event["response"]["autoConfirmUser"] = "true"
    return event

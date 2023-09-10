import boto3
import logging
import os
import json
import uuid

URL_EXPIRATION_SECONDS = 60


def lambda_handler(event, context):
    """
    Upload a new avatar, and update the user's avatar url
    """
    logger = logging.getLogger(context.function_name)

    try:
        body: dict = json.loads(event["body"])
        content_type = body["contentType"]
        sub = event["requestContext"]["authorizer"]["jwt"]["claims"]["sub"]

        if content_type not in ["image/png", "image/jpeg"]:
            return {
                "statusCode": 400,
                "body": json.dumps(
                    {"message": f"Invalid content type: {content_type}"}
                ),
            }

        s3_client = boto3.client("s3")
        key = "user-assets/" + uuid.uuid4().hex
        bucket_name = os.environ["FILE_BUCKET"]

        result = s3_client.generate_presigned_post(
            Bucket=bucket_name,
            Key=key,
            Fields={
                "Content-Type": content_type,
                "success_action_status": 201,
                "x-amz-meta-user": sub,
            },
            Conditions=[
                # File type must be an image
                ["starts-with", "$Content-Type", "image"],
                # File size must be between 0 and 10 MB
                ["content-length-range", 0, 10 * 1024 * 1024],
                ["eq", "$x-amz-meta-user", sub],
                ["eq", "$success_action_status", 201],
            ],
            ExpiresIn=URL_EXPIRATION_SECONDS,
        )

        return {
            "statusCode": 200,
            "body": json.dumps(result),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"}),
        }

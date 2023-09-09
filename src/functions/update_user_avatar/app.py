import urllib.parse
import boto3
import os
import logging


def lambda_handler(event, context):
    """
    Update user avatar after user uploads a new avatar image to S3 bucket
    The event is triggered by S3
    """
    try:
        logger = logging.getLogger(context.function_name)
        s3 = boto3.client("s3")
        bucket = event["Records"][0]["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(
            event["Records"][0]["s3"]["object"]["key"], encoding="utf-8"
        )
        response = s3.get_object(Bucket=bucket, Key=key)
        # get meta data x-amz-meta-user
        meta_data = response["Metadata"]
        logger.info(meta_data)
        user_id = meta_data["user"]

        dyn_resource = boto3.resource("dynamodb")
        table = dyn_resource.Table(os.environ["USER_TABLE"])
        table.load()
        cdn_base_url = os.environ["CDN_BASE_URL"]

        table.update_item(
            Key={"id": user_id},
            UpdateExpression=f"SET avatar=:avatarVal",
            ExpressionAttributeValues={":avatarVal": cdn_base_url + "/" + key},
            ReturnValues="NONE",
        )
    except Exception as e:
        logger.error(e)
        raise e

"""
Add a new attribute to the table.
"""
import boto3

TABLE_NAME = ""
NEW_ATTRIBUTE = ""

try:
    dyn_resource = boto3.resource("dynamodb")
    table = dyn_resource.Table(TABLE_NAME)
    table.load()

    scan_kwargs = {
        "ProjectionExpression": "id",
    }
    items = table.scan(**scan_kwargs)["Items"]

    for item in items:
        word_id = item["id"]
        table.update_item(
            Key={"id": word_id},
            UpdateExpression=f"SET #{NEW_ATTRIBUTE}=:{NEW_ATTRIBUTE}Val",
            ExpressionAttributeValues={f":{NEW_ATTRIBUTE}Val": ""},
            ExpressionAttributeNames={f"#{NEW_ATTRIBUTE}": NEW_ATTRIBUTE},
        )

except Exception as e:
    print(e)

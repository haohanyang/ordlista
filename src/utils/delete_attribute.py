"""
Delete an attribute of the table.
"""
import boto3

TABLE_NAME = ""
ATTRIBUTE_TO_DELETE = ""

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
            UpdateExpression=f"REMOVE {ATTRIBUTE_TO_DELETE}",
        )

except Exception as e:
    print(e)

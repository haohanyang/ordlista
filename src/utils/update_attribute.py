"""
Update an attribute of the table.
"""
import boto3

TABLE_NAME = ""
ATTRIBUTE_TO_UPDATE = ""


def update_fun(original_value):
    return original_value


try:
    dyn_resource = boto3.resource("dynamodb")
    table = dyn_resource.Table(TABLE_NAME)
    table.load()

    scan_kwargs = {
        "ProjectionExpression": f"id, #{ATTRIBUTE_TO_UPDATE}",
        "ExpressionAttributeNames": {
            f"#{ATTRIBUTE_TO_UPDATE}": f"{ATTRIBUTE_TO_UPDATE}"
        },
    }
    items = table.scan(**scan_kwargs)["Items"]

    for item in items:
        word_id = item["id"]
        original_value = item[ATTRIBUTE_TO_UPDATE]
        table.update_item(
            Key={"id": word_id},
            UpdateExpression=f"SET #{ATTRIBUTE_TO_UPDATE}=:{ATTRIBUTE_TO_UPDATE}Val",
            ExpressionAttributeValues={
                f":{ATTRIBUTE_TO_UPDATE}Val": update_fun(original_value)
            },
            ExpressionAttributeNames={f"#{ATTRIBUTE_TO_UPDATE}": ATTRIBUTE_TO_UPDATE},
        )

except Exception as e:
    print(e)

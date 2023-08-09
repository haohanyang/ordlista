import json
import boto3
import logging
import os
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    """
    Search a word in the dictionary
    POST /search
    {
        "keyword": string
    }
    """
    logger = logging.getLogger(context.function_name)
    try:
        logger.info(event)

        body = json.loads(event["body"])
        if not "keyword" in body:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Missing word in the request body"}),
            }

        keyword = body["keyword"]

        dyn_resource = boto3.resource("dynamodb")
        dict_table = dyn_resource.Table(os.environ["DICT_TABLE"])
        dict_table.load()

        kwargs = {
            "IndexName": "swedishWord-class-index",
            "KeyConditionExpression": Key("swedishWord").eq(keyword),
            "ProjectionExpression": "",
            "ExpressionAttributeNames": {},
        }

        attributes = [
            "class",
            "swedishWord",
            "audioUrl",
            "inflections",
            "translations",
            "examples",
            "synonyms",
        ]

        for attribute in attributes:
            kwargs["ProjectionExpression"] += "#" + attribute + ","
            kwargs["ExpressionAttributeNames"]["#" + attribute] = attribute

        # Remove last comma
        kwargs["ProjectionExpression"] = kwargs["ProjectionExpression"][:-1]

        result = dict_table.query(**kwargs)["Items"]

        for i in range(len(result)):
            item = result[i]
            item["inflections"] = " ".join(item["inflections"])
            item["translation"] = ", ".join(item["translations"])
            item["synonyms"] = ", ".join(item["synonyms"])
            item["category"] = ""
            """
            pp -> preposition
            kn -> konjunktion
            rg -> ?
            in -> interjektion
            ab -> adverb
            pn -> pronomen
            vb -> verb
            prefix -> prefix
            jj -> adjektiv
            nn -> substantiv
            abbrev -> förkortning
            """
            word_class = item["class"]
            if word_class == "nn":
                item["category"] = "substantiv"
            elif word_class == "jj":
                item["category"] = "adjektiv"
            elif word_class == "vb":
                item["category"] = "verb"
            elif word_class == "ab":
                item["category"] = "adverb"
            elif word_class == "pp":
                item["category"] = "preposition"
            elif word_class == "kn":
                item["category"] = "konjunktion"
            elif word_class == "in":
                item["category"] = "interjektion"
            elif word_class == "pn":
                item["category"] = "pronomen"
            elif word_class == "prefix":
                item["category"] = "prefix"
            elif word_class == "abbrev":
                item["category"] = "förkortning"
            else:
                item["category"] = "övrigt"

        return {
            "statusCode": 200,
            "body": json.dumps({"result": result}, ensure_ascii=False),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

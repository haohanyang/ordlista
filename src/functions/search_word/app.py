import json
import boto3
import logging
import os
import pg8000.native

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
        if "%" in keyword or "(" in keyword or ")" in keyword:
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Invalid keyword"}),
            }

        # table_name = os.environ["DICT_TABLE"]
        # TODO: Use the table name from the environment variable
        con = pg8000.native.Connection("postgres",
            host=os.environ["PG_HOST"], database="postgres", password=os.environ["PG_PASSWORD"])
        rows = con.run("SELECT * FROM test.dictionary WHERE swedish_word LIKE (:kw) LIMIT 10", kw=keyword + "%")
        words = []
        for row in rows:
            word = {
            "id": row[0],
            "swedishWord": row[1],
            "category": "",
            "class": row[2],
            "audioUrl": "",
            "inflections": " ".join(row[6]),
            "translation": ", ".join(row[3]),
            "examples": row[4],
            "synonyms": ", ".join(row[5])
            }

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
            word_class = word["class"]
            if word_class == "nn":
                word["category"] = "substantiv"
            elif word_class == "jj":
                word["category"] = "adjektiv"
            elif word_class == "vb":
                word["category"] = "verb"
            elif word_class == "ab":
                word["category"] = "adverb"
            elif word_class == "pp":
                word["category"] = "preposition"
            elif word_class == "kn":
                word["category"] = "konjunktion"
            elif word_class == "in":
                word["category"] = "interjektion"
            elif word_class == "pn":
                word["category"] = "pronomen"
            elif word_class == "prefix":
                word["category"] = "prefix"
            elif word_class == "abbrev":
                word["category"] = "förkortning"
            else:
                word["category"] = "övrigt"
            words.append(word)



        return {
            "statusCode": 200,
            "body": json.dumps({"result": words}, ensure_ascii=False),
        }
    except Exception as e:
        logger.error(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal server error"}),
        }

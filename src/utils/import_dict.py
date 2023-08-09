"""
Parse Folkets lexikon(People's dictionary) data folkets_sv_en_public.xml 
(https://folkets-lexikon.csc.kth.se/folkets/om.html) entries  and write to DynamoDB.

It takes a while to write all the entries to the database.
"""

import xml.etree.ElementTree as ET
import boto3
import uuid

PATH_TO_FILE = "folkets_sv_en_public.xml"

try:
    tree = ET.parse(PATH_TO_FILE)
    root = tree.getroot()
    dyn_resource = boto3.resource("dynamodb")
    table = dyn_resource.Table("folkets-lexikon")
    table.load()
    word_count = 0
    with table.batch_writer() as writer:
        for child in root:
            if child.tag == "word":
                swedishWord = child.attrib["value"]
                word = {
                    "id": uuid.uuid4().hex,
                    "swedishWord": swedishWord,
                    "translations": [],
                    "synonyms": [],
                    "examples": [],
                    "inflections": [],
                    "audioUrl": "",
                    "class": "",
                }
                if "class" in child.attrib:
                    word["class"] = child.attrib["class"]
                for sub_child in child:
                    if sub_child.tag == "translation":
                        word["translations"].append(sub_child.attrib["value"])
                    if sub_child.tag == "synonym":
                        word["synonyms"].append(sub_child.attrib["value"])
                    if sub_child.tag == "example":
                        example = sub_child.attrib["value"]
                        for example_sub_child in sub_child:
                            if example_sub_child.tag == "translation":
                                example += (
                                    " (" + example_sub_child.attrib["value"] + ")"
                                )
                        word["examples"].append(example)
                    if sub_child.tag == "paradigm":
                        for paradigm_sub_child in sub_child:
                            if paradigm_sub_child.tag == "inflection":
                                word["inflections"].append(
                                    paradigm_sub_child.attrib["value"]
                                )
                    if sub_child.tag == "phonetic":
                        convertedWord = ""
                        for char in swedishWord:
                            if char == "ö":
                                convertedWord += "0366"
                            elif char == "ä":
                                convertedWord += "0344"
                            elif char == "å":
                                convertedWord += "0345"
                            elif char == "é":
                                convertedWord += "0351"
                            elif char == " ":
                                convertedWord += "%20"
                            elif char == "à":
                                convertedWord += "0340"
                            else:
                                convertedWord += char
                        word[
                            "audioUrl"
                        ] = f"https://lexin.nada.kth.se/sound/{convertedWord}.mp3"
                word_count += 1
                # Write item to database
                writer.put_item(Item=word)

except Exception as err:
    print(err)

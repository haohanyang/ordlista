"""
Parse Folkets lexikon(People's dictionary) data folkets_sv_en_public.xml
(https://folkets-lexikon.csc.kth.se/folkets/om.html) entries and write to CSV file

The file can then be imported to Postgres
"""

import xml.etree.ElementTree as ET
import csv

PATH_TO_FILE = "folkets_sv_en_public.xml"

try:
    tree = ET.parse(PATH_TO_FILE)
    root = tree.getroot()
    with open("dictionary.csv", "w") as csvfile:
        word_count = 0
        csv_writer = csv.writer(csvfile, delimiter=",", quotechar='"')
        csv_writer.writerow(
            [
                "id",
                "swedish_word",
                "original_word",
                "word_class",
                "translations",
                "examples",
                "synonyms",
                "inflections",
                "sound_file",
            ]
        )
        for child in root:
            if child.tag == "word":
                swedish_word = child.attrib["value"].replace("|", "").strip()
                word_class = ""
                translations = []
                examples = []
                synonyms = []
                inflections = []
                sound_file = ""
                if "class" in child.attrib:
                    word_class = child.attrib["class"].strip()
                for sub_child in child:
                    if sub_child.tag == "translation":
                        translation = sub_child.attrib["value"].strip().strip(",")
                        if translation:
                            translations.append(translation)
                    if sub_child.tag == "synonym":
                        synonym = sub_child.attrib["value"].strip().strip(",")
                        if synonym:
                            synonyms.append(synonym)
                    if sub_child.tag == "example":
                        example = sub_child.attrib["value"].strip()
                        if example:
                            for example_sub_child in sub_child:
                                if example_sub_child.tag == "translation":
                                    translation = example_sub_child.attrib[
                                        "value"
                                    ].strip()
                                    if translations:
                                        example += " (" + translation + ")"
                                        examples.append(example)
                    if sub_child.tag == "paradigm":
                        for paradigm_sub_child in sub_child:
                            if paradigm_sub_child.tag == "inflection":
                                inflection = (
                                    paradigm_sub_child.attrib["value"]
                                    .replace("|", "")
                                    .strip()
                                    .strip(",")
                                )
                                if inflection:
                                    inflections.append(inflection)
                    if sub_child.tag == "phonetic" and "soundFile" in sub_child.attrib:
                        sound_file = sub_child.attrib["soundFile"].strip()
                if len(inflections) > 0:
                    # Add inflections as separate rows
                    # while keeping the original form
                    # to show in the search results
                    for inflection in inflections:
                        csv_writer.writerow(
                            [
                                word_count,
                                inflection,
                                swedish_word,
                                word_class,
                                "{" + ",".join(translations) + "}",
                                "{" + ",".join(examples) + "}",
                                "{" + ",".join(synonyms) + "}",
                                "{" + ",".join(inflections) + "}",
                                sound_file,
                            ]
                        )
                        word_count += 1
                else:
                    csv_writer.writerow(
                        [
                            word_count,
                            swedish_word,
                            swedish_word,
                            word_class,
                            "{" + ",".join(translations) + "}",
                            "{" + ",".join(examples) + "}",
                            "{" + ",".join(synonyms) + "}",
                            "{" + ",".join(inflections) + "}",
                            sound_file,
                        ]
                    )
                    word_count += 1
except Exception as err:
    print(err)

create table test.dictionary (
    id INT PRIMARY KEY,
    swedish_word text,
    original_word text,
    word_class text,
    translations text[],
    examples text[],
    synonyms text[],
    inflections text[],
    sound_file text
)

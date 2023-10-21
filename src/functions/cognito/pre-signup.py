import logging


def lambda_handler(event, context):
    logger = logging.getLogger(context.function_name)

    user_id: str = event["userName"]
    email: str = event["request"]["userAttributes"]["email"]
    username: str = event["request"]["userAttributes"]["preferred_username"]

    # Check if the username is valid
    # Username shoud be at least 4 characters long and at most 20
    # and contain only alphanumeric characters, underscores, and dashes
    if len(username) < 4 or len(username) > 20:
        raise Exception("Username should be between 4 and 20 characters long")

    for char in username:
        if not (char.isalnum() or char == "_" or char == "-"):
            raise Exception(
                "Username should only contain alphanumeric characters, underscores, and dashes"
            )

    logger.info(f"User {user_id} is created with username {username} and email {email}")
    return event

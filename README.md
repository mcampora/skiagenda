# skiagenda
* general idea
    * Simple project used to check the availability of our flat, who is using it and when, and manage reservations
* architecture
    * fully deployed on AWS, will use:
    * S3 for the Web content
    * DynamoDB as persistent layer
    * Cognito to identiy users and associate reservations
    * Lambda to process user requests
    * Cloudformation to automate setup
    * (some form of build pipeline to propagate changes automatically)

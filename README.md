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
* setup and tests
    * configure AWS CLI properly
        * >aws configure
        * AWS Access Key ID [None]: /accesskey/
        * AWS Secret Access Key [None]: /secretkey/
        * Default region name [None]: us-east-1
        * Default output format [None]:
    * install http-server to test and evolve the website part of the project
        * >npm install http-server -g
        * >http-server [path] [options]
    * install jasmine to run tests and check deployment is funtional
        * >npm install -g jasmine
        * >cd test # go to the test folder
        * >jasmine # to launch the tests

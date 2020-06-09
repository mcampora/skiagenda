# skiagenda
* general idea
    * A simple project used to check the availability of our flat, who is using it and when, and manage reservations
    * the real motivation is to test lambdas, dynamodb, cloudformation, github actions
* architecture
    * the project is divided into several layers
        * a database layer with a set of helper functions, relying on AWS DynamoDB
        * a services layer with an API built on top of the database layer, relying on AWS API Gateway, AWS lambda functions, Node.js, AWS Cognito to manage users identities
        * a frontend layer relying on JQuery and FullCalendar libraries, pushed to an AWS S3 bucket
        * each layer comes with its own unit tests and CloudFormation scripts to automate deployment
* setup and tests
    * configure AWS CLI properly
        * the project supports deployments on two accounts (dev and production)
            * dev
                * >aws configure
                * >AWS Access Key ID [None]: /accesskey/
                * >AWS Secret Access Key [None]: /secretkey/
                * >Default region name [None]: us-east-1
                * >Default output format [None]: json
            * prod
                * >aws configure --profile prod
                * >AWS Access Key ID [None]: /accesskey2/
                * >AWS Secret Access Key [None]: /secretkey2/
                * >Default region name [None]: us-east-1
                * >Default output format [None]: json
    * each layer (database, services, website) contains the same subfolders
        * check the src folder for source files
        * check the scripts folder for deployment instructions
        * check the tests folder for test scripts
    * install jasmine to run tests and check deployment is funtional
        * >npm install -g jasmine
        * >cd test # go to one test folder
        * >npm install # to fetch dependencies
        * >jasmine # to launch the tests
    * install http-server to test and evolve the website part of the project
        * >cd website
        * >npm install http-server -g
        * >http-server
    * check the utilities folder to deploy the project in one go
        * deploy.sh automates the various deployments
    * data definition
        * Reservation - used to capture reservations/usage
            * resaid - uid computed at creation time
            * creationTime - iso date/time in zulu timezone (ex. yyyy-mm-ddThh:mm:ss:000Z)
            * firstday - iso date/time in zulu timezone, noon
            * lastday - iso date/time in zulu timezone, noon
            * note - free text
            * resaowner - email id of the user (@ replaced with '-at-')
            * updateTime - iso date/time in zulu timezone
            * category - 3 values identified: family, shared, rented
            * revenue - used to capture the revenue associated to a rental (ie. EUR)
        * Holidays - imports education.gov.fr calendar (ical format)
            * hid - sequence order, zone+id (ex. A1)
            * creationTime - iso date/time in zulu timezone (ex. yyyy-mm-ddThh:mm:ss:000Z)
            * end - iso date/time in zulu timezone
            * start - iso date/time in zulu timezone
            * summary - description (ex. Vacances de la Toussaint - Zone A)
            * zone - letter code A/B/C
        * Users at the moment are captured in Cognito as simple identities


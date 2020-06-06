# skiagenda
* general idea
    * Simple project used to check the availability of our flat, who is using it and when, and manage reservations
* architecture
    * the project is divided into several layers
        * a database layer with a set of helper functions relying on AWS DynamoDB
        * a backend layer with an API built on top of the database layer relying on AWS API Gateway, AWS lambda functions written in Node.js, AWS Cognito to manage users identities
        * a frontend layer relying on JQuery and FullCalendar libraries, pushed to an AWS S3 bucket
        * each layer comes with its own unit tests and CloudFormation scripts to automate deployment
* setup and tests
    * configure AWS CLI properly
        * >aws configure
        * >AWS Access Key ID [None]: /accesskey/
        * >AWS Secret Access Key [None]: /secretkey/
        * >Default region name [None]: us-east-1
        * >Default output format [None]:
    * install http-server to test and evolve the website part of the project
        * >npm install http-server -g
        * >http-server [path] [options]
    * install jasmine to run tests and check deployment is funtional
        * >npm install -g jasmine
        * >cd test # go to the test folder
        * >jasmine # to launch the tests
    * data definition
        * Reservation - used to capture reservations/usage
            * resaid - uid computed at creation time
            * creationTime - iso date/time in zulu timezone (ex. yyyy-mm-ddThh:mm:ss:000Z)
            * firstday - iso date/time in zulu timezone, noon
            * lastday - iso date/time in zulu timezone, noon
            * note - free text
            * resaowner - email id of the user (@ replaced with '-at-')
            * updateTime - iso date/time in zulu timezone
        * Holidays - imports education.gov.fr calendar (ical format)
            * hid - sequence order, zone+id (ex. A1)
            * creationTime - iso date/time in zulu timezone (ex. yyyy-mm-ddThh:mm:ss:000Z)
            * end - iso date/time in zulu timezone
            * start - iso date/time in zulu timezone
            * summary - description (ex. Vacances de la Toussaint - Zone A)
            * zone - letter code A/B/C
        * Users at the moment are captured in Cognito


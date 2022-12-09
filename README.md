# skiagenda
* general idea
    * A simple project used to check the availability of a rental flat, who is using it and when
    * the real motivation is to test lambdas, dynamodb, cloudformation, github actions
* architecture
    * the project is divided into several layers
        * a database layer with a set of helper functions, relying on AWS DynamoDB
        * a services layer with an API built on top of the database layer, relying on AWS API Gateway, AWS lambda functions, Node.js, AWS Cognito to manage users identities
        * a frontend layer relying on JQuery and FullCalendar libraries, pushed to an AWS S3 bucket
        * organised as a mono-repo, each layer is stored in a subdirectory, comes with its own unit tests and CloudFormation scripts to automate deployment, a specific GitHub workflow is provided for each layer
* setup
    * the repo and workflows are designed to deploy changes on 2 environments: test and prod
    * 2 AWS accounts have been created and 2 sets of secrets defined containing the credentials required
    * changes on main are pushed to the test account
    * changes on prod are pushed to the prod account, so when a change is ready simply merge main to prod with a manual command
        * ex: `git switch main && git pull && git switch prod && git rebase main && git push`
* design notes
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
* todo
    * implement and test the prod workflow for services
    * implement and test the dev workflow for website
    * implement and test the prod workflow for website
    * automate the vacation update
    * test R53 and CloudFront
    * move the frontend to React
    * introduce a statistics section
    * move AWS secrets to roles and temporary tokens

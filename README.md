# skiagenda
* general idea
    * A simple project used to check the availability of a rental flat, who is using it and when
    * the real motivation is to test lambdas, dynamodb, cloudformation, github actions
* architecture
    * the project is divided into several layers
        * a database layer with a set of helper functions, relying on AWS DynamoDB
        * a services layer with an API relying on AWS API Gateway, AWS lambda functions, Node.js, AWS Cognito
        * a frontend layer relying on JQuery and FullCalendar libraries, pushed to an AWS S3 bucket
        * organised as a mono-repo, each layer is stored in a subdirectory, comes with unit tests, a CloudFormation script, a GitHub workflow
* setup
    * the repo and workflows are designed to deploy changes on 2 environments: test and prod
    * 2 AWS accounts have been created and 2 sets of secrets defined
    * changes on main are pushed to the test account
    * changes on prod are pushed to the prod account, merge main to prod with a manual command to trigger the deployment
        * ex: `git switch main && git pull && git switch prod && git rebase main && git push`
* todo
    * implement and test the prod workflow for services and website
    * polish CloudFront
        * s3 with access control
        * multiple origins
        * restricted access to signed users
    * test and automate R53
    * move the frontend to React
    * version resources so we bypass caches
    * introduce a statistics section
    * automate the vacation update
    * move AWS secrets to roles and temporary tokens

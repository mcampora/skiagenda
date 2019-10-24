* epics
    * basic UI with technical fundamentals
        * fwk and calendar widget
        * simulate signin as a first step
    * home view
    * view prev/next month / initial
    * insert resa / initial
    * update resa
    * delete resa
    * import school holidays
    * user management
        * register
        * signin
        * update user
        * signout
* technical improvements
    * GET is not working ; params are not passed as part of the body
    * add user functions
    * add holidays functions
    * extract function boilerplate into a shared module
    * cloudformation structure template (AWS::CloudFormation::Stack or AWS::Include)
    * test account
        * cloudformation permissions
        * s3 permissions
        * ...
    * cloudwatch log expiration
    * ci/cd pipeline (CodePipeline)
* done
    * error cases
    * test automation
    * finalise GET to consume an input month
    * finalise POST and PUT to prevent overlaps
    * cloudformation CORS settings for the API
    * technical foundations
        * web -> apigw -> authorization -> lambda -> dynamodb
    * consume too much S3 accesses
        * cache config.js
        * decouple bucket creation and the rest

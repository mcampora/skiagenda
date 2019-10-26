* epics
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
    * UI
        * fix the overlap control at creation time
        * open a dialog at click time and offer delete action
    * split backend and database scripts to preserve data
    * work on a backup / restore procedure for the data
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
    * basic UI with technical fundamentals
        * fwk and calendar widget
        * simulate signin as a first step
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

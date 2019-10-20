* epics
    * basic UI with technical fundamentals (fwk and calendar widget)
    * home view
    * register
    * signin
    * update user
    * signout
    * view prev/next month / initial
    * insert resa / initial
    * update resa
    * delete resa
    * import school holidays
* technical improvements
    * cloudformation CORS settings for the API
    * finalise GET to consume an input month
    * factor function boilerplate
    * cloudformation structure template (AWS::CloudFormation::Stack or AWS::Include)
    * test account
        * cloudformation permissions
        * s3 permissions
        * ...
    * cloudwatch log expiration
    * ci/cd pipeline (CodePipeline)
    * test automation / first draft available in node.js / need to find a proper assert framework
    * error cases
* done
    * technical foundations
        * web -> apigw -> authorization -> lambda -> dynamodb
    * consume too much S3 accesses
        * cache config.js
        * decouple bucket creation and the rest

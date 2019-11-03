* epics
    * import school holidays
    * offer the possibility to add notes to a reservation
    * user management
        * register
        * signin
        * update user
        * signout
* technical improvements
    * fixes
        * fix the overlap control at creation time
        * set minimum duration to 2 days, one night?
        * add an error popup for API issues / work on message control
        * Calendar::toResa -> dates are translated in zulu time
    * work on a backup / restore procedure for the data 
        * the restore is etremely long and you have to drop the table beforehand
        * a multi account setup where the prod instance is preserved could be a good alternative
    * add user functions
    * add holidays functions
    * extract function boilerplate into a shared module
    * cloudformation structure template (AWS::CloudFormation::Stack or AWS::Include)
    * cloudwatch log expiration
    * ci/cd pipeline (CodePipeline)
* epics
    * offer the possibility to add notes to a reservation
    * user management
        * register
        * signin
        * update user
        * signout
* technical improvements
    * exploded again my S3 put/get limits
        * remove 3rd party js, pull them from elsewhere
    * fixes
        * remove overlap control
        * add an error popup for API issues / work on stringification
        * Calendar::toResa -> dates are translated in zulu time
    * a multi account setup test vs prod
    * add user functions
    * add holidays events in the UI (passive)
    * ci/cd pipeline (CodePipeline)
    * manage the packaging dependencies
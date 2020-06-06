* epics
    * user management
        * update user
        * forgot pwd
        * cookie and singlesignin
    * flag reservation
        * me/us
        * familly/friend
        * rental
    * occupation api
        * provide a list of available/booked periods
        * block new slot / cancel slot
        * event feed to monitor the calendar evolution
    * occupation statistics
        * per year / per quarter / per month
        * nb days, %
        * breakdown per flag
        * evolution yoy
    * session timeout -> redirect to the login page
* technical improvements
    * backup / restore scripts for the data layer / automate the backup / clean old backups
    * integrate backup / restore in the delete / create infra scripts
    * styling for resa (largeur lines, crossed ends)
    * styling for the user management
    * error cases for user management
    * fixes
        * user id on email prefix
        * Calendar::toResa -> dates are translated in zulu time
    * a multi account setup test vs prod or green / blue deployment
    * add user functions
    * ci/cd pipeline (CodePipeline)

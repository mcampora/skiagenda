* epics
    * user management
        * update user
        * forgot pwd
        * cookie and singlesignin
    * occupation api
        * provide a list of available/booked periods
        * block new slot / cancel slot
        * event feed to monitor the calendar evolution
* technical improvements
    * backup / restore scripts for the data layer / automate the backup / clean old backups
    * integrate backup / restore in the delete / create infra scripts
    * styling for resa (largeur lines, crossed ends)
    * fixes
        * user id on email prefix
        * Calendar::toResa -> dates are translated in zulu time
    * a multi account setup test vs prod or green / blue deployment

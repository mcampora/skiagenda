* epics
    * import school holidays
    * offer the possibility to add notes to a reservation
    * user management
        * register
        * signin
        * update user
        * signout
* technical improvements
    * exploded again my S3 put/get limits
        * remove local js, pull them from elsewhere
    * fixes
        * fix the overlap control at creation time
        * set minimum duration to 2 days, one night?
        * add an error popup for API issues / work on message control
        * Calendar::toResa -> dates are translated in zulu time
    * a multi account setup test vs prod
    * add user functions
    * add holidays functions
        * can parse ical sources available on data.gouv.fr
        * https://www.data.gouv.fr/en/datasets/le-calendrier-scolaire-format-ical/
        * A: https://www.data.gouv.fr/en/datasets/r/b580138b-ae5c-4b4d-8cbf-110ffd373192
        * B: https://www.data.gouv.fr/en/datasets/r/139ef8d5-f2ae-41fc-bc3a-d0e90a9ab7ad
        * C: https://www.data.gouv.fr/en/datasets/r/17254f2a-a611-4b1f-995c-df45a4570f12
    * ci/cd pipeline (CodePipeline)
#!/bin/bash

# backup the database content
aws dynamodb create-backup \
    --table-name Reservations \
    --backup-name reservations-backup

#!/bin/bash

#  notesdiagnose.sh
#  Feedback Assistant
#
#  Copyright (c) 2014 Apple, Inc. All rights reserved.

function print_usage
{
    echo "usage: notesdiagnose [dest_dir]"
    echo ""
    echo "required arguments:"
    echo "   dest_dir : Full path where collected data will be placed"
    exit 1
}

function collect_noteslogs
{
  LOGS_DIR="${HOME}/Library/Containers/com.apple.Notes/Data/Library/Logs/"
  if [ -e "$LOGS_DIR" ];
  then
    cp -r "$LOGS_DIR" "$TMP_DIR"
  else
      syslog -s -l Warning "NotesDiagnostics Warning: "$LOGS_DIR" not found"
  fi
}

function collect_cloudkit
{
  CLOUDKIT_ASL="/var/log/com.apple.cloudkit.asl"
  if [ -e "$CLOUDKIT_ASL" ];
  then
    cp -r "$CLOUDKIT_ASL" "$TMP_DIR"
  else
      syslog -s -l Warning "NotesDiagnostics Warning: "$CLOUDKIT_ASL" not found"
  fi
}

function collect_accountstool
{
  /usr/local/bin/accounts_tool listAccounts > "${TMP_DIR}/listAccounts.txt"
  /usr/local/bin/accounts_tool listAccounts -v > "${TMP_DIR}/listAccounts-v.txt"
}

function check_system_reqs
{
    SYSTEM=$(sw_vers -productVersion)
    found=0
    if grep -q '10.12' <<<$SYSTEM;
    then
        found=1
    fi

    if [ "$found" -eq "0" ]
    then
        syslog -s -l Error "NotesDiagnostics: This tool only runs on OS X El Capitan"
        exit
    fi
}

function compress_data_to_destination
{
    syslog -s -l Notice "NotesDiagnostics: Packing up data into $DESTINATION_DIR"
    tar -czf $DESTINATION_DIR/NotesDiagnostics.tar.gz -C "$TMP_DIR" .
}

function cleanup
{
    rm -rf $TMP_DIR
}

function collect_data
{
    collect_noteslogs
    collect_cloudkit
    collect_accountstool
}


check_system_reqs
TMP_DIR=`mktemp -d -t NotesDiagnostics`
DESTINATION_DIR=$1;

if [[ -z "$DESTINATION_DIR" ]]; then
    print_usage
fi

if [ ! -d "$DESTINATION_DIR" ]; then
	syslog -s -l Error "NotesDiagnostics: Error - Destination folder $DESTINATION_DIR does not exit!"
	exit 100
else
	syslog -s -l Notice "NotesDiagnostics: Collected data will be placed in: $DESTINATION_DIR"
fi

syslog -s -l Notice "NotesDiagnostics: Beginning data collection into $TMP_DIR"
collect_data
compress_data_to_destination
cleanup
exit 0



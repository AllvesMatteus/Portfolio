#!/bin/bash

#  safaridiagnose.sh
#  Feedback Assistant
#
#  Copyright (c) 2014 Apple, Inc. All rights reserved.

function print_usage
{
    echo "usage: collect-safari-data [dest_dir]"
    echo ""
    echo "required arguments:"
    echo "   dest_dir : Full path where collected data will be placed"
    exit 1
}

function collect_config
{
    CONFIG_PLIST="${HOME}/Library/Safari/Configurations.plist.signed"
    if [ -e "$CONFIG_PLIST" ];
    then
        cp "$CONFIG_PLIST" "$TMP_DIR"
    else
        syslog -s -l Warning "SafariDiagnose Warning: "$CONFIG_PLIST" not found"
    fi
}

function collect_extensions
{
	# Note: This requires an external utility for which we need the full path on system
	./ExportSafariExtensions > "$TMP_DIR"/SafariExtensions.plist
}

function collect_plugins
{
	USER_PLUGIN_DIR=""${HOME}/Library/Internet\ Plug-Ins/""
	SYSTEM_PLUGIN_DIR=""/Library/Internet\ Plug-Ins/""
	ls -lA "$USER_PLUGIN_DIR" > "$TMP_DIR"/SafariUserPlugins.txt
	ls -lA "$SYSTEM_PLUGIN_DIR" > "$TMP_DIR"/SafariSystemPlugins.txt
	find "$USER_PLUGIN_DIR" -iname Info.plist -print0 | xargs -0 plutil -convert xml1 -o /dev/stdout | grep 'CFBundleIdentifier\|CFBundleVersion\|CFBundleShortVersion' -A 1 >> "$TMP_DIR"/SafariUserPlugins.txt
	find "$SYSTEM_PLUGIN_DIR" -iname Info.plist -print0 | xargs -0 plutil -convert xml1 -o /dev/stdout | grep 'CFBundleIdentifier\|CFBundleVersion\|CFBundleShortVersion' -A 1 >> "$TMP_DIR"/SafariSystemPlugins.txt
}

function collect_session_history
{

    if [ "$OK_TO_COLLECT_URL" = "Yes" ]
    then
        LASTSESSION_PLIST=""${HOME}/Library/Safari/LastSession.plist""
        if [ -e "$LASTSESSION_PLIST" ];
        then
            plutil -convert xml1 "$LASTSESSION_PLIST" -o /dev/stdout | grep TabURL -A 1 > "$TMP_DIR"/SafariLastSessionURLs.txt
        else
            syslog -s -l Warning "SafariDiagnose Warning: "$LASTSESSION_PLIST" not found"
        fi
    fi
}

function check_system_reqs
{
    SYSTEM=$(sw_vers -productVersion)
    found=0
    if grep -q '10.10' <<<$SYSTEM;
    then
        found=1
    fi
    if grep -q '10.11' <<<$SYSTEM;
    then
        found=1
    fi

    if [ "$found" -eq "0" ]
    then
        syslog -s -l Error "SafariDiagnose: This tool only runs on OS X Yosemite"
        exit
    fi
}

function compress_data_to_destination
{
    syslog -s -l Notice "SafariDiagnose: Packing up data into $DESTINATION_DIR"
    tar -czf $DESTINATION_DIR/SafariDiagnostics.tar.gz -C "$TMP_DIR" .
}

function cleanup
{
    rm -rf $TMP_DIR
}

function collect_data
{
    collect_config
    collect_extensions
    collect_plugins
    collect_session_history
}


check_system_reqs
TMP_DIR=`mktemp -d -t SafariDiagnostics`
DESTINATION_DIR=$1;

if [[ -z "$DESTINATION_DIR" ]]; then
    print_usage
fi

if [ ! -d "$DESTINATION_DIR" ]; then
	syslog -s -l Error "SafariDiagnose: Error - Destination folder $DESTINATION_DIR does not exit!"
	exit 100
else
	syslog -s -l Notice "SafariDiagnose: Collected data will be placed in: $DESTINATION_DIR"
fi

OK_TO_COLLECT_URL=$(/usr/bin/osascript <<EOD
set iconpath to POSIX file "AppIcon.icns"
set answer to the button returned of ¬
(display dialog ¬
"Include the list of URLs recently open in Safari with your feedback? This could contain personal information." with title ¬
"Feedback Assistant" with icon iconpath ¬
default button ¬
"Yes" buttons {"Yes", "No"})
EOD)

syslog -s -l Notice "SafariDiagnose: Beginning data collection"
collect_data
compress_data_to_destination
cleanup
exit 0



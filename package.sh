#!/bin/bash

target="GameOfLife"
bundle="$target.mpk"

#
# Ok, so this could be a little more solid :)
#

version=`grep clientModule package.xml | head -1 | grep "version=" | sed 's/^.*version="//' | sed 's/".*$//'`

echo "Package version is $version"

echo "Creating archive $bundle for $target..."

if [ -f "$bundle" ]
then
    echo "Removing existing archive $bundle..."
    rm "$bundle"
fi

echo "Archiving with zip"

zip "$bundle" `find "$target" | grep -v svn` package.xml

echo "Complete."

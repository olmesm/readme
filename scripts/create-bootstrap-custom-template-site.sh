#! /usr/bin/env sh

DIRECTORY_TMP="tmp/custom-templates"
ARCHIVE_FILE="dist/custom-templates.zip"

echo ">> Making tmp directory"
mkdir -p $DIRECTORY_TMP

echo ">> Copying static site"
cp custom-templates/* $DIRECTORY_TMP

echo ">> Copying templates"
cp -r public/templates $DIRECTORY_TMP

echo ">> Zipping to $ARCHIVE_FILE"
zip $ARCHIVE_FILE $DIRECTORY_TMP
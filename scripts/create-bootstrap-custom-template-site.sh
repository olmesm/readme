#! /usr/bin/env sh

DIRECTORY_TMP="tmp/custom-templates"
ARCHIVE_FILE="dist/custom-templates.zip"

echo ">> Making tmp directory"
mkdir -p $DIRECTORY_TMP

echo ">> Copying static site files"
cp custom-templates/* $DIRECTORY_TMP
cp LICENSE $DIRECTORY_TMP
cp public/favicon.ico $DIRECTORY_TMP

echo ">> Copying templates"
cp -r public/templates $DIRECTORY_TMP

TMP_PATH=$(pwd)

echo ">> Zipping to $ARCHIVE_FILE"
cd $DIRECTORY_TMP
zip -rX $TMP_PATH/$ARCHIVE_FILE *
cd $TMP_PATH
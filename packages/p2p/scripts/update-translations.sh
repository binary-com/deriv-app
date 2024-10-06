#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
WHITE='\033[1;37m'
RESET='\033[0m'

if ! [ -x "$(command -v crowdin)" ]; then
    if [ -f /usr/local/bin/crowdin-cli.jar ]; then
        alias crowdin="java -jar /usr/local/bin/crowdin-cli.jar"
    else
        echo ${YELLOW}"crowdin-cli not found. Please follow the instructions here: https://support.crowdin.com/cli-tool-v2/#installation"${RESET}
        exit 1
    fi
fi

if [[ $(git config --get remote.origin.url) =~ deriv-com/deriv-app ]]; then
    echo ${RED}"  > ERROR: "${RESET}"remote 'origin' should be your fork."
    exit 1
fi

function message {
    echo ${GREEN}"  >"${RESET} $1
}

function confirm {
    read -p "$(echo "\n${WHITE}$1 ${RESET}(y/n)${YELLOW}") " -n 1 -r &&
    echo "${RESET}"
}

cd $(git rev-parse --show-toplevel) &&

message "Updating p2p translations branch" &&
git branch -D p2p_translations &&
git push origin --delete p2p_translations
git checkout -b p2p_translations &&
git pull upstream master &&

confirm "Update the source file (messages.json) and push to Crowdin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Updating p2p translations source file" &&
    cd $(git rev-parse --show-toplevel) && cd packages/p2p/scripts && node extract-translations.js &&
    message "Uploading source file to Crowdin"
    cd $(git rev-parse --show-toplevel) && cd packages/p2p && source ~/.bash_profile && crowdin upload sources
    message "Complete, new p2p translations have been uploaded to Crowdin"
fi &&

confirm "Download p2p translation files and update javascript texts?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    message "Downloading p2p translation files from Crowdin (*.json)" &&
    crowdin download
fi &&

confirm "Commit changes and push to origin?" &&
if [[ $REPLY =~ ^[Yy]$ ]]
then
    cd $(git rev-parse --show-toplevel) &&
    message "Committing"
    git commit -a -m "Update p2p translations" &&
    message "Pushing"
    git push -u origin p2p_translations
fi &&

echo ${GREEN}"\nSuccessfully Done."

#!/bin/sh

echo "launching turtle"

echo "check dependency"
#back end
mvn --version
java --version

#front end
npm --version

#launch turle
gnome-terminal --version

echo "launching turtle back end"

cd server
gnome-terminal -- bash -c "./launch.sh; exec bash"

cd -
echo "launching turtle front end"
cd client
gnome-terminal -- bash -c "./launch.sh; exec bash"


echo "turtle shutdown"

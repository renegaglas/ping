echo "launching back end"

mvn clean package
mvn quarkus:dev

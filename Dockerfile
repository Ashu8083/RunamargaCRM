FROM ubuntu:latest
LABEL authors="ashu"

ENTRYPOINT ["top", "-b"]
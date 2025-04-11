#!/bin/bash

# Check if Node.js is installed
AC_CHECK_PROG([NODE], [node], [yes], [no])

# Check if npm is installed
AC_CHECK_PROG([NPM], [npm], [yes], [no])

# Check if Docker is installed
AC_CHECK_PROG([DOCKER], [docker], [yes], [no])

# Check if Docker Compose is installed
AC_CHECK_PROG([DOCKER_COMPOSE], [docker-compose], [yes], [no])

# Check if SQLite3 is installed
AC_CHECK_LIB([sqlite3], [sqlite3_open], [AC_DEFINE([HAVE_SQLITE], [1], [SQLite support available])], [AC_MSG_ERROR([SQLite3 not found])])

# Check if Docker networks and volumes are created
AC_CHECK_PROG([NETWORK], [docker network ls | grep "private-transcendence-network"], [yes], [no])
AC_CHECK_PROG([VOLUME], [docker volume ls | grep "transcendence-volume"], [yes], [no])

# Generate Makefile
AC_CONFIG_FILES([Makefile])
AC_OUTPUT

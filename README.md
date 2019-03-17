# Taskpad App

## Introduction

This is a taskpad app that lets you to create tasks and track them during the course of your day.
So why is yet another taskpad app? This app lets you to add "tags" to you tasks and make
meaning out of the effort that you are spending on various activities. As the saying goes
"what gets measured is what gets improved!" this app can be your companion to watch your efforts.

## Hosted

This task is hosted @ https://taskpad.co.in

## Tech Stack

- Golang - backend language
- ReactJS - UI technology
- Postgres - DB to store tasks
- Google App Engine - cloud hosting for the app
- Auth0 - user authentication
- Google Charts - to create reports
- Go Gin - for REST framework in server

## Abilities

- Use your favorite auth provider to sign-in
- Create task and mark them to complete
- Add tags and effort to each task
- Easily create duplicate task to next day
- Easily move task to next day
- Add links to task and easily open them during your day
- Create reports by combining different tags
- View reports to see how and where your efforts are spent

## Architecture

This is a SPA with a Go BE. The API uses Postgres to store tasks and other entities.

## Steps to run

1. Clone the repo
2. Run the server - npm start
3. Run the client
   a. cd ui
   b. npm start

Please see the command in npm start of server.

- It requires https://github.com/codegangsta/gin [gin] to installed
- It requires fe environment variables:
  - Postgres DB details
  - Auth0 client ID

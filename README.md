# UT Coding Boot Camp Team Project II
<img src="https://github.com/kylecom2000/Project2/blob/master/public/images/grocherie-text.png?raw=true" width="500">

## Overview
Grochérie is a web app that allows multiple users to view, edit, and complete shopping lists shared across devices. It's geared towards roommates, families, offices, or any groups of people that shop together. 

Actions performed are updated in real-time without having to refresh the app. Once lists are created, they can only be accessed by users with whom they have been shared. A single list may have multiple users, and a single user may have multiple lists.

By hosting collaborative lists in a central digital location, Grocherie saves time and headaches by minimizing miscommunications and allows a single person to shop for everyone on their shared lists at once.

## [Deployed on Heroku](https://grocherie.herokuapp.com/)

### Main Contributers
* Kyle Bauer - Backend | Authentication
* Colin Grant - Backend | Web Sockets
* Clayton Bondy - Frontend | Design
* Brian Duong - Frontend | Handlebars

### Objectives
* Node and Express ☑️ 
* MySQL and ORM ☑️ 
* GET and POST routes ☑️ 
* Heroku deployment with Data ☑️ 
* One node package not introduced in class ☑️ 
* Polished frontend/UI ☑️ 
* MVC Paradigm ☑️ 
* Coding Standards ☑️ 
* .env API Keys (if necessary)

### Additional Technologies Used
* [Socket.io](https://socket.io/)
* [Semantic UI](https://semantic-ui.com/)
* [Passport](http://www.passportjs.org/)
* [Handlebars](https://handlebarsjs.com/)

### Workflow
  * Landing Page
    * Route to Signup
    * Route to Login
  * Signup
    * Email Address
    * Username
    * Password
    * Route to Login on Submit
  * Login
    * Email Address
    * Password
    * Passport Authenticated Route to Dashboard
  * Dashboard
     - Create lists and items
     - Delete lists and items
     - Share existing lists with other users
     - Live update of checklists
     - Checkout to archive checked items
     - Cancel to uncheck all items

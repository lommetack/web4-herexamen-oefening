# NotePad

## Description

This notes app is a web application that allows users to create notes and organize them into folders. The notes are automatically saved when a user pauses typing for a while or when the editor loses focus. There is a light/dark mode, which is kept in state memory and can be toggled by the user.

### Technical stack

- Frontend: React, React Router (Framework, no SSR mode)
- Backend: JSON-server

## Goal

Basically, the goal of this assignment is to make all the tests pass. You can change almost anything except the tests themselves.
The focus is on React Router and React. It is not necessary to make changes in the app/services folder.

Examen which data is needed for a specific page or component. Implement the loader with that information in mind. In the app/services folder, you can find everything you need to implement in your loaders and actions. There are typedocs provided for the service methods. You can use these typedocs to understand what a method does, what parameters it takes, and what it returns.

Often, you will need to make little changes in the components to make sure everything works as expected. We've implemented those changes to prevent errors or as a challenge.

## Tests

In the tests, the backend service is mocked. This means that the tests will run without the need for a backend server.
Check the package.json scripts for different options on how to run the tests.

# Boxes Configurator

## Description

This app is a web application that allows users to create boxes. There is a list of generated boxes, users can add new boxes, and update existing ones.

### Technical stack

- Frontend: React, React Router (Framework, no SSR mode)
- Backend: JSON-server

## Goal

Basically, the goal of this assignment is to make all the tests pass. You can change almost anything except the tests themselves.
The focus is on React and React Router. It is not necessary to make changes in the app/services folder.

Examine which data is needed for a specific page or component. Implement the loader with that information in mind. In the app/services folder, you can find everything you need to implement in your loaders and actions. There are typedocs provided for the service methods. You can use these typedocs to understand what a method does, what parameters it takes, and what it returns.

Often, you will need to make little changes in the components to make sure everything works as expected. We've implemented those changes to prevent errors or as a challenge.

## Hints

- Check the `app/utils/index.js` file, the default box data is defined there.
- We use the same form for adding and editing boxes. The form is defined in the `app/components/BoxForm/BoxForm.jsx` file.
- A button accepts a `formaction` attribute that can be used to submit a form to a specific action. (Since this is a React app, you can use the `formAction` prop on the button element.)

## Tests

In the tests, the backend service is mocked. This means that the tests will run without the need for a backend server.
Check the package.json scripts for different options on how to run the tests.

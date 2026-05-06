# Example of routes in our qa application

What are the different routes that we want the USER to be able to display?
routes = views / pages / layouts / ...

- one view for the home page when no user is logged in
    Route: /

- one view for the main page when a user is logged in
    Route: /
    Route: /home

- one view with the list of all answers for a giver question (**)
    Route: /answers/:questionId
    (may vote, delete)

- one view (or a sub-view) for inserting a new answer (**)
    Route: /answers/:questionID/new for adding
    Roure: /answers/:questionId/:answerId/edit for editing


- one view with the list of all questions
    ~~Route: /questions~~
    Route: /home

    clicking on a question -> navigate to /answers

- one view (or a sub-view) for inserting a new question
    Route: /questions/new

- one view with some user profile information
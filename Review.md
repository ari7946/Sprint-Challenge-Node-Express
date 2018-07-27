# Review Questions

## What is Node.js?
A javascript run time environment based on chrome's v8 engine used to perform javascript without the need of a web browser.
## What is Express?
A framework build on top of node used to facilitate the development of server applications with node.
## Mention two parts of Express that you learned about this week.
Router and Api's
## What is Middleware?
They're functions used to manipulate the request-response cycle of an application
## What is a Resource?
Information that can be accessed via specific routes in a url as endpoints.
## What can the API return to help clients know if a request was successful?
A status code message between 200 - 299
## How can we partition our application into sub-applications?
Using more than one instance of Express's Router. We can bring them together with middleware.
## What is express.json() and why do we need it?
It parses javascript code to JSON format. It's needed because it's convention to send data that way. There are also security measures to be considered with data that is not JSON format.
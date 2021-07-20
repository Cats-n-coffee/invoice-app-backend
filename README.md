# Invoice Backend

This is the backend for the [Invoice App](https://github.com/Cats-n-coffee/invoice-app-frontend).
<br>
It uses Express and MongoDb.<br>
App.js is the entry file: it establishes connection with the database and set up the web server.

## Routes
There are two different files for the routes: one for the authentication routes, another one for the invoices routes.
Each route gets its controller, which are also split in two files for the auth and invoices.

## Controllers
They hold most of the logic for each route operation, as it relates to the server portion. Any other piece of code that does not directly have an action for the request/response can be found in the helpers (creating tokens, encrypting password, ...). <br>
Authentication controllers for login/signup will each generate a pair of tokens and set them in the cookies. The refresh token is stored in the database for later comparison. Both login/signup controllers also send user email, username and id with the response.<br>
Invoice controllers handle CRUD app logic depending on the route. The `postNewInvoice` controller generates an id upon insertion to the database.

## Middleware
The only middleware present in this project handles the authentication verification for each protected route (all invoice routes).<br>
It retrieves the cookies and stores them in an object to identify the auth token and the refresh token. It will then verify the auth token. If it is a success, it will authentify, otherwise it will verify the refresh token. If the refresh token verifies it will give a new auth token, otherwise it will return an error message (with 403 status code).

## Database
MongoDb is used for this project. To try schema validation (for the first time), a schema for user was created with a validation level of `strict`, and another for invoices was created with validation level of `moderate` (considering that certain fields are not required for the invoice to be stored).
MongoDb native library was used and all operations are split between authentication and invoice.<br>
To handle a user logining in with the signup form, we check for the email in the database, before inserting a new field. This also prevent email duplicate. If the email is already in the database, an error is return, prompting the user to use the appropriate authentication form.<br>
In all invoices operations except 'delete', the user email is used to either retrieve the data or store it (the invoice Id is also used).
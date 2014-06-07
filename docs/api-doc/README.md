# API documentation

This is the API documentation of nodejs-account-boilerplate. Please open an issue if something is incorrect or out-of-date.

## Format

The API calls either requests or responds are handled in JSON format. Data passed to the server must be formatted as JSON. Response will be formatted as JSON.

## Authentication

Some parts of the API require authentication. This is done with a valid authentication token send as a request header field named `auth_token`. The `auth_token` is a user property. You can acquire the property by calling the (unprotected) login-method.

Currently supported authentication methods:
- API Token

## Interacting with the API

The API uses regular <code>GET</code>, <code>POST</code>, <code>PUT</code> and <code>DELETE</code> commands. Examples are available in the tests.

[Making requests and error codes](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/basics/requests_and_errors.md)

## Endpoints

The following list shows all API endpoints, linked to further information.

### Users - General Purposes

- [**<code>GET</code>  /api/user/info**](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/endpoints/user/GET_user_info.md)
- [**<code>POST</code>  /api/user/login**](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/endpoints/user/POST_user_login.md)
- [**<code>POST</code>  /api/user/signup**](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/endpoints/user/POST_user_signup.md)
- [**<code>POST</code>  /api/user/delete**](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/endpoints/user/POST_user_delete.md)

## Objects

- [**User**](https://github.com/fs-opensource/nodejs-account-boilerplate/blob/develop/docs/api-doc/objects/user.md)

## Contribution

While designing the API, we looked how other well designed APIs are build and structured.

- [Kippt](https://github.com/kippt/api-documentation) - This API documentation bases on Kippt's API documentation structure.

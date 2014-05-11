# Resources

    POST /user/login

## Description

Authenticate with given credentials.

## No authentication required


## Parameters

- None

## Errors

- `400` - wrong credentials

## Example
**Request**

    POST /user/login
    
    {
        "email" : "testuser@test.com",
        "password" : "yoursecretpassword"
    }

**Return**

    200

    {
        "_id": "52d286c6823d830afc443b21",
        "email": "testuser@test.com",
        "role": "User",
        ...
    }

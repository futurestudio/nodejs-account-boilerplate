# Resources

    POST /user/signup

## Description

Registers a new user with given credentials.

## No authentication required


## Parameters

- None

## Errors

- `400` - wrong credentials

## Example
**Request**

    POST /user/signup
    
    {
        "email" : "testuser@test.com",
		"phone" : "123-456-789",
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

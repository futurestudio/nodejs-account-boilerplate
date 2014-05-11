# Resources

    POST /user/delete

## Description

Deletes a user with given email address.

## No authentication required


## Parameters

- None

## Errors

- `400` - wrong credentials

## Example
**Request**

    POST /user/delete
    
    {
        "email" : "testuser@test.com"
    }

**Return**

    200 Account deleted

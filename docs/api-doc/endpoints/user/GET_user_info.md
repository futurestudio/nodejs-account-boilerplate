# Resources

    GET /user/info

## Description

Get information for authenticated user (yourself).

## Requires authentication

You need to authenticate with the API to get your information.

## Parameters

- None

## Errors

- `401` - Not authorized

## Example
**Request**

    GET /user/info

**Return**

200 

```
{
    "_id": "528a44cf5d1f317415000001",
    "auth_token": "wLTd4QXOjHKudzk87j4roXuGrcbQyXP7",
    "auth_token_issued": "2013-11-18T16:48:15.579Z",
    "email": "norman@futurestud.io",
    "phone": "52052052011"
}
```
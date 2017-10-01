# Example Usages
## POST request: GUI debuggers (i.e. Postman)

You would be submitting json objects in the body of the text. You also need to indicate in the headers that the Content-type is of "application/json".
POST - http://localhost:3000/api/status
```
{
  "host": "nyc010.domain.com",
  "services": [
    {
      "name": "brickyard api",
      "is_online": 1,
      "update_at": "2014-11-14T16:36:31Z",
      "mesg": "System Online: Average response 200ms"
    },
    {
      "name": "ords",
      "is_online": 1,
      "update_at": "2014-11-14T16:36:31Z",
      "mesg": "Oracle REST is open for business"
    }
  ]
}
```

## POST request: Commandline debuggers (i.e. curl)

```bash

curl -H "Content-Type: application/json" -d '{"host": "nyc010.domain.com","services": [{"name": "brickyard api","is_online": 1,"update_at": "2014-11-14T16:36:31Z","mesg": "System Online: Average response 200ms"},{"name": "ords","is_online": 1,"update_at": "2014-11-14T16:36:31Z","mesg":"Oracle REST is open for business"}]}' http://localhost:3000/api/status

```

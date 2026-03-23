### GET `/api/films`

**Description**  
Retrieves the list of all the available films in the database.

**Sample Request**  
`GET /api/films`

**Sample Response**
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": true,
    "watchDate": "2026-03-10",
    "rating": 5,
    "userID": 1
  },
  {
    "id": 2,
    "title": "Star Wars",
    "favorite": false,
    "watchDate": null,
    "rating": null,
    "userID": 1
  }
]
```
**Error Response**
`500 Internal Server Error`

<!-------------------------->
GET `/api/films?filter=<filter_type>`

**Description**: Retrieves a list of films that fulfill a specific filter. Allowed  filters are *favorite, bestRated, last month, and unseen*.

**Sample Request**  
`GET /api/films?filter=<filter_type>`

**Sample Response**
```json
[
  {
    "id": 1,
    "title": "Pulp Fiction",
    "favorite": true,
    "watchDate": "2026-03-10",
    "rating": 5,
    "userID": 1
  }
]
```

**Error Responses**
`400 Bad Request` (Invalid Filter Parameter)
`500 Internal Server Error`

<!---------------------------->
### GET `/api/films/:id

**Description**: Retrieves a specific film by its unique ID.

**Sample Request**: `GET /api/fims/1`

**Sample Response**:
```json
{
  "id": 1,
  "title": "Pulp Fiction",
  "favorite": true,
  "watchDate": "2026-03-10",
  "rating": 5,
  "userID": 1
}
```

**Error Responses**:
`404 Not Found` (Film with the specified ID does not exist)

`500 Internal Server Error`
<!---------------------------->

### POST `/api/film`

**Description**: Creates a new film. The `id` is automatically assigned by the database, and the `userID`, is assigned to 1 by default.

**Sample Request**:
```json
{
  "title": "Matrix",
  "favorite": false,
  "watchDate": "2026-03-11",
  "rating": 4
}
```

**Sample Response**: (Empty body or the newly created ID)
```json
{
    "id": 3
}
```

**Error Responses**:
`422 Unprocessable Entity` (Validation error: missing titlee, invalid date format, or rating not between 1 and 5)
`500 Internal Server Error`
<!---------------------------->

### PUT `/api/films/:id`

**Description**: Fully updates an existing film with the provided properties.

**Sample Request**:
```json
{
  "title": "Matrix Reloaded",
  "favorite": true,
  "watchDate": "2026-03-12",
  "rating": 3,
  "userID": 1
}
```

**Sample Response**: (Empty body, status `200 OK`)

**Error Responses**:
`404 Not Found`
`422 Unprocessable Entity`
`500 Internal Server Error`
<!---------------------------->

### PUT `/api/films/:id/rating`

**Description**: Updates the rating of a certain film given its ID.

**Sample Request**:
```json
{
    "rating": 5
}
```

**Sample Response**: (Empty body, status `200 OK`)

**Error Responses**:
`404 Not Found`
`422 Unprocessable Entity` (invalid rating value)
<!---------------------------->

### PUT `/api/films/:id/favorite`

**Description**: Mark an existing film as favorite or unfavorite.

**Sample Request**:
```json
{
    "isFavorite": true
}
```

**Sample Response**: (Empty bodye, status `200 OK`)

**Error responses**
`404 Not Found`
`422 Unprocessable Entity` (invalid boolean value)
<!---------------------------->

### DELETE `/api/films/:id`

**Description**: Delete an existing film given its id.

**Sample Request**: `DELETE /api/films/1`

**Sample Response**: (Empty body, status `200 OK` or `204 No Content`)

**Error Responses**:
`500 Internal Server Error`
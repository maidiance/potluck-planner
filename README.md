# Potluck API

## Users
### Register
**Registers a new user** <br/>
`[POST] /api/users/register`
Limits: <br/>
* name: 200 characters<br />
> Expected body format:
```
  {
    username: 'bob',
    password: 'foobar'
  }
```
> Expected return format:
```
  {
    user_id: 1,
    username: 'bob',
    password: '2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG'
  }
```

### Login
**Login an existing user, returns with a login token** <br/>
`[POST] /api/users/login`
> Expected body format:
```
  {
    username: 'bob',
    password: 'foobar'
  }
```
> Expected return format:
```
  {
    message: 'welcome, bob',
    token: 'eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8'
  }
```

## Potluck
### [GET]
**Get potlucks in an array or by id** <br/>
`[GET] /api/potluck`
> Expected return format:
```
  [
    {
      pid: 1,
      name: 'bobs potluck',
      date: 'feb 2',
      time: '2pm',
      location: '2nd cherry st'
      user_id: 1
    },
    {
      ...
    },
    ...
  ]
```
`[GET] /api/potluck/:id`
> Expected return format:
```
  {
    pid: 1,
    name: 'bobs potluck',
    date: 'feb 2',
    time: '2pm',
    location: '2nd cherry st'
    user_id: 1
  }
```

### [POST]
**Create a new potluck** <br/>
Limits: <br/>
* name: 128 characters<br />
* date: 15 characters<br />
* time: 15 characters<br />
* date: 15 characters<br />
* location: 128 characters<br />
`[POST] /api/potluck`
> Expected body format:
```
  {
    name: 'bobs potluck',
    date: 'feb 2',
    time: '2pm',
    location: '2nd cherry st',
    user_id: 1
   }
```
> Expected return format:
```
  {
    pid: 1,
    name: 'bobs potluck',
    date: 'feb 2',
    time: '2pm',
    location: '2nd cherry st',
    user_id: 1
  }
```

### [PUT]
**Modify an existing potluck** <br/>
`[PUT] /api/potluck/:id`
> Expected body format:
```
  {
    name: 'bob's birthday'
  }
```
> Expected return format:
```
  {
    pid: 1,
    name: 'bobs birthday',
    date: 'feb 2',
    time: '2pm',
    location: '2nd cherry st',
    user_id: 1
  }
```

### [DELETE]
**Delete an existing potluck** <br/>
`[DELETE] /api/potluck/:id`
> Expected return format:
```
  {
    pid: 1,
    name: 'bobs birthday',
    date: 'feb 2',
    time: '2pm',
    location: '2nd cherry st',
    user_id: 1
  }
```

## Attend
### [GET]
**Get users attending a potluck by id** <br/>
`[GET] /api/potluck/:id/attend`
> Expected return format:
```
  [
    {
      user_id: 1,
      username: 'bob'
    },
    {
      ...
    },
    ...
  ]
```

### [POST]
**Add a user to a potluck** <br/>
`[POST] /api/potluck/:id/attend`
> Expected body format:
```
  {
    user_id: 1,
    username: 'bob'
  }
```
> Expected return format:
```
  [
    {
      user_id: 1,
      username: 'bob'
    },
    {
      ...
    },
    ...
  ]
```

### [DELETE]
**Remove a user from a potluck** <br/>
`[DELETE] /api/potluck/:id/attend/:user_id`
> Expected return format:
```
  {
    user_id: 1,
    username: 'bob'
  }
```

## Items
### [GET]
**Get items for a potluck id** <br/>
`[GET] /api/potluck/:id/items`
> Expected return format:
```
  [
    {
      item_id: 1,
      name: 'chips',
      responsible: null
    },
    {
      ...
    },
    ...
  ]
```

### [POST]
**Create an item for a potluck id** <br/>
Limits: <br/>
* name: 128 characters<br />
`[POST] /api/potluck/:id/items`
> Expected body format:
```
  {
    name: 'chips'
  }
```
> Expected return format:
```
  {
    item_id: 1,
    name: 'chips'
  }
```

### [PUT]
**Update an item for a potluck id and item id** <br/>
`[PUT] /api/potluck/:id/items/:item_id`
> Expected body format:
```
  {
    name: 'foobar',
    responsible: 1
  }
```
> Expected return format:
```
  {
    item_id: 1,
    name: 'foobar',
    responsible: 1
  }
```

### [DELETE]
**Delete an item for a potluck id and item id** <br/>
`/api/potluck/:id/items/:item_id`
> Expected return format:
```
  {
    item_id: 1,
    name: 'chips',
    responsible: null
  }
```

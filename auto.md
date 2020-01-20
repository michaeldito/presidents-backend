+-------------------------------+
| Backend Automation Log Phases |
+-------------------------------+

> Enter Service Phase (depth = 0):
  - Serivice has a name
  - Service has an operation
      - Operation has a path
      - Operation has a method type
      - Operation performed by a controller
  >> Enter Controller Phase (depth = 1):
    - Controller could have context params
    - Controller could have context body
    >>> Enter Work Phase (depth = 2):
      - Work has a purpose
      >>>> Work could have More Work Phases (recursive, depth + 1)  
      <<<< More Work Phases finished
      - Work has a result
    <<< Work Phase finished
    - Controller Phase has a result
  << Operation Phase finished
< Service Phase finished

{
  service: {
    name,
    operation: {
      path,
      methodType,
      controller: {
        params,
        body,
        work: [{
          fn?: {
            params
          },
          purpose,
          work?: [{
            fn?: {
              params
            },
            purpose,
            work?: [{
              fn?: {
                params
              },
              purpose,
              result
            }],
            result
          }],
          result
        }],
        result
      }
    }
  }
}



ApiLog - cards/
`[koa@GET('cards/')]`
`[koa@GET('cards/') found # docs]`

on enter => route url (str)
work => what are we doing? (str)

ApiLog - user/register
`[koa@GET('cards/')]`
`[koa@GET('cards/') found # docs]`

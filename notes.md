# backend notes
- use assert.reject to test async functions that throw Errors
- use assert.throws to test sync function that throws Errors

# mongo
- need to use _id.toString for comparison. mongo uses it's own
  obj data structure so comparing ids is weird
- 

# front end notes
- redux example async to chain actions
- redux-undo includeAction excludeAction makes actions undoable
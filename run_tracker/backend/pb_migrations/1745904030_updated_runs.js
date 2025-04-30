/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2805406895")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = userId",
    "updateRule": "@request.auth.id = userId",
    "viewRule": "@request.auth.id = userId"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2805406895")

  // update collection data
  unmarshal({
    "deleteRule": "@request.auth.id = id",
    "updateRule": "@request.auth.id = id",
    "viewRule": "@request.auth.id = id"
  }, collection)

  return app.save(collection)
})

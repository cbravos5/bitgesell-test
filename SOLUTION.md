# Solution

## Backend

1. File access: moved the logic to read and write data from the file to a [file access utility](./backend/src/data/fileAccess.js), also making the read and write operations async.
2. Separation of concerns: the logic to manipulate the items and stats was moved to service files, so the route definition and the service itself have separate responsabilities.
3. Validation: to validate data coming from requests, I used zod with zod-express-middleware, which gives powerful ways of creating custom validation of objects.
4. Error handling: the error middleware was not being used. so I took the opportunity to refactor the code and make it simpler. Now the know errors are defined with codes in [Error Codes](./backend/src/middleware/errors.js) and a catch all throws returns an internal server error without exposing the error to the client.
5. Stats optmization: to optimize the stats generation, I created a simple in memory [cache utility](./backend/src/cache/index.js). The stats cache key is set for the first time requesting the data and the if already set the recalculation is not needed. To invalidate the cache I went for a more elegant approach using events. I created an event bus and subscribed a 'new item' event to the bus. Whenever a new item is created, this event is emited and the cache is invalidated, so the stats can be recalculated.
6. Get Items pagination: the route to get the items list was not paginated by default, so I added pagination.
7. Unit tests: added multiple unit tests for the get items route, testing happy scenarios as well as error handling.

## Frontend

1. Styles: added simple styles to both listing and details pages, as well as skeletons for loading state.
2. Memory leak: used simple flag to control mounted and unmounted state changes, preventing memory leak.
3. Search bar and pagination: added a search bar and an infinite scroll to the items listing page, the listing also uses react-window for virtualization and better performance.
4. Http client: moved requests to a [http client utility](./frontend/src/services/httpClient.js) so the base URL and request specific converns are handled inside it and not spread through the code.
5. Unit tests: added unit tests for both pages, testing user interation for most of the scenarios.
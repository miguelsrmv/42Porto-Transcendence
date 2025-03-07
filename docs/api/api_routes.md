# Endpoints
## Base
When making requests to the API through the Docker container, the base API endpoint is
```http://backend:3000/api``` 'backend' being the name of the container running the API and '3000' being the chosen port for communication with it.   
If running the app locally (e.g. ```npx tsx app.ts```), the endpoint is ```http://localhost:3000/```

## Users
- To get all users in the database, the endpoint is ```http://backend:3000/api/users```
- To get data on a specific user by ID, the endpoint is ```http://backend:3000/api/users/id```
**Note**: don't forget to replace the base api endpoint if you are running it locally.
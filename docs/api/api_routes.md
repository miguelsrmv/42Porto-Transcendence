# Endpoints
## Base
When making requests to the API through the Docker container, the base API endpoint is
```http://backend:3000/api``` 'backend' being the name of the container running the API and '3000' being the chosen port for communication with it.   
If running the app locally (e.g. ```npx tsx app.ts```), the endpoint is ```http://localhost:3000/```

## Users
- To get all users in the database (GET), the endpoint is ```http://backend:3000/api/users```
- To get data on a specific user by ID (GET), the endpoint is ```http://backend:3000/api/users/id```
- To create a new user (POST), the endpoint is ```http://backend:3000/api/users/create``` and the schema for the JSON data is 
```
{
	"name": "new_user_name",
	"email": "new_user@email.com",
	"password": "password"
} 
```
- To update user data (PUT), the endpoint is ```http://backend:3000/api/users/id``` and the schema for the JSON data is 
```
{
	"data": {
		"name": "new_user_name", // optional
		"email": "new_user@email.com",  // optional
	}
} 
```

**Note**: don't forget to replace the base api endpoint if you are running it locally.
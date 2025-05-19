# Frontend
- When username is updated, it is not displayed correctly on header (have to logout and in again) //NOTE: Done ?
- When submitting user update form, sometimes response is NGINX not allowed to https://www.padaria.pt/# // NOTE: Done? Unsure if bug was introduzed
- When submitting user update form, sometimes submit button does not work (when logged out and in after changing username) // NOTE: Done?
- Check if form is empty before requesting oldPassword on user update // NOTE: Done?
- Hide password as it is being inserted in settings form // NOTE: Done?
- Lead user to login again after JWT cookie expires?

# Backend
- Make responses more uniform
- Protect all routes in the end (except login/sign up related)
- Discuss refresh JWT token

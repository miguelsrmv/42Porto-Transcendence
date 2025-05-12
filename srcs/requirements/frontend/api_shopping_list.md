| Method   | Route                      |   URL parameters    |                     Body                     | Description                              |
| -------- | -------------------------- | :-----------------: | :------------------------------------------: | ---------------------------------------- |
| `PUT`    | `/users/defaultAvatar`     |                     |                                              | Default avatar image path                |
| `PUT`    | `/users/customAvatar`      |                     | Picture data                                 | Custom avatar image                      |
| `GET`    | `/users/getAvatarPath`     |                     |                                              | Get user's avatar image path             |
| `POST`   | `/users/disableTwoFA`      |                     |                                              | Disable the users's two FA               |
| `POST`   | `/users/enableTwoFA`       |                     | QR Code                                      | Enable the users' two FA                 |
| `GET`    | `/users/checkTwoFAStatus`  |                     |                                              | Get user's two FA status                 |

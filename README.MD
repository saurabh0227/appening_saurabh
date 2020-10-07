## Getting Started

### Installation

1. install the dependencies using `npm install` or `npm i`

2. Rename the file `.env.example` to `.env`, then you need to configure the file `config.js` located in `src/config`

3. Start the app using `npm start`

### Directory Structure

```
├── src
│   ├── api
│   │   ├── auth
│   │   │   ├── controller.js
|   |   ├── documents
│   │   │   ├── controller.js
│   │   │   ├── model.js
|   |   ├── histories
│   │   │   ├── controller.js
│   │   │   ├── model.js
│   │   │   └── route.js
│   │   ├── users
│   │   │   ├── controller.js
│   │   │   ├── model.js
│   │   │   └── route.js
│   │   └── index.js
│   ├── config
│   │   ├── config.js
│   │   └── mongo.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── uploads
└── encryptedFiles
```

### Available routes

| Method | Resource                                                                           | Description                                                                                                                                                  |
| :----- | :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST` | `/users/signup`                                                                    | Create a new user in the DB. You need to specify in the body the following attributes: role, username & password.                                            |
| `POST` | `/users/login`                                                                     | Sign in with the username & password. If it's successful, then generates a token                                                                             |
| `POST` | `/documents/upload`                                                                | Send file in formdata to encrypt it                                                                                                                          | DB | Only accessible by admin | You need to specify the token in the header with the following format: `authorization: your-token` | DB. |
| `GET`  | `/documents/getFileList`                                                           | It returns the list of encrypted files uploaded by admin. You need to specify the token in the header with the following format: `authorization: your-token` | DB |
| `GET`  | `/documents/download/:filename?ip=""`                                              | It returns the file that you are requested. You need to specify the token in the header with the following format: `authorization: your-token`               | DB |
| `GET`  | `/histories/getHistories?city=""&state=""&country=""&lng=""&lng=""&maxDistance=""` | It returns the histories. You need to specify the token in the header with the following format: `authorization: your-token`                                 | DB |

# Superior Internet

## Getting Started:

*Windows users:* Please run `git config --global core.autocrlf true`

Then, 
```
git clone https://github.com/tetchel/superior-internet.git
cd superior-internet
npm install
npm start
```

Navigate to `localhost:3000` and there you go!

## API reference
GET `/u` - Returns JSON array of all User data objects

GET `/u/:id` - Returns JSON of User data object for the requested user

POST `/visited/:visitedId` - Indicate that the user issuing this request (determined by 'id' cookie) visited the user with id `visitedId`



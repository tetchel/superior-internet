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
GET `/`/ - Registers the user if they're new, and then forward them to their page

GET `/g/` - Shows the overall network graph

GET `/u` - Returns JSON array of all User data objects

GET `/u/:id` - Returns user page for user with the given ID. Has the visited data available but doesn't do anything with it.

POST `/v/:visitedId` - Indicate that the user issuing this request (determined by 'id' cookie) visited the user with id `visitedId`. Returns 201 if it's a new visit, and 200 if the visit has already occurred (and therefore the request had no effect).



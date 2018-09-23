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

GET `/g/` - Shows the overall network graph - Right now this just returns the JSON that *would* be used to construct the graph.

GET `/u/:id` - Returns user page for user with the given ID. If the user logged in is not the same as the user page, a visit is recorded.



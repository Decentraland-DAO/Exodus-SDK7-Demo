# SDK 7 Farming + Apothecary Demo

This repository contains a simplified full-stack demo of how one can integrate gathering and crafting into a Decentraland game.  The demo is based on the player planting seeds, waiting for the plants to grow, picking the plants, crushing the produce into powders, and mixing the powder into a potion.  

This basic process will demonstrate how to use MongoDB to keep track of player records, use an Express api to make basic game interactions, and use SDK7 to visualize the front end.  The front-end demonstrates api request handling, 3D promiximity triggers, basic by-code-animation, and dynamic on-click elements.  

## Starting the Demo
To start the server
```shell
cd Server
npm install
npm run dev
```

To start the front-end
```shell
cd SDK
npm install
npm run start
```

## Using this example
### MongoDB
You can set the MongoDB uri to be that of any mongoDB.  The server will populate the database `GameDB` and store user profiles in the `UserProfiles` collection.  If you do not have a MongoDB uri, you can leave this out and the demo will run on a local memory based instance of the db.  

### api routes
The express server will be started on port 3000.  As a default, the front-end `apiManager.ts` file contains a class which will make api calls to `http://localhost:3000` to match this demo server.  In practice, this should be changed to be the base url of your deployed api.  

### ui elements
The `ui.tsx` file contains all the ui elements, as well as a basic `UIState` object which is used to manage the state of the ui display.  We have prepared a few example methods for updating the displayed state as well as a method for displaying a notification to the player.   

### interactive elements
The `farmingPlot.ts` file contains the logic for creating and updating the 3D farming plots.  The `clickHandler` method contains a few different api calls to make player actions.  There are some other methods purposed towards updating and animating the plot included.  


## Thank you

This demo was sponsered by a grant from the Decentraland DAO.  To see the grant proposal, [read here](https://decentraland.org/governance/proposal/?id=127d49ed-e592-49f6-8cdc-c626a03175a2)
# CS3219-AY22-23-S1-G13

# Introduction 
This project is an adaptation of the project PeerPrep that has been completed in the previous semesters of CS3219. This project provides a collaborative technical interview training platform, where one can receive a coding question, and collaborate with someone to answer the question. 


# Running Project on Deployed Service

The project is currently deployed [here](https://frontend-66acladbaq-uc.a.run.app). All APIs are also deployed, and able to be accessed through the frontend from the link. 

We have also provided the links for each service for users to test the backend APIs

| Service               | Link                                                  |
| -----------           | -----------                                           |
| user-service          | https://user-service-e2rvjs4unq-uc.a.run.app          |
| collaboration-service | https://question-service-sg7kdn2zna-uc.a.run.app      |
| history-service       | https://history-service-e4js2cqizq-uc.a.run.app/      |
| matching-service      | https://matching-service-au7tawfmmq-uc.a.run.app/     |
| question-service      | https://question-service-sg7kdn2zna-uc.a.run.app/     |

# Running Project Locally

## Prerequisites before starting
Our current repository is currently deployed, and the URLs in the frontend is configured to call the APIs that are deployed. 
To run the project locally, change all URLs to `localhost`, and change the port number accordingly (provided below)

We also assume that `npm` is available on your local device. If `npm` is not available, click [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) 

## User Service
Ensure that frontend directs to `localhost:8000` for user-service APIs. 

1. Change directory to user-service by running `cd user-service`
2. Ensure the dependencies are downloaded locally `npm install` 
3. Start the user-service by running `npm run start` 

## Collaboration Service
Change the url for io connection to `localhost:3000` to connect to frontend locally

1. Change directory to user-service by running `cd collaboration-service`
2. Ensure the dependencies are downloaded locally `npm install` 
3. Start the user-service by running `npm run start` 

## History Service
Ensure that frontend directs to `localhost:8005` for history-service APIs. 

1. Change directory to user-service by running `cd history-service`
2. Ensure the dependencies are downloaded locally `npm install` 
3. Start the user-service by running `npm run start` 

## Matching Service
Change the url for io connection to `localhost:3000` to connect to frontend locally
1. Change directory to user-service by running `cd matching-service`
2. Ensure the dependencies are downloaded locally `npm install` 
3. Start the user-service by running `npm run start` 

## Question Service 
Ensure that frontend directs to `localhost:8002` for question-service APIs. 

1. Change directory to user-service by running `cd question-service`
2. Ensure the dependencies are downloaded locally `npm install` 
3. Start the user-service by running `npm run start` 

## Frontend Service
Ensure that the URLs in frontend calls `localhost` instead of the deployed URL. 
Change matching service to `localhost:8001` in frontend directory
Change collaboration service `localhost:8003` in frontend directory

Frontend runs locally on `localhost:3000`
1. Change directory to frontend by running `cd frontend` 
2. Ensure dependencies are downloaded locally `npm install --legacy-peer-deps`
3. Start frontend by running `npm run start`
4. The default browser will open when the application starts running

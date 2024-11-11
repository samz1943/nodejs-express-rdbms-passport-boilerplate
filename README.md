# RESTful API Node Server Boilerplate Typescript Version
A boilerplate/starter project for quickly building Typescript RESTful APIs using Node.js, Express and Mongo.


## Features

- Express
- Mongo
- Helmet
- Bcrypt
- Joi
- Passport
- Dontenv
- Rate-Limit
- Logger
- Nodemailer
- Jest

## Installation

- Install all the node packages listed in the package.json  
  `npm install`
- Replace **.env.example** to **.env** and complete MySQL database and redis server connection details
- Prepare database (create tables and populate)

## Initialize  database
- Create seeding for data  
  `npm run seed:run`

## Run the node server
### Development
- Run node server  
  `npm run dev`

### Unit Testing
- Replace **.env.example** to **.env.test**
- Run test script  
  `npm test`

### Production
- Pack and minimize source codes  
  `npm start`

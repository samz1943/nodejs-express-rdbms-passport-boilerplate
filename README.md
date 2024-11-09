# RESTful API Node Server Boilerplate Typescript Version
A boilerplate/starter project for quickly building Typescript RESTful APIs using Node.js, Express and MySQL.


## Features

- Express
- MySQL
- TypeORM
- Helmet
- Bcrypt
- Joi
- Passport
- Dontenv
- Rate-Limit
- Logger
- Nodemailer
- Mocha

## Installation

- Install all the node packages listed in the package.json  
  `npm install`
- Replace **.env.example** to **.env** and complete MySQL database and redis server connection details
- Prepare database (create tables and populate)

## Initialize  database
- Create database and run migration
- Create seeding for data  
  `npm run db:refresh`

## Run the node server
### Development
- Run node server  
  `npm run dev`

### Production
- Pack and minimize source codes  
  `npm start`

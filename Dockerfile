# Step 1: Use the official Node.js image as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install --production

# Step 5: Copy the rest of your application code
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE ${APP_PORT}

# Step 7: Define the command to start your application
CMD ["npm", "start"]

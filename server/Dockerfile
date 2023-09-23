# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Add AWS certificate for connecting to RDS instance
ADD https://truststore.pki.rds.amazonaws.com/us-west-2/us-west-2-bundle.pem ./us-west-2-bundle.pem

# Expose a port if your application listens on a specific port
EXPOSE 4000

# Define the command to run your application
CMD ["npm", "build"]
CMD ["npm", "start"]


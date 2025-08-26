# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json and install dependencies
# This is a key step to ensure the build environment is set up
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the environment variable for the API URL
ENV NEXT_PUBLIC_API_URL=http://backend:8000

# Run the build command to create the .next directory
# This step is critical for production builds
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the production server
# This command relies on the .next directory created by the build command
CMD ["npm", "start"]
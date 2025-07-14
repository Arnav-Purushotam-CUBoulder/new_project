FROM node:alpine As development

WORKDIR /usr/src/app

# Copy package.json and yarn.lock for yarn
COPY package.json ./ 
COPY yarn.lock ./
#here the second argument is the file/directory inside the docker container, and the first argument is the file in your pc 
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Install Yarn globally
RUN npm install -g yarn --force

# Install dependencies with Yarn
RUN yarn install

# Copy the rest of the application files
#COPY . .
#for productionizing the docker image, since we do not need all the files, just copy over what is needed
COPY apps/inventory apps/inventory
COPY libs libs

# Build the application
RUN yarn run build inventory

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package.json and yarn.lock for production
COPY package.json ./ 
COPY yarn.lock ./

# Install Yarn globally
RUN npm install -g yarn --force


# Install only production dependencies
RUN yarn install --production

# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./dist

# Run the application
CMD ["node","dist/apps/inventory/main"]

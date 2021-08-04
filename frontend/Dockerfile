# syntax=docker/dockerfile:experimental
###########
# BUILDER #
###########

# base image
FROM node:15.14-alpine as builder

# set working directory
WORKDIR /usr/src/app

# add `/usr/src/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

# Global install of react-scripts is deprecated and no longer required/recommended
RUN npm install

# create build
COPY . /usr/src/app
RUN npm run build


#########
# FINAL #
#########

# base image
FROM nginx:stable-alpine

# copy static files
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

# expose port
EXPOSE 80

# run nginx on startup
CMD ["nginx", "-g", "daemon off;"]

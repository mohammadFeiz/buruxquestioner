FROM node:14.15.3-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV BACKEND_URL=http//192.168.10.51:8077/
# install app dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

# add app
COPY . .

# start app
CMD ["npm", "start"]

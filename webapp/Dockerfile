FROM node:18.13.0
LABEL org.opencontainers.image.source https://github.com/arquisoft/lomap_es1b
COPY . /app
WORKDIR /app
#Install the dependencies
RUN npm install

ARG DEPLOY_HOST="http://localhost"
ENV REACT_APP_HOST=$DEPLOY_HOST
ENV REACT_APP_API_KEY_GOOGLE_MAPS=$API_KEY_GOOGLE_MAPS
ENV REACT_APP_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV REACT_APP_PRESET=$CLOUDINARY_PRESET
ENV REACT_APP_API_KEY=$CLOUDINARY_API_KEY
ENV REACT_APP_API_SECRET=$CLOUDINARY_API_API_SECRET

#Create an optimized version of the webapp
RUN npm run build

#Execute npm run prod to run the server
CMD [ "npm", "run", "prod" ]
# CMD ["npm", "start"]

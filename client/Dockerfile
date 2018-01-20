FROM node:8

ADD yarn.lock /yarn.lock
ADD package.json /package.json

# add environment variables
ARG NODE_ENV
ARG REACT_APP_BOOKS_SERVICE_URL
ENV NODE_ENV $NODE_ENV
ENV REACT_APP_BOOKS_SERVICE_URL $REACT_APP_BOOKS_SERVICE_URL

ENV NODE_PATH=/node_modules
ENV PATH=$PATH:/node_modules/.bin
RUN yarn

WORKDIR /code
ADD . /code

EXPOSE 3000
EXPOSE 35729

ENTRYPOINT ["/bin/bash", "/code/run.sh"]
CMD ["start"]

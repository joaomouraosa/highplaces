FROM mhart/node-14.9.0

RUN mkdir -p /api/
WORKDIR /api
COPY package*.json /api/

RUN npm install

COPY backend/ /api/backend/
COPY index.js /api/

EXPOSE 5000
CMD ["node", "index.js"]
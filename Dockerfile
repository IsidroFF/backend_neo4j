FROM node
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV REDIS_URL=redis://localhost:6379
ENV NEO4J_URL=neo4j://localhost:7687
EXPOSE 3000
CMD ["npm","start"]
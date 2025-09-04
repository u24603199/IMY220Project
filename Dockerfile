FROM node:22

WORKDIR /app

COPY . .

RUN npm install && npm run build && npx webpack

EXPOSE 3000

CMD ["npm", "run", "start"]

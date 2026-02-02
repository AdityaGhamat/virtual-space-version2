FROM node:18-bullseye-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    net-tools \
    iproute2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app


COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/frontend/package.json apps/frontend/


RUN npm install


COPY . .


RUN npm run build --workspace=apps/frontend


RUN mkdir -p apps/backend/public
RUN cp -r apps/frontend/dist/* apps/backend/public/


RUN npm run build --workspace=apps/backend


EXPOSE 3000
EXPOSE 2000-2020/udp


CMD ["npm", "run", "start", "--workspace=apps/backend"]
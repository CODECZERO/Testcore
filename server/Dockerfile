FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    curl \
    build-base \
    linux-headers \
    git \
    bash \
    make \
    openssl1.1-compat\
    cmake \
    ninja  \
    python3 \
    py3-pip \
    nginx \ 
    nodejs \
    npm \
    && curl -fsSLO --compressed "https://unofficial-builds.nodejs.org/download/release/v22.11.0/node-v22.11.0-linux-x64-musl.tar.xz" \
    && tar -xJf "node-v22.11.0-linux-x64-musl.tar.xz" -C /usr/local --strip-components=1 --no-same-owner \
    && rm "node-v22.11.0-linux-x64-musl.tar.xz" \
    && ln -s /usr/local/bin/node /usr/local/bin/nodejs

# Verify Node.js and npm installation
RUN node -v && npm -v

RUN pwd

# Set the working directory
WORKDIR /app

# Copy application dependencies
COPY package*.json ./
COPY prisma ./prisma

#installing packages
RUN npm install
#running prisma to create schema and skiping yes otpions
RUN yes | npx prisma generate
RUN pwd
RUN ls
# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
RUN ls -l
COPY dist ./dist
RUN ls -l
# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 10000
# Start Nginx and the Node.js app
CMD ["sh", "-c", "nginx -g 'daemon off;' & node dist/index.js"]


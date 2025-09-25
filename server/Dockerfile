FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    curl \
    bash \
    python3 \
    py3-pip \
    nginx \
    nodejs \
    npm \
    build-base \
    && rm -rf /var/cache/apk/*

# Install Node.js (Using NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    RUN apt-get install -y nodejs
    
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
CMD ["sh", "-c", "service nginx start && node dist/index.js"]

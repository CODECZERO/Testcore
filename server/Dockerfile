FROM alpine:latest

# Install system dependencies
RUN apk add --no-cache \
    curl \
    build-base \
    linux-headers \
    git \
    bash \
    make \
    cmake \
    ninja \
    python3 \
    py3-pip \
    nginx \
    nodejs \
    npm \
    openssl-dev \
    perl \
    perl-utils

# Build and install OpenSSL 1.1.1w
RUN curl -sSL https://www.openssl.org/source/openssl-1.1.1w.tar.gz | tar xz && \
    cd openssl-1.1.1w && \
    ./Configure linux-x86_64 \
        --prefix=/usr/local/openssl-1.1 \
        --openssldir=/usr/local/openssl-1.1 \
        shared && \
    make -j"$(nproc)" && \
    make install_sw && \
    ln -s /usr/local/openssl-1.1/lib/libssl.so.1.1 /usr/lib/ && \
    ln -s /usr/local/openssl-1.1/lib/libcrypto.so.1.1 /usr/lib/ && \
    cd .. && rm -rf openssl-1.1.1w

    
RUN /usr/local/openssl-1.1/bin/openssl version


# Verify Node.js and npm installation
RUN node -v && npm -v

RUN pwd

# Set the working directory
WORKDIR /app
ENV PRISMA_ENGINES_OPENSSL_VERSION=openssl-1.1.x
ENV LD_LIBRARY_PATH=/usr/local/openssl-1.1/lib:/usr/lib

# Copy application dependencies
COPY package*.json ./
COPY prisma ./prisma

#installing packages
RUN npm install
#running prisma to create schema and skiping yes otpions
RUN yes | npx prisma generate
RUN pwd
# Copy Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy application files
COPY dist ./dist
# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 10000
# Start Nginx and the Node.js app
CMD ["sh", "-c", "nginx -g 'daemon off;' & node dist/index.js"]


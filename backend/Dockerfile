
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').request('http://localhost:5000/health', { timeout: 2000 }, (res) => { process.exit(res.statusCode !== 200); }).on('error', () => process.exit(1)).end()"

# Expose port and start application
EXPOSE 5000
CMD ["node", "server.js"]

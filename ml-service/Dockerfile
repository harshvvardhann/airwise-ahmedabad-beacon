FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for faster pip installs
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better layer caching
COPY requirements.txt .

# Install Python dependencies with optimizations
# Using --no-cache-dir to reduce image size, but pip cache is still used for faster rebuilds
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create models directory
RUN mkdir -p models

# Simple healthcheck - just verify Python can run
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD python -c "import sys; sys.exit(0)" || exit 1

# Start application
CMD ["python", "app.py"]

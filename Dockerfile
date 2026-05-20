FROM python:3.10-slim

# Install core system dependencies required by OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements first
COPY backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy all application files (including the already built frontend/dist folder)
COPY backend/ /app/backend/
COPY frontend/ /app/frontend/
COPY app.py /app/app.py

EXPOSE 7860
ENV PORT=7860

# Start the application directly
CMD ["python", "app.py"]

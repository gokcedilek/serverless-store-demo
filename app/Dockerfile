# Reference https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service and https://github.com/GoogleCloudPlatform/serverless-store-demo/pull/10/files

# Use the official Python image.
# https://hub.docker.com/_/python
FROM python:3.7

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . .

# Install production dependencies.
RUN pip install --no-cache-dir -r requirements-docker.txt

# set the environment variables
ENV GCP_PROJECT=ubc-serverless-compliance
ENV PUBSUB_TOPIC_NEW_PRODUCT=new-product
ENV PUBSUB_TOPIC_PAYMENT_PROCESS=payment-process
ENV GCS_BUCKET=serverless-store-bucket-2-gokce
ENV FIREBASE_CONFIG=firebase_config.json

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
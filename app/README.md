# Running the Flask app (frontend) in CloudRun instead of AppEngine

**Note:** The new app domain (e.g. `https://sls-compliance-frontend-bqaxzu3sxq-uc.a.run.app`) needs to be added to the list of Firebase authorized domains.

## Create a docker image

`docker build -t gcr.io/ubc-serverless-compliance/sls-compliance-frontend:latest .`

## Push image

`docker push gcr.io/ubc-serverless-compliance/sls-compliance-frontend:latest`

## Deploy image to Cloud Run

```bash
gcloud beta run deploy sls-compliance-frontend --image=gcr.io/ubc-serverless-compliance/sls-compliance-frontend:latest
```

## Authenticate with the GCP Container Registry

To run the commands above, follow the steps [here](https://cloud.google.com/container-registry/docs/advanced-authentication#gcloud-helper):

- `gcloud auth login`
- `gcloud auth configure-docker`

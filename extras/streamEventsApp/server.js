// Copyright 2018 Google LLC.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// App Engine service for streaming events to BigQuery.
// See https://cloud.google.com/bigquery/streaming-data-into-bigquery for
// more information.

const { BigQuery } = require(`@google-cloud/bigquery`);
const express = require(`express`);
const opentelemetry = require('@opentelemetry/api');
const { defaultTextMapGetter, ROOT_CONTEXT } = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const {
  TraceExporter,
} = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { W3CTraceContextPropagator } = require('@opentelemetry/core');

const DATASET = process.env.BIGQUERY_DATASET;
const TABLE = process.env.BIGQUERY_TABLE;

const bigquery = new BigQuery();
const dataset = bigquery.dataset(DATASET);
const table = dataset.table(TABLE);

const app = express();
app.use(express.json());

const provider = new NodeTracerProvider();
const exporter = new TraceExporter();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
opentelemetry.trace.setGlobalTracerProvider(provider);
// const propagator = new W3CTraceContextPropagator();

app.get(`/`, (req, res) => {
  res.send(200);
});

app.post(`/stream`, async (req, res) => {
  const tracer = opentelemetry.trace.getTracer('basic');
  // const messageBuffer = Buffer.from(req.body.message.data, 'base64');
  // const messageString = JSON.stringify(messageBuffer);
  // console.log('message string: ', messageString);
  // const message = JSON.parse(messageString);
  // console.log('message: ', req.body.message.data);

  // const ctx = propagator.extract(
  //   ROOT_CONTEXT,
  //   data.carrier,
  //   defaultTextMapGetter
  // );
  // console.log('context: ', ctx);

  // const span = tracer.startSpan('stream to bigquery', undefined, ctx);
  const span = tracer.startSpan('stream to bigquery');
  span.setAttribute('userToken', data.carrier.uid);

  try {
    // const parsedMessage = {
    //   eventType: data.event_type,
    //   createdTime: data.created_time,
    //   context: JSON.stringify(data.event_context),
    // };
    // await table.insert(parsedMessage);
    // console.log('streamEvents successfully saved: ', parsedMessage);
    span.addEvent('streamEvents succeeded!');
    span.end();
    res.send(200);
  } catch (error) {
    console.log('streamEvents error: ', error);
    span.addEvent('streamEvents failed!');
    span.end();
    res.send(500, `Failed to stream the event to BigQuery.`);
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

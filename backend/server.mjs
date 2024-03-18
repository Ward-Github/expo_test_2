import express from "express";
import * as tf from '@tensorflow/tfjs';
import { createModel } from './model.js';

const app = express();
const port = 3000;

const randomObjects = [
  { priority: 1, kilometersNeeded: 56 },
  { priority: 2, kilometersNeeded: 24 },
  { priority: 3, kilometersNeeded: 78 },
  { priority: 1, kilometersNeeded: 12 },
  { priority: 2, kilometersNeeded: 88 },
  { priority: 3, kilometersNeeded: 45 },
  { priority: 1, kilometersNeeded: 72 },
  { priority: 2, kilometersNeeded: 33 },
  { priority: 3, kilometersNeeded: 90 },
  { priority: 1, kilometersNeeded: 19 },
  { priority: 2, kilometersNeeded: 67 },
  { priority: 3, kilometersNeeded: 52 },
  { priority: 1, kilometersNeeded: 84 },
  { priority: 2, kilometersNeeded: 41 },
  { priority: 3, kilometersNeeded: 63 },
];

const loadMachineLearningModel = async () => {
  try {
    const model = createModel();
    return model;
  } catch (error) {
    console.error('Error creating model:', error);
    throw error;
  }
};

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

app.get('/optimal', async (req, res) => {
  try {
    const model = await loadMachineLearningModel();
    const inputs = tf.tensor2d(randomObjects.map(obj => [obj.priority, obj.kilometersNeeded]));
    const predictions = model.predict(inputs);
    const optimalIndex = predictions.argMax().dataSync()[0];
    res.json({ success: true, optimalObject: randomObjects[optimalIndex] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error processing request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

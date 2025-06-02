import * as tf from '@tensorflow/tfjs';
import { MLPrediction, WeatherData } from '../types';

export class MLService {
  private model: tf.LayersModel | null = null;

  async initialize() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [8], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dense({ units: 1 })
      ]
    });

    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError',
      metrics: ['mse']
    });
  }

  async trainModel(weatherData: WeatherData): Promise<void> {
    if (!this.model) {
      await this.initialize();
    }

    const { inputs, outputs } = this.preprocessData(weatherData);
    
    await this.model!.fit(inputs, outputs, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch}: loss = ${logs?.loss}`);
        }
      }
    });
  }

  async predict(weatherData: WeatherData): Promise<MLPrediction> {
    if (!this.model) {
      throw new Error('Model not initialized');
    }

    const { inputs } = this.preprocessData(weatherData);
    const prediction = this.model.predict(inputs) as tf.Tensor;
    const predictedValue = await prediction.data();
    
    return {
      predictedOutput: predictedValue[0],
      confidence: 0.95 // Simplified confidence calculation
    };
  }

  private preprocessData(weatherData: WeatherData) {
    const inputs = tf.tensor2d(weatherData.hourly.time.map((_, i) => [
      weatherData.hourly.temperature_2m[i],
      weatherData.hourly.relative_humidity_2m[i],
      weatherData.hourly.wind_speed_10m[i],
      weatherData.hourly.wind_speed_80m[i],
      weatherData.hourly.wind_speed_120m[i],
      weatherData.hourly.wind_speed_180m[i],
      weatherData.hourly.direct_normal_irradiance[i],
      weatherData.hourly.diffuse_radiation[i]
    ]));

    const outputs = tf.tensor2d(weatherData.hourly.time.map((_, i) => [
      weatherData.hourly.shortwave_radiation[i]
    ]));

    return { inputs, outputs };
  }
}

export const mlService = new MLService();
import * as tf from '@tensorflow/tfjs-core';
import * as tflayer from '@tensorflow/tfjs-layers';

console.log(tf);

const loadModel = async () => {
    console.log('loading...');
    const xxx = await tflayer.loadModel('./model/model.json');
    console.log('loaded');
    console.log(xxx);
}

loadModel();

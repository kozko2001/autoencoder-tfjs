import * as tf from '@tensorflow/tfjs-core';
import * as tflayer from '@tensorflow/tfjs-layers';
const loadModel = async () => {
    const model = await tflayer.loadModel('./model/model.json');
    return model;
}

const drawTensor = (tensor, id) => {
    console.log('drawing...');
    const i = tensor.reshape([28, 28, 1]);
    tf.toPixels(i, document.getElementById(`canvas-${id}`));
}

const loadMnist = async () => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const imgRequest = new Promise((resolve, reject) => {
        img.crossOrigin = '';
        img.onload = () => {
            img.width = img.naturalWidth;
            img.height = img.naturalHeight;

            canvas.width = 28;
            canvas.height = 28;

            ctx.drawImage(img, 0, 0, 28, 28);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = [];

            for (let j = 0; j < imageData.data.length / 4; j++) {
                data.push(imageData.data[j * 4] / 255   );
            }

            resolve(new Float32Array(data));
        };
        img.src = 'mnist/5_0.png';
    });

    const d = await imgRequest;
    const t = tf.tensor4d(d, [1, 28, 28, 1]);
    return t;
}

const init = async() => {
    console.log('loading mnist');
    const image = await loadMnist()

    console.log('loading model');
    const model = await loadModel();

    const result = model.apply(image);
    drawTensor(image, 'original');
    drawTensor(result, 'result');
}

init().then(() => {
    console.log('init complete...');
})

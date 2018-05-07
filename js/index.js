import * as tf from '@tensorflow/tfjs-core';
import * as tflayer from '@tensorflow/tfjs-layers';
import _ from 'lodash';

let model;
let encodedTensor;

const loadModel = async () => {
    const model = await tflayer.loadModel('./model/model.json');
    return model;
}

const setMessage = (message) => {
    document.querySelector('#message').innerHTML = message;
}

const drawTensor = (tensor, id) => {
    const i = tensor.reshape([28, 28, 1]);
    tf.toPixels(i, document.getElementById(`canvas-${id}`));
}

const drawIntermediateRepresentation = (tensor, id) => {
    tf.toPixels(tensor.clipByValue(0, 1), document.getElementById(`canvas-${id}`));
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

const encode = (model, tensor) => {
    const layers = model.layers;

    for (let index = 1; index < layers.length; index++) {
        const layer = layers[index];
        tensor = layer.apply(tensor);
        
        if(layer.name === 'max_pooling2d_6') {
            return tensor;
        }
    }

    return tensor;
}

const decode = (model, tensor) => {
    const layers = model.layers;

    const firstLayer = model.layers.findIndex((l) => l.name === 'conv2d_11')

    for (let index = firstLayer; index < layers.length; index++) {
        const layer = layers[index];
        
        tensor = layer.apply(tensor);
    }

    return tensor;
}

const extract_channel = (tensor, channel) => tensor.slice([0, 0, channel], [4, 4, 1]);

const extract_channels = (tensor) => _.range(tensor.shape[2]).map(channel_idx => extract_channel(tensor, channel_idx));

const init = async() => {
    setMessage('Loading model...');
    model = await loadModel();
    setMessage('Model loaded, select and image and press encode');
}

window.encodeAction = () => {
    const f = async () => {
        setMessage('Loading image...');
        const image = await loadMnist()

        encodedTensor = encode(model, image);
        const encoded = encodedTensor.squeeze();
        const channels = extract_channels(encoded)
                        .forEach((tensor, idx) => drawIntermediateRepresentation(tensor, `encoded${idx}`));
        

        drawTensor(image, 'original')
    }
    f().then(() => {});
}

window.decodeAction = () => {
    const f = async () => {
        setMessage('Loading image...');
        const image = await loadMnist()

        const decoded = decode(model, encodedTensor);
        drawTensor(decoded, 'result')
    }
    f().then(() => {});
}

init().then(() => { })


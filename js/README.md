
## Use custom tfjs-layers

since UpSampling2D is not available on the official tfjs-layers, you need to use 
my own fork, for import just execute

```
./add-tfjs.sh
```

## Load the model

Generate the model using the python folder (see the readme there)

copy the folder `python/model/` into `js/dist/model/`

## Start the demo

`yarn run watch` and open `localhost:8000`

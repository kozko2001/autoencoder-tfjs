set -x

git clone git@github.com:tensorflow/tfjs-core.git ./.tfjs/tfjs-core
git clone git@github.com:kozko2001/tfjs-layers.git ./.tfjs/tfjs-layers

pushd .tfjs/tfjs-layers;
yarn install
yarn publish-local
popd

pushd .tfjs/tfjs-core;
yarn install
yarn publish-local
popd

yarn install
yarn link-local @tensorflow/tfjs-layers
yarn link-local @tensorflow/tfjs-core

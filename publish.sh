RED='\033[0;31m'
NC='\033[0m' # No Color


ROOT=$(mktemp -d)
printf "${RED}Deploying on temporal folder $ROOT${NC}\n"
cd $ROOT

git clone git@github.com:kozko2001/autoencoder-tfjs.git autoencoder
cd $ROOT/autoencoder
git pull

printf "${RED}Linking with custom tfjs-layers ${NC}\n"
cd js
./add-tfjs.sh
cd -

printf "${RED}Building demo ${NC}\n"
cd js;
yarn run build
cd -

rm -rf ./docs
cp -r js/dist ./docs

printf "${RED}Commiting ${NC}\n"
git add docs
git commit -m "Publish"
git push

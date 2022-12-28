out=./static/worklets

[ -d $out ] && rm -rf $out
mkdir -p $out

for f in ./src/worklets/*/
do

  input="./src/worklets/$(basename $f)/index.ts"
  output="./static/worklets/$(basename $f).js"
  args="$input --config ./config/rollup.config.js --file $output --format iife"
  echo "\nrollup $args"
  ./node_modules/.bin/rollup $args
done

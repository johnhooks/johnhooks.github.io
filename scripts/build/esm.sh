mkdir -p dist/esm
rsync -a --prune-empty-dirs --include '*/' --include '*.js' --exclude '*' lib/ dist/esm

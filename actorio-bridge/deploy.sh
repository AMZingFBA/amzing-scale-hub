#!/bin/bash
# Met à jour le bridge Actorio sur Hetzner
# Usage: bash actorio-bridge/deploy.sh

set -e
SSH_KEY="/Users/noazaghdoun/.ssh/id_ed25519_hetzner"
SERVER="root@37.27.190.92"

echo "Envoi des fichiers sur Hetzner..."
rsync -av -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  --exclude="node_modules" --exclude="dist" --exclude="debug-*" \
  --exclude="*.png" --exclude="*.html" --exclude="error-screenshot.png" \
  "/Users/noazaghdoun/Downloads/AMZing FBA /amzing-scale-hub/actorio-bridge/" \
  "$SERVER:/opt/actorio-bridge/"

echo "Build + redemarrage..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER" "
  cd /opt/actorio-bridge &&
  npm install --include=dev --quiet 2>&1 | tail -2 &&
  npm run build 2>&1 | grep -v WARNING &&
  pm2 restart actorio-bridge &&
  sleep 5 &&
  pm2 logs actorio-bridge --lines 10 --nostream
"
echo "Bridge mis a jour sur Hetzner"

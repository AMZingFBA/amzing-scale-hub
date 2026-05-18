#!/bin/bash
# Met à jour le bridge Actorio sur Hetzner
# Usage: bash actorio-bridge/deploy.sh

set -e
SSH_KEY="/Users/noazaghdoun/.ssh/id_ed25519_hetzner"
SERVER="root@37.27.190.92"
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=15"

# Attendre que le serveur soit accessible (jusqu'à 120s)
echo "Vérification de la connexion au serveur..."
MAX_WAIT=120
WAITED=0
until ssh $SSH_OPTS "$SERVER" "echo ok" &>/dev/null; do
  if [ $WAITED -ge $MAX_WAIT ]; then
    echo "ERREUR: serveur inaccessible après ${MAX_WAIT}s"
    exit 1
  fi
  echo "  Serveur pas encore prêt, attente... (${WAITED}s)"
  sleep 5
  WAITED=$((WAITED + 5))
done
echo "Serveur accessible !"

echo "Envoi des fichiers sur Hetzner..."
rsync -av -e "ssh $SSH_OPTS" \
  --exclude="node_modules" --exclude="dist" --exclude="debug-*" \
  --exclude="*.png" --exclude="*.html" --exclude="error-screenshot.png" \
  "/Users/noazaghdoun/Downloads/AMZing FBA /amzing-scale-hub/actorio-bridge/" \
  "$SERVER:/opt/actorio-bridge/"

echo "Build + reset session + redemarrage..."
ssh $SSH_OPTS "$SERVER" "
  cd /opt/actorio-bridge &&
  # Supprimer la session Actorio cachée — force un re-login propre avec les nouveaux credentials
  rm -f .actorio-session.json && echo '✓ Session Actorio supprimée (re-login forcé)' &&
  npm install --include=dev --quiet 2>&1 | tail -2 &&
  npm run build 2>&1 | grep -v WARNING &&
  pm2 restart actorio-bridge &&
  sleep 8 &&
  pm2 logs actorio-bridge --lines 25 --nostream
"
echo ""
echo "Bridge mis a jour sur Hetzner avec nouveaux credentials Actorio"

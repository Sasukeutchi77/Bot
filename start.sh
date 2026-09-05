#!/bin/bash
echo "🚀 Démarrage du Bot WhatsApp Multi-Device..."
while true; do
  node launcher.cjs
  echo "⚠️ Le processus s'est arrêté. Redémarrage dans 3 secondes..."
  sleep 3
done

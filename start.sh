#!/bin/bash

echo "==========================================="
echo "            Starting Tools"
echo "==========================================="
echo ""

# ===== Backend =====
echo "[1/3] Starting Spring Boot Backend..."

gnome-terminal -- bash -c "
cd spring-backend || exit
chmod +x mvnw
./mvnw clean spring-boot:run
exec bash
" &

# ===== Frontend check =====
echo ""
echo "[2/3] Checking React Frontend..."

if [ ! -d "react-frontend/node_modules" ]; then
    echo "[!] node_modules not found. Running npm install..."

    (cd react-frontend && npm install)

    if [ $? -ne 0 ]; then
        echo "[X] ERROR: npm install failed!"
        exit 1
    fi
fi

# ===== Frontend run =====
echo ""
echo "[3/3] Starting React Frontend..."

gnome-terminal -- bash -c "
cd react-frontend || exit
npm run dev
exec bash
" &

echo ""
echo "-------------------------------------------"
echo "Application is starting..."
echo "-------------------------------------------"
#!/bin/bash
# KrishiSetu - Start Backend & Frontend
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🌾 Starting KrishiSetu Platform..."

# Start Backend Server (SQLite + JSON persistent registration server on port 8000)
echo "🚀 Starting backend server on http://localhost:8000 ..."
python3 "$DIR/backend/server.py" &
BACKEND_PID=$!

trap "kill $BACKEND_PID 2>/dev/null || true" EXIT

echo "✅ Backend running with PID $BACKEND_PID"
echo "🌐 Starting frontend development server on http://localhost:5173 ..."

cd "$DIR/frontend"
if command -v npm &> /dev/null; then
    npm run dev
else
    echo "⚠️ npm command not found in current PATH. You can run frontend with: cd frontend && npm run dev"
    wait $BACKEND_PID
fi

#!/bin/bash
cd /Users/mhyh/.openclaw/workspace/portfolio_site_v2
pkill -f "python3 -m http.server" 2>/dev/null
sleep 1
python3 -m http.server 8152 &
sleep 2
echo "Server started on port 8152"

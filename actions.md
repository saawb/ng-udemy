name: Build and Deploy Personal Site

on:
push:
branches: [ main ]

jobs:

# JOB 1: Build & Package Backend if .NET files change

build-backend:
runs-on: ubuntu-latest
defaults:
run:
working-directory: ./backend
steps: - uses: actions/checkout@v4 - name: Setup .NET
uses: actions/setup-dotnet@v4
with:
dotnet-version: '8.0' - name: Build & Publish API
run: dotnet publish -c Release -o ./publish

# JOB 2: Build & Package Frontend if Angular files change

build-frontend:
runs-on: ubuntu-latest
defaults:
run:
working-directory: ./frontend
steps: - uses: actions/checkout@v4 - name: Setup Node
uses: actions/setup-node@v4
with:
node-version: '20' - name: Install & Build Angular
run: |
npm ci
npm run build -- --configuration=production

# JOB 3: SSH into your server, pull code, and restart Docker Compose

deploy:
needs: [build-backend, build-frontend]
runs-on: ubuntu-latest
steps: - name: Deploy via SSH
uses: appleboy/ssh-action@master
with:
host: ${{ secrets.SERVER_IP }}
username: ${{ secrets.SERVER_USER }}
key: ${{ secrets.SSH_PRIVATE_KEY }}
script: |
cd /app/my-website
git pull origin main
docker compose up -d --build

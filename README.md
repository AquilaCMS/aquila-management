# Aquila Management

Aquila Management is a dashboard that allows to monitor servers through agents (Aquila Probe).
It allows to check server statistics (like CPU load, percentage of RAM taken etc), the ports used and the associated processes.
It also allows to monitor and interact with applications launched with Docker or pm2.
Thanks to Aquila Probe, the project can also be used as an interface between HTTP requests and system scripts.

## Getting Started

1. yarn install
2. cp packages/aquila-management-api/data/serversList.example.json packages/aquila-management-api/data/serversList.json

If you want to run it in a production mode (the front is build and only one process is launch) :
3. cp packages/aquila-management-front/.env.example packages/aquila-management-front/.env
4. npm run build
5. cp packages/aquila-management-api/ecosystem.config.example.cjs packages/aquila-management-api/ecosystem.config.cjs (for security purpose, please change the PORT variable)
6. npm run start:pm2

If you want to run it in a development mode (the front is not pre-built and two processes are launch) :
3. npm run start:both
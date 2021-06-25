# Aquila Management

Aquila Management is a dashboard made with Node.js, React and MaterialUI, that allows to monitor servers through agents ([Aquila Probe](https://github.com/AquilaCMS/aquila-probe)).
It allows to check server statistics (like CPU load, percentage of RAM taken etc), the ports used and the associated processes.
It also allows to monitor and interact with applications launched with Docker or pm2.
Thanks to Aquila Probe, the project can also be used as an interface between HTTP requests and system scripts.

## Getting Started

If you want to run it in a development mode (the front is not pre-built and two processes are launch) :
1. yarn install
2. cp packages/aquila-management-api/data/serversList.example.json packages/aquila-management-api/data/serversList.json
3. npm run start:both

If you want to run it in a production mode (the front is build and only one process is launch) :
1. yarn install
2. cp packages/aquila-management-front/.env.example packages/aquila-management-front/.env
3. npm run build
4. cp packages/aquila-management-api/data/serversList.example.json packages/aquila-management-api/data/serversList.json
5. cp packages/aquila-management-api/ecosystem.config.example.cjs packages/aquila-management-api/ecosystem.config.cjs (for security purpose, please change the PORT variable)
6. npm run start:pm2
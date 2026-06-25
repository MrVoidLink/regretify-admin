## Regretify Admin

Internal dashboard for operating Regretify.

## Deploy Shape

This repository is prepared for Portainer `Repository` deployment.

Expected runtime shape:
- stack name: `regretify-admin`
- service name: `admin`
- external Docker network: `regretify_net`

Required runtime env in Portainer:

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXT_PUBLIC_APP_NAME=Regretify Admin
NEXT_PUBLIC_CORE_API_BASE_URL=http://replace-in-portainer/api
```

## Development

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

## Health Check

```txt
GET /api/health
```

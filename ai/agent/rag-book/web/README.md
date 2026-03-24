# Web Frontend

## Run

1. Start backend API:

```bash
npm start
```

2. Open browser:

```text
http://localhost:3000
```

The backend serves static files from this `web/` folder.

## Frontend modules

- `js/apiClient.js`: API call wrapper (`/api/health`, `/api/chat`) with timeout and error handling.
- `js/chatStore.js`: state container and business event updates.
- `js/chatView.js`: DOM rendering, status badge, message/context list drawing.
- `js/app.js`: app controller, submits question and coordinates API + store + view.

## SEBI Guardian AI – Backend and Services

A modular backend for investor fraud prevention with Node.js (Express) and a small Python Flask service for market data demos.

### Features
- Authentication: JWT + OTP (email via Nodemailer)
- Fraud tools: behavior biometrics (stub), deepfake check (stub), social contagion graph (stub)
- Dashboard: risk score, alerts, report, advice verification (Yahoo Finance)
- Integrations: Yahoo Finance, Google Translate (stub), SEBI/NSE/BSE sandbox (stub)
- PostgreSQL via Sequelize, Redis for rate limiting and real‑time alerts
- Consistent JSON error handling

### Repository Structure
- `backend/` – Node.js Express API
- `app.py`, `api/`, `market_data/` – Python Flask demo service for market endpoints
- `public/`, `app/` – Frontend assets (Next.js scaffold present in repo)

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ (db: `sebi_guardian`)
- Redis 6+

### Quick Start

#### 1) Backend API (Node.js)
```bash
cd backend
cp .env.example .env  # if available; otherwise set env vars below
npm install
npm run dev
```
Server starts on `http://localhost:5000`.

Environment variables (minimum):
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
- `JWT_SECRET`, `JWT_REFRESH_SECRET`
- `EMAIL_USER`, `EMAIL_PASS` (SMTP)
- Optional: `CORS_ORIGIN`, `FRONTEND_URL`, `REDIS_HOST`, `REDIS_PORT`

Common scripts:
- `npm run dev` – start with nodemon
- `npm start` – production start

#### 2) Python Market Service (Flask)
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python app.py
```
Flask app serves:
- `GET /market/top10`
- `GET /hybridaction/zybTrackerStatisticsAction`

### API Overview (Node)
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/logout`
- `GET /api/dashboard/risk-score`
- `GET /api/dashboard/alerts`
- `POST /api/dashboard/actions/report`
- `POST /api/dashboard/actions/verify-advice`
- `POST /api/dashboard/actions/check-source`
- `POST /api/fraud/behavior-biometrics`
- `GET /api/fraud/social-contagion`
- `POST /api/fraud/deepfake-check`
- `GET /api/learning/quiz/start`
- `POST /api/learning/quiz/submit`
- `GET /api/learning/progress`
- `POST /api/community/report-fraud`
- `POST /api/community/trusted-alert`
- `GET /api/community/sebi-sandbox`
- `GET/PUT /api/settings/profile`
- `GET/PUT /api/settings/notifications`
- `PUT /api/settings/language`
- `PUT /api/settings/privacy`

### Security Notes
- Use strong, unique `JWT_SECRET` and `JWT_REFRESH_SECRET`
- Enable TLS/HTTPS in production and secure cookies
- Configure CORS to trusted origins only

### External APIs
- Yahoo Finance via `yahoo-finance2` (Node)
- Google Translate API (stub placeholder)
- SEBI/NSE/BSE sandbox (stub placeholder)

### License
MIT (or as applicable).
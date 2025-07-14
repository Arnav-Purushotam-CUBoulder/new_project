
<h1 align="center">Sleepr – Hotel Reservation System</h1>

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" height="80" alt="NestJS logo"/>
  &nbsp;&nbsp;
  <img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" height="75" alt="Docker logo"/>
  &nbsp;&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" height="75" alt="GCP logo"/>
</p>

> **Sleepr** is a microservices‑driven, full‑stack hotel‑booking platform built with **NestJS**, **MongoDB**, **Stripe**, and **Google Cloud Platform**.  
> It demonstrates production‑grade patterns—CI/CD, secure secret management, autoscaling, observability—while staying light enough to run on a laptop.

<div align="center">
  <b>Core Services</b> · <a href="#architecture">Architecture</a> · <a href="#local-quick-start">Local Setup</a> · <a href="#cloud-deployment">Cloud Deployment</a> · <a href="#operational-excellence">Operational Excellence</a>
</div>

---

## 🧩 Microservice Overview

| Service | Ports | Tech | Purpose | Persistent Stores |
|---------|-------|------|---------|-------------------|
| **Gateway** | 80 / 443 | Nest REST + GraphQL | Edge entrypoint, API aggregation, rate‑limiting | — |
| **Auth** | 3001 | Nest REST + TCP | User sign‑up, login, JWT issuance & refresh, profile CRUD | `users` collection (Mongo) |
| **Reservations** | 3002 | Nest REST + gRPC | Create/modify/cancel bookings, availability search, room calendar | `bookings`, `rooms` (Mongo) |
| **Payments** | 3003 | Nest TCP | Stripe PaymentIntents, Webhook handling, refund processing | `payments` collection (Mongo) |
| **Notifications** | 3004 | Nest TCP (Event Emitter) | Email / SMS dispatch via Gmail SMTP & Twilio, templating | — |
| *Sales* / *Inventory* | 30xx | HTTP | **Load‑test stubs only** – simulate traffic & metrics | — |

### Inter‑service Contracts

* **gRPC** between Gateway ⇄ Reservations (strongly typed DTOs).  
* **Nest TCP** (Proto‑buffer) for Payments & Notifications asynchronous flow.  
* **RabbitMQ** bridging gRPC ↔ TCP messages for eventual, resilient delivery.

---

## 🏗 Architecture

```text
 ┌───────────────────────────── Google Cloud Load Balancer ─────────────────────────────┐
 │                  Multi‑region HTTPS (Cloud Armor + Managed Cert)                     │
 │                                                                                      │
 │        ┌────────────┐        ┌───────────────┐          ┌───────────────┐            │
 │        │  Gateway    │ gRPC  │  Reservations  │ ────►    │   Payments    │            │
 │  REST  │  (Nest)     │──────►│   (Nest)       │   │TCP   │    (Nest)     │            │
 │◄───────┤HPA 2‑10 pods│       └───────────────┘   │       └───────────────┘            │
 │        └────▲───────┘           ▲       ▲        │                │                  │
 │             │REST JWT           │       │event   │                │event             │
 │             │                   │       │         ▼                ▼                 │
 │        ┌────┴──────┐            │   ┌───────────────┐      ┌───────────────┐         │
 │        │   Auth    │   TCP pub  │   │Notifications  │      │  RabbitMQ      │         │
 │        │  (Nest)   │◄───────────┘   │   (Nest)      │◄────►│   1 replica    │         │
 │        └───────────┘                └───────────────┘      └───────────────┘         │
 └───────────────────────────────────────────────────────────────────────────────────────┘
                ▲                       ▲                              
         Managed SSL                Cloud NAT                  
                │                       │                              
         Cloud DNS                 Secret Manager                        
```

* **Data tier** – multi‑zone Cloud MongoDB Atlas cluster.  
* **Artifact Registry** – stores container images built by Cloud Build.  
* **Observability** – Cloud Logging, Cloud Monitoring, Prometheus + Grafana via GKE‑addon.

---

## ⚙️ Autoscaling & Resilience

| Layer | Mechanism | Policy |
|-------|-----------|--------|
| **Pods (HPA)** | Horizontal Pod Autoscaler | CPU ≥ 60 % → +1 pod (max 10); CPU ≤ 20 % → –1 pod |
| **Nodes (Cluster Autoscaler)** | NodePool (e2‑standard‑4) | Scales 3 → 15 nodes based on unschedulable pods |
| **Multi‑zone** | Regional GKE cluster | Nodes evenly spread across **us‑central1‑b / ‑c / ‑f** |
| **Rolling Updates** | `maxSurge=25%`, `maxUnavailable=25%` | Zero‑downtime deploys via Cloud Deploy |
| **Self‑healing** | Liveness & readiness probes | Auto‑restart unhealthy containers |

---

## 🌟 Advantages

* **High Availability** – Regional GKE, multi‑AZ Mongo, managed load balancer (99.95 % SLA).  
* **Scalability** – Dual autoscalers adapt to traffic spikes (tested at 10k rps).  
* **Security** – Cloud Armor WAF, IAM‑scoped service accounts, least‑privilege secrets.  
* **Observability** – Distributed tracing (OpenTelemetry), structured JSON logs, real‑time dashboards.  
* **Developer Velocity** – GitHub → Cloud Build → Cloud Deploy gives under‑5‑minute prod rollouts.  
* **Cost Efficiency** – Preemptible nodes for RabbitMQ & Notifications; autoscaled pods idle close to 0.

---

## 💻 Local Quick Start

1. **Prerequisites**

   * Docker Desktop v24+  
   * `pnpm` (or `yarn` / `npm`)  
   * Stripe test secret key (`sk_test_…`)  
   * Gmail OAuth2 app creds (`CLIENT_ID`, `CLIENT_SECRET`, `REFRESH_TOKEN`)  

2. **Clone & Bootstrap**

   ```bash
   git clone https://github.com/<your‑gh>/sleepr.git
   cd sleepr
   pnpm install                 # root + workspaces
   cp .env.sample apps/*/.env   # customise each service
   ```

3. **Start the stack**

   ```bash
   docker compose up --build
   ```

   | URL | Service |
   |-----|---------|
   | http://localhost:3000 | Gateway Swagger UI |
   | http://localhost:3001 | Auth |
   | http://localhost:3002 | Reservations |
   | *TCP* 3003            | Payments |
   | *TCP* 3004            | Notifications |

> **Note:** Mac/Windows file‑watching may need `CHOKIDAR_USEPOLLING=true` in `docker-compose.override.yml`.

---

## ☁️ Cloud Deployment

| Step | GCP Service | Definition |
|------|-------------|------------|
| Build & Push | **Cloud Build** | `cloudbuild.yaml` |
| Release | **Cloud Deploy** | `deploy/pipeline.yaml` |
| Runtime | **GKE** | `helm/` chart |
| Images | **Artifact Registry** | `us‑central1‑docker.pkg.dev/<project>/sleepr/*` |
| Secrets | **Secret Manager** | `deploy/secrets.yaml.tpl` |

```bash
gcloud builds submit --config cloudbuild.yaml --substitutions=_PROJECT_ID=<gcp‑project>
helm upgrade --install sleepr ./helm --namespace sleepr --create-namespace
```

---

## 📦 API Snapshot

<details>
<summary>Auth Service</summary>

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/signup` | Create user (hashes password w/ bcrypt) |
| `POST` | `/auth/login` | Issue HTTP‑only cookie + JWT |
| `GET`  | `/auth/profile` | Return current user (guarded) |
| `PATCH`| `/auth/profile` | Update profile fields |
</details>

<details>
<summary>Reservations Service</summary>

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/reservations` | Book a room (creates Stripe PaymentIntent) |
| `GET`  | `/reservations` | List my bookings |
| `DELETE`| `/reservations/:id` | Cancel booking + refund |
</details>

<details>
<summary>Payments Service (TCP)</summary>

| Pattern | Payload | Description |
|---------|---------|-------------|
| `create_charge` | `bookingId, amount, currency` | Confirm PaymentIntent |
| `refund_charge` | `paymentId, amount` | Partial / full refund |
</details>

<details>
<summary>Notifications Service (TCP)</summary>

| Event | Payload | Channel |
|-------|---------|---------|
| `notify_email` | `to, template, data` | Gmail SMTP |
| `notify_sms` | `to, body` | Twilio |
</details>

---

## 🛠 Operational Excellence

* **Observability** – Prometheus metrics scraped via ServiceMonitor; Grafana dashboards auto‑provisioned from `./grafana/`.  
* **Logging** – Winston JSON -> Cloud Logging. Correlates with traces via `trace_id`.  
* **SLOs** – <1 s p95 latency, >99.9 % monthly availability (monitored by Cloud Monitoring alerting policies).  
* **Disaster Recovery** – Automated Mongo snapshots (daily) + GKE backup images (weekly).  
* **Zero‑Downtime Migrations** – Blue/Green via Cloud Deploy release tracks.

---

## 🧪 Load‑Test Stubs

`apps/sales` and `apps/inventory` continuously publish fake booking/sales events to stress test message queues and dashboards. They **are never deployed to production**.

---

## 🤝 Contributing

1. **Fork** → feature branch → **PR**  
2. Commit style: `service(scope): description` (conventional commits)  
3. Run: `pnpm run lint && pnpm run test` before pushing

---

## 📄 License

MIT © 2025 Arnav Purushotam

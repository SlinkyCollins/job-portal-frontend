<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/0b83eae4-e0c3-4a34-a182-1f8615259708" />


# JobNet: The Modern Bridge Between Talent & Opportunity

![Build Status](https://img.shields.io/badge/Build-Passing-success) ![Stack](https://img.shields.io/badge/Stack-Angular_18+%7C_Bootstrap-red) ![License](https://img.shields.io/badge/License-MIT-blue)

**JobNet** is a full-stack recruitment platform designed to simplify how jobs are posted, discovered, and managed. It addresses a persistent problem: many job platforms are unnecessarily complex. It focuses on the essentials, clear discovery for candidates, efficient management for employers, and robust oversight for admins while engineering a sophisticated **Hybrid Architecture** under the hood. It features a high-performance **Angular 18** frontend backed by a hybrid **PHP/MySQL** architecture, offering a unified identity experience across social and native login methods.

### 🚀 Why JobNet Exists?
JobNet was built to model how a real-world job platform should function not as a UI prototype, but as a working system. Rather than chasing visual polish early, the focus was on:
* **Correct business logic** and predictable behavior.
* **Clear data flow** between the frontend and the relational backend.
* **End-to-end workflows** that actually work (Auth, Posting, Applying).

The result is a system that is practical, understandable, and ready to grow.
And unlike standard job boards, JobNet implements a **Dual-Pipeline Identity System**. It allows users to authenticate via **Native Email/Password** (stored in MySQL) OR **Social Providers** (via Firebase), while a background synchronization engine ensures both methods resolve to a single, consistent User Profile.

### ✨ Key Architectural Features (The Engineering)
While the UI is minimalist, the backend logic is production-grade:
* **Hybrid Auth Bridge:** A sophisticated synchronization layer that merges **Firebase UIDs** (Social) with **MySQL Records** (Native). This allows for advanced features like account linking (connecting a Google account to an existing Email profile).
* **Dynamic Salary Normalization:** Intelligent search algorithms that normalize salaries (USD, NGN, GBP, EUR) in real-time, allowing accurate "Sort by Salary" filtering across different economic zones.
* **Polymorphic User Systems:** Strict data segregation between `Job Seekers` (Resume-centric) and `Employers` (Company-centric) using Class Table Inheritance.
* **Asset Offloading:** Integrated **Cloudinary** pipeline for optimizing and serving user CVs and Company Logos.

### 🛠️ Tech Stack
* **Frontend:** Angular 18+, RxJS, Bootstrap 5
* **Authentication:** Dual-Strategy (Firebase Social + Native PHP/MySQL), JWT
* **Backend:** Native PHP 8.2 (API-First Architecture)
* **Database:** MySQL 8.0 (Aiven Cloud)
* **Storage:** Cloudinary API
* **Infrastructure:** Dockerized Apache environment

### ⚡ Quick Start

**Prerequisites:** Node.js v18+, NPM.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/SlinkyCollins/job-portal-frontend.git
    cd job-portal-frontend
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `src/environments/environment.ts` file with your API and Firebase config:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:8080/api', // Pointing to your PHP Backend
      firebaseConfig: { ... }
    };
    ```

4.  **Run Development Server**
    ```bash
    ng serve
    ```
    Navigate to `http://localhost:4200`.

### 📸 Application Preview
| Candidate Dashboard | Employer Analytics |
|:---:|:---:|
| <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4fdac4b5-ed25-4f1c-a64f-5ce3ced45138" /> | <img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d001b1cc-e015-4c1f-9974-0931fd0606e1" />

---
*Built with ❤️ by Collynx*

> **🚀 Roadmap**
> * [ ] Real-time WebSocket Notifications
> * [ ] AI-Powered Resume Scoring
> * [ ] Integrated Chat for Interview Scheduling

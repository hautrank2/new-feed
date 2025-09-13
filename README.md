# NEW FEED app

A **Next.js (App Router)** demo app that mimics a tiny social network. It includes **Feed viewing**, **Feed filtering**, **Google sign-in**, **Mock Data & Mock API**, **Comments**, and **Likes**.

## ✨ Features

- **Feed**
  - Browse posts with images, title, description, author, timestamp.
  - **Filter** by keyword / author / date range (configurable).
- **Interactions**
  - **Like/Unlike** (keeps a `tym` array of user IDs).
  - **Comment** + reply (tree up to depth 2).
- **Auth**
  - **Google sign-in** via **NextAuth**.
- **Mock Data & API**

  - JSON files in `src/data/*`.
  - Route Handlers under `/app/api/*` read/write those JSON files.

    > ⚠️ Mock data policy: `src/data` is **live** (it changes when you interact: like, comment, delete, etc.).  
    > A backup lives at `src/data2`. To **reset** the app data, **copy everything from `src/data2` into `src/data`**.

## 🧱 Tech Stack

- **Next.js 15** (App Router), **React 19**, **TypeScript**
- **NextAuth** (Google Provider)
- **TailwindCSS** (and/or **shadcn/ui**)
- **Jest** + **@testing-library/react**
- **ESLint** & **Prettier**

## How to run

First, run the development server:

1. **Clone**
   ```bash
   git clone <YOUR-REPO-URL>.git
   cd <YOUR-PROJECT-FOLDER>
   ```
2. **Install**

   ```bash
   npm install
   ```

3. **Create .env file**
   - At root, create the .env file provided earlier or contact me (hautrantrung.02@gmail.com) to receive the file
4. **Run dev**

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

Video demo: [youtube](https://www.youtube.com/watch?v=SqtUhSUSMRE)

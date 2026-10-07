# Fireflies.ai Clone - Meeting Notes & Transcription Platform

A full-stack meeting assistant and transcription web application that replicates the core design, user experience, and post-meeting workflows of Fireflies.ai[cite: 2, 3].

## Tech Stack

* **Frontend:** Next.js (TypeScript, Tailwind CSS, Lucide Icons)
* **Backend:** Python with FastAPI, SQLAlchemy[cite: 3]
* **Database:** SQLite (Relational Schema)[cite: 3]

---

## Architecture Overview

The application follows a decoupled client-server architecture:
* **Backend (`/backend`)**: Built with FastAPI, providing RESTful endpoints for meeting management, action items tracking, and transcript segmentation. Data is persisted using SQLAlchemy ORM with SQLite[cite: 3].
* **Frontend (`/frontend`)**: Built with Next.js App Router and TypeScript, utilizing Tailwind CSS to achieve high visual similarity to Fireflies' modern dark-themed workspace[cite: 3, 4]. Features bidirectional synchronization between the interactive transcript and HTML5 audio player[cite: 3].

---

## Database Schema

The database consists of three core relational tables:

1. **`meetings` Table**
   * `id` (Integer, Primary Key)
   * `title` (String, Required)
   * `date` (DateTime)
   * `duration_seconds` (Integer)
   * `participants` (String)
   * `audio_url` (String, Optional)
   * `summary` (Text, AI-generated overview)
   * `topics` (Text, Key tags)

2. **`transcript_segments` Table** (Many-to-One with `meetings`)
   * `id` (Integer, Primary Key)
   * `meeting_id` (Foreign Key -> `meetings.id`)
   * `speaker` (String)
   * `start_time` (Float, timestamp in seconds)
   * `end_time` (Float, timestamp in seconds)
   * `text` (Text)

3. **`action_items` Table** (Many-to-One with `meetings`)
   * `id` (Integer, Primary Key)
   * `meeting_id` (Foreign Key -> `meetings.id`)
   * `text` (String)
   * `assignee` (String, Optional)
   * `completed` (Boolean)

---

## Setup & Local Installation Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)<Artnd342>/fireflies-clone.git
cd fireflies-clone
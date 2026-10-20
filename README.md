
# MCitizen - Public Service Request System (Mini eCitizen)

A full-stack web application prototype built for the **Murang'a County Government**. This system allows citizens to submit service requests, report issues, and track their resolution status, while providing county administrators with an intuitive dashboard to manage, update, and resolve these cases.

## 🔗 Live Links & Submission

* **Live Application (Render):** [PASTE YOUR RENDER LINK HERE]
* **GitHub Repository:** [github.com/Prine-Davy/muranga-ecitizen](https://github.com/Prine-Davy/muranga-ecitizen)

## 🔐 Test Credentials for Evaluation

* **Admin Dashboard Access:**
  * **Email:** `admin@muranga.go.ke`
  * **Password:** `Admin@12345`
  * *(Note: For ease of testing, the Admin OTP is displayed on the screen in demo mode).*
* **Citizen Portal Access:**
  * Please register a new account using your own email address. You will receive a **real 6-digit OTP code** via Gmail to verify your account.

## Core Features

* **Citizen Registration & Login:** Secure authentication with strict password requirements (min 8 chars, upper, lower, number, special). Passwords are hashed using `bcrypt`.
* **Submit Requests:** Citizens can select a category, specific sub-category, their constituency/ward, provide exact location details (landmark), write a description, and upload an optional photo for evidence.
* **Admin Dashboard:** Administrators can view all requests, search/filter by name, status, or category, and update the status of a ticket.
* **Status Tracking:** Requests flow through `Pending` ➔ `In Progress` ➔ `Resolved`.
* **Basic Analytics:** Real-time dashboard showing the number of Total Open Cases vs. Total Resolved Cases.

## Bonus Features

* **Real Email OTP Verification:** Integrated with Nodemailer (Gmail SMTP) for secure account creation and login.
* **Full Localization (English / Swahili):** A custom JavaScript i18n dictionary allows users to switch languages instantly without reloading the page.
* **Accessibility Toolbar:** Built-in features for visual impairments, including High Contrast Mode, Text Resizing, and a Dyslexia-Friendly Font.
* **Dynamic Backgrounds:** The landing and citizen dashboards rotate through a set of localized images, with a graceful fallback to the official Murang'a County green if images fail to load.
* **Secure Password Reset:** Token-based password reset flow sent directly via email.
* **Help & Support Widget:** A floating support card with contact information.

## Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (No frameworks used to demonstrate core DOM manipulation).
* **Backend:** Node.js, Express.js
* **Database:** SQLite3 (Relational database handling users, tickets, and OTP/Reset tokens).
* **Security & Middleware:** bcryptjs (Password hashing), multer (File uploads), nodemailer (Email delivery), express-session (Session management).

## Local Setup Instructions

To run this project locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Prine-Davy/muranga-ecitizen
   cd muranga-ecitizen
   ```

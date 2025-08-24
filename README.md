# 📱 Phone Number Payments

A simple system that allows users to **send and receive mock cryptocurrency using phone numbers instead of complex wallet addresses**. This project is designed to showcase a simplified, mobile-first payment experience.

This MVP uses an **off-chain phone-to-wallet mapping** for speed and seamless onboarding. It's built with a modern tech stack and designed for scalability.

---

## 🚀 Features

-   **Seamless Phone Number Payments**: Send crypto to any contact without needing to copy-paste long, hexadecimal wallet addresses.
-   **Simple & Intuitive UI**: A clean, modern interface built with React and Next.js makes sending and receiving payments effortless.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js (React) for a fast, server-rendered user interface.
- **Styling**: Tailwind CSS for a utility-first, modern design system.
- **Components**: ShadCN UI for beautiful, accessible components.
- ** New Improvvements**

---

## 📂 Project Structure
A clear and organized project structure to separate concerns.

```
phone-payments/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components
│   └── lib/          # Helper functions
├── public/           # Static assets (e.g., favicon)
└── README.md         # This file
```

---

## ⚙️ How It Works (Conceptual)

The system is designed to be simple and secure.

1.  **User Registration (Linking Phone to Wallet)**
    - A user enters their phone number on the frontend.
    - The user connects their crypto wallet.
    - A backend service would verify ownership and store a `(phoneHash, walletAddress)` pair in a database.

2.  **Sending Payments**
    - A sender enters the recipient’s phone number and the amount to send.
    - The frontend calls a backend API to resolve the phone number to a wallet address.
    - The frontend then prompts the sender to sign and send a standard blockchain transaction.

---

## 🏗 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

###  Setup
```bash
# Clone the repository
git clone https://github.com/qasim-rokeeb/wallet-resolver
cd wallet resolver

# Install dependencies
npm install

# Run the development server
npm run dev
```


---

## 📄 License
This project is licensed under the MIT License.

## 🙌 Support
Contact Rokeeb at https://x.com/qasimrokeebs

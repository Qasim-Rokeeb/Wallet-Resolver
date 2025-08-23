# 📱 Smart Wallet with Phone Number Payments

A simple but powerful smart wallet system that allows users to **send and receive cryptocurrency using phone numbers instead of complex wallet addresses**. This project is designed to lower the barrier to entry for new crypto users by providing a familiar, mobile-first experience.

This MVP uses an **off-chain phone-to-wallet mapping** for speed, low cost, and seamless onboarding. It's built with a modern tech stack and designed for scalability.

---

## 🚀 Features

-   **Seamless Phone Number Payments**: Send crypto to any contact without needing to copy-paste long, hexadecimal wallet addresses.
-   **Instant User Onboarding**: New users can receive funds even before they've created a wallet. The system can hold funds in escrow until they sign up.
-   **Secure OTP Verification**: Phone number ownership is verified using a one-time password (OTP), ensuring only the legitimate owner can link a wallet.
-   **Non-Custodial Wallet Integration**: Works with popular non-custodial wallets like MetaMask, Trust Wallet, or any WalletConnect-compatible wallet. Users always control their keys.
-   **Secure & Private**: Phone numbers are hashed and salted before being stored in the database, ensuring user privacy.
-   **Simple & Intuitive UI**: A clean, modern interface built with React and Next.js makes sending and receiving payments effortless.

---

## 🛠 Tech Stack

### Backend
- **Framework**: Node.js with Express for building the REST API.
- **Database**: PostgreSQL for storing the phone hash-to-wallet mappings. Can be swapped for MongoDB or other databases.
- **OTP Service**: Firebase Authentication or Twilio for sending SMS verification codes.
- **Security**: `bcrypt` for hashing and salting phone numbers.

### Frontend
- **Framework**: Next.js (React) for a fast, server-rendered user interface.
- **Wallet Integration**: Ethers.js or Wagmi for interacting with the Ethereum blockchain and user wallets.
- **Styling**: Tailwind CSS for a utility-first, modern design system.
- **State Management**: React Hooks and Context for managing application state.

---

## 📂 Project Structure
A clear and organized project structure to separate concerns.

```
smart-wallet-phone-payments/
├── backend/            # Node.js API server
│   ├── src/
│   │   ├── controllers/  # Request handling logic
│   │   ├── routes/       # API endpoints (e.g., /register, /resolve)
│   │   ├── services/     # Business logic (hashing, OTP)
│   │   └── models/       # Database schemas
│   ├── .env              # Environment variables
│   └── server.js         # Main server entry point
├── frontend/           # React/Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js App Router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── lib/          # Helper functions (wallet utils)
│   │   └── hooks/        # Custom React hooks
│   └── next.config.js    # Next.js configuration
└── README.md           # This file
```

---

## ⚙️ How It Works

The system is designed to be simple and secure.

1.  **User Registration (Linking Phone to Wallet)**
    - A user enters their phone number on the frontend.
    - The frontend sends the phone number to the backend API (`POST /register/start`).
    - The backend generates an OTP and sends it to the user's phone via an SMS service (e.g., Twilio).
    - The user enters the received OTP on the frontend.
    - The user connects their crypto wallet (e.g., MetaMask).
    - The frontend sends the `phone`, `otp`, and `walletAddress` to the backend (`POST /register/verify`).
    - The backend verifies the OTP. On success, it generates a **hash and salt** of the phone number and stores the `(phoneHash, walletAddress)` pair in the database.

2.  **Sending Payments**
    - A sender enters the recipient’s phone number and the amount to send.
    - The frontend calls the backend API to resolve the phone number (`GET /resolve?phone=+234...`).
    - The backend hashes the provided phone number and looks up the corresponding wallet address in the database.
    - If a mapping is found, the backend returns the recipient's `walletAddress`.
    - The frontend then prompts the sender to sign and send a standard blockchain transaction directly from their wallet to the recipient's address.

---

## 🔒 Security Considerations

-   **Hashing**: Phone numbers are **never stored in plain text**. They are always hashed and salted using a strong algorithm like bcrypt.
-   **Authentication**: API endpoints that perform sensitive actions are protected.
-   **Non-Custodial**: The system never has access to user private keys. All transactions are signed on the client-side by the user.
-   **Rate Limiting**: API endpoints (especially for OTP generation) should have rate limiting to prevent abuse.

---

## 📡 API Endpoints

**`POST /register/start`**

-   Initiates the phone number verification process.
-   **Body**: `{ "phone": "+2348012345678" }`
-   **Response**: `{ "message": "OTP sent successfully" }`

**`POST /register/verify`**

-   Verifies the OTP and links the phone number to a wallet address.
-   **Body**: `{ "phone": "+2348012345678", "otp": "123456", "walletAddress": "0xAbC123..." }`
-   **Response**: `{ "message": "Wallet successfully linked" }`

**`GET /resolve?phone=+2348012345678`**

-   Resolves a phone number to its linked wallet address.
-   **Response (Success)**: `{ "walletAddress": "0xAbC123..." }`
-   **Response (Not Found)**: `404 Not Found` with `{ "error": "Phone number not registered" }`

---

## 🏗 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- A PostgreSQL database instance

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/smart-wallet-phone-payments.git
cd smart-wallet-phone-payments
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Copy the example environment file
cp .env.example .env

# Edit .env and add your database connection string and OTP service credentials
# DATABASE_URL="postgresql://user:password@host:port/database"
# TWILIO_ACCOUNT_SID="..."
# TWILIO_AUTH_TOKEN="..."
# TWILIO_PHONE_NUMBER="..."

# Run the server
npm start
```

### 3️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# The frontend will connect to the backend API running on localhost
npm run dev
```
The application will be available at `http://localhost:3000`.

---

## 📌 Next Steps

-   [ ] **ERC-20 Token Support**: Allow sending and receiving popular ERC-20 tokens.
-   [ ] **Escrow for Unregistered Users**: Implement a system to hold funds for users who haven't registered yet.
-   [ ] **Contact Book Integration**: Allow users to sync their phone contacts for easier sending.
-   [ ] **Transaction History**: Display a list of past transactions for the connected wallet.
-   [ ] **Cross-Chain Support**: Extend the service to work with other EVM-compatible chains.

---

## 📄 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

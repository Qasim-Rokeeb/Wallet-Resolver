
# 📱 Smart Wallet with Phone Number Payments

A simple smart wallet system that allows users to **send and receive crypto using phone numbers instead of wallet addresses**.

This MVP uses an **off-chain phone → wallet mapping** for speed, low cost, and easy onboarding.  
It includes:
- A Solidity smart contract for ETH transfers
- A Node.js backend API for phone number resolution
- A React frontend for sending/receiving payments

---

## 🚀 Features
- **Phone Number Payments** — send ETH using a phone number.
- **OTP Verification** — verify phone ownership before linking to wallet.
- **Secure Mapping** — store hashed + salted phone numbers in database.
- **Low Gas Costs** — no on-chain registry required.
- **Easy Setup** — works with MetaMask, WalletConnect, or any EVM wallet.

---

## 🛠 Tech Stack
### Smart Contract
- Solidity (0.8.x)
- Hardhat

### Backend
- Node.js + Express
- PostgreSQL / MongoDB
- Firebase Auth or Twilio for OTP

### Frontend
- React / Next.js
- Ethers.js / Wagmi for wallet integration
- Tailwind CSS for styling

---

## 📂 Project Structure
```

smart-wallet-phone-payments/
├── backend/            # Node.js API server
│   ├── routes/         # API endpoints (register, resolve)
│   ├── db/             # Database models
│   └── server.js       # Main server entry
├── contracts/          # Solidity smart contracts
│   └── SimpleWalletSender.sol
├── frontend/           # React/Next.js frontend
│   ├── pages/          # Send & Claim pages
│   ├── components/     # UI components
│   └── utils/          # Wallet interaction helpers
└── README.md           # This file

````

---

## ⚙️ How It Works
1. **User Registration**
   - User enters phone number in frontend.
   - Backend sends OTP (via Firebase Auth or Twilio).
   - User verifies OTP → backend saves `hash(phone)` → `walletAddress` in DB.

2. **Sending Payments**
   - Sender inputs recipient’s phone number.
   - Frontend calls `GET /resolve` → backend returns wallet address.
   - Frontend calls smart contract `sendETH()` with recipient’s address.

3. **Receiving Payments**
   - If registered: funds go directly to linked wallet.
   - If not registered: backend can hold payment in escrow until registration.

---

## 🔒 Security Considerations
- Phone numbers are **hashed + salted** before storage.
- API endpoints require authentication for sending funds.
- Smart contract is minimal to reduce attack surface.

---

## 📜 Smart Contract Example
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleWalletSender {
    function sendETH(address payable _to) public payable {
        require(msg.value > 0, "No ETH sent");
        _to.transfer(msg.value);
    }
}
````

---

## 📡 API Endpoints

**POST /register**

```json
{
  "phone": "+2348012345678",
  "walletAddress": "0xAbC123..."
}
```

* Verifies OTP before saving mapping.

**GET /resolve?phone=+2348012345678**

```json
{
  "walletAddress": "0xAbC123..."
}
```

---

## 🏗 Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smart-wallet-phone-payments.git
cd smart-wallet-phone-payments
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm start
```

* Configure DB connection & OTP service in `.env`.

### 3️⃣ Smart Contract

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📌 Next Steps

* Add ERC-20 token support
* Implement account recovery
* Build escrow logic for unregistered numbers
* Enable cross-chain support

---

## 📄 License

MIT License — feel free to use and modify.

---


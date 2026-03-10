# PolkaInvest – DeFi on Polkadot Hub TestNet

**PolkaInvest** is a decentralized application (dApp) for discovering and investing in curated crypto strategies (“Decks”) on **Polkadot Hub TestNet**. Connect your Web3 wallet to browse community- and platform-created strategies, invest with the platform token (PTK), track performance, withdraw profits, and create your own Decks. An integrated AI provides snapshot-based deck analysis to support your decisions.


This platform allows you to browse various investment approaches, from yield farming to growth token baskets, all within the Rootstock ecosystem which leverages Bitcoin's security. Invest using the platform's native token (PTK), track your portfolio's performance, withdraw profits, and even create your own Decks for others to join. An integrated AI provides snapshot overviews of deck statistics to offer additional perspective.

<img width="1688" height="826" alt="image" src="https://github.com/user-attachments/assets/889fd3f8-7f5c-46bd-9740-67dbda0c6c76" />


## Core Features

| Feature | Description |
|--------|-------------|
| **Dashboard** | Token balance (PTK), total invested value, and quick access to decks. |
| **Decks** | Browse, search, and filter on-chain investment decks with key metrics. |
| **Deck Detail** | View stats, description, TVL, profit, min investment; invest with PTK; AI snapshot overview. |
| **Portfolio** | Track active investments and withdraw profits. |
| **Create Deck** | Define a new strategy, pay creation fee, and submit for approval. |
| **Buy Token** | Swap native **PAS** for the platform token **PTK** in-app. |



## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19  
- **Styling:** Tailwind CSS 4  
- **Web3:** wagmi, viem, RainbowKit  
- **Charts / 3D:** Chart.js, React Three Fiber  
- **AI (snapshot analysis):** Google Gemini API (e.g. Gemini 2.0 Flash)


## Network

The app is configured for **Polkadot Hub TestNet**:

| Item | Value |
|------|--------|
| **Network** | Polkadot Hub TestNet |
| **Chain ID** | `420420417` |
| **Native currency** | PAS |
| **RPC (default)** | `https://eth-rpc-testnet.polkadot.io/` |
| **Block explorer** | [Blockscout Testnet](https://blockscout-testnet.polkadot.io/) |

Ensure your wallet (e.g. MetaMask) is connected to this network to use the dApp.


## Getting Started

### Prerequisites

- Node.js 18+  
- npm or yarn

### Install & run

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Connect your wallet to **Polkadot Hub TestNet** and use testnet PAS to buy PTK and invest in Decks.

### Build for production

```bash
cd client
npm run build
npm start
```



## UI Components




### 1. Dashboard  
User control panel showing balances, usage stats, and quick navigation.  

<img width="1803" height="675" alt="image" src="https://github.com/user-attachments/assets/162f1472-ab08-454d-bd74-9153a706247d" />


### 2. Decks List  
Searchable grid/list of all on-chain decks, with key metrics (returns, risk, entry cost).  

<img width="1756" height="516" alt="image" src="https://github.com/user-attachments/assets/da44c30e-5c31-42ed-ab17-46fd697a203c" />


### 3. Portfolio  
Personal summary of invested decks, profits, and withdrawal options.  

<img width="1734" height="539" alt="image" src="https://github.com/user-attachments/assets/ade879f4-6653-4a80-b9f0-7451695d40e2" />


### 4. Deck Creation  
Form-based UI to define strategy parameters, pay creation fee, and submit for approval. 

<img width="1639" height="721" alt="image" src="https://github.com/user-attachments/assets/47ecf6a3-1910-4d26-a6ec-30a8932d95b5" />


### 5. Buy Token  

In-app swap interface to buy the platform’s token with PAS.  

<img width="1729" height="538" alt="image" src="https://github.com/user-attachments/assets/16cb9cfd-2ec1-4e72-ba11-5996d5b120e9" />





## Deploy Link

Live demo: 





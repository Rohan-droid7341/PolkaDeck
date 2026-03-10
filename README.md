# PolkaInvest – DeFi on Polkadot Hub TestNet

**PolkaInvest** is a decentralized application (dApp) for discovering and investing in curated crypto strategies (“Decks”) on **Polkadot Hub TestNet**. Connect your Web3 wallet to browse community- and platform-created strategies, invest with the platform token (PTK), track performance, withdraw profits, and create your own Decks. An integrated AI provides snapshot-based deck analysis to support your decisions.


This platform allows you to browse various investment approaches, from yield farming to growth token baskets, all within the Rootstock ecosystem which leverages Bitcoin's security. Invest using the platform's native token (PTK), track your portfolio's performance, withdraw profits, and even create your own Decks for others to join. An integrated AI provides snapshot overviews of deck statistics to offer additional perspective.



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

### 1. Landing Page  
A clean welcome screen prompting users to connect their wallet and start exploring.  



### 2. Dashboard  
User control panel showing balances, usage stats, and quick navigation.  


### 3. Decks List  
Searchable grid/list of all on-chain decks, with key metrics (returns, risk, entry cost).  



### 4. Portfolio  
Personal summary of invested decks, profits, and withdrawal options.  



### 5. Deck Creation  
Form-based UI to define strategy parameters, pay creation fee, and submit for approval. 



### 6. Buy Token  

In-app swap interface to buy the platform’s token with RTBTC.  






## Deploy Link

Live demo: [click here](https://farming-protocol.vercel.app/)





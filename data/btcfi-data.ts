export interface Protocol {
  protocol: string;
  type: string;
  apy_min: number;
  apy_max: number;
  current_apy: number;
  tvl: string;
  risk_level: string;
  security_score: number;
  logo: string;
  features: string[];
  description: string;
}

export interface RouteExample {
  name: string;
  description: string;
  allocation: {
    protocol: string;
    percentage: number;
    apy: number;
  }[];
  total_apy: number;
  risk_score: number;
  type: string;
}

export interface BtcFiData {
  btc_price: number;
  user_portfolio: {
    total_btc: number;
    total_usd: number;
    current_apy: number;
    target_apy: number;
  };
  native_btc: Protocol[];
  wrapped_btc: Protocol[];
  route_examples: RouteExample[];
}

export const BTCFI_DATA: BtcFiData = {
  "btc_price": 43000,
  "user_portfolio": {
    "total_btc": 10.5,
    "total_usd": 451500,
    "current_apy": 12.3,
    "target_apy": 15
  },
  "native_btc": [
    {
      "protocol": "Babylon Labs",
      "type": "Native Staking",
      "apy_min": 5,
      "apy_max": 8,
      "current_apy": 6.2,
      "tvl": "$2B+",
      "risk_level": "Low-Medium",
      "security_score": 9,
      "logo": "🔒",
      "features": ["Self-custodial", "EOTS signatures", "Validator rewards"],
      "description": "Native Bitcoin staking without wrapping"
    },
    {
      "protocol": "Stacks sBTC",
      "type": "Bitcoin L2",
      "apy_min": 5,
      "apy_max": 9.94,
      "current_apy": 7.8,
      "tvl": "$545M",
      "risk_level": "Low-Medium",
      "security_score": 8,
      "logo": "📚",
      "features": ["Smart contracts", "100% BTC finality", "No lock-up"],
      "description": "Bitcoin smart contracts with full finality"
    },
    {
      "protocol": "CoreDAO",
      "type": "Dual Staking",
      "apy_min": 0.2,
      "apy_max": 6,
      "current_apy": 4.5,
      "tvl": "$845M",
      "risk_level": "Low",
      "security_score": 7,
      "logo": "⚡",
      "features": ["No slashing", "Institutional grade", "CLTV timelocks"],
      "description": "Bitcoin dual staking with institutional adoption"
    }
  ],
  "wrapped_btc": [
    {
      "protocol": "wBTC Aave",
      "type": "Lending",
      "apy_min": 3,
      "apy_max": 4,
      "current_apy": 3.5,
      "tvl": "$2B+",
      "risk_level": "Medium",
      "security_score": 8,
      "logo": "🌐",
      "features": ["Established DeFi", "High liquidity", "BitGo custody"],
      "description": "Wrapped Bitcoin lending on Ethereum DeFi"
    },
    {
      "protocol": "wBTC Uniswap",
      "type": "Liquidity Mining",
      "apy_min": 8,
      "apy_max": 15,
      "current_apy": 11.5,
      "tvl": "$1.5B+",
      "risk_level": "High",
      "security_score": 7,
      "logo": "🦄",
      "features": ["High yields", "Trading fees", "Impermanent loss risk"],
      "description": "Liquidity provision for high returns"
    },
    {
      "protocol": "FBTC Vaults",
      "type": "Yield Farming",
      "apy_min": 2,
      "apy_max": 8,
      "current_apy": 6.2,
      "tvl": "$800M+",
      "risk_level": "Medium",
      "security_score": 7,
      "logo": "🔥",
      "features": ["Multi-chain", "Yield focused", "Various vaults"],
      "description": "Multi-chain yield farming optimization"
    },
    {
      "protocol": "Lombard LBTC",
      "type": "Liquid Staking",
      "apy_min": 6,
      "apy_max": 8,
      "current_apy": 7.2,
      "tvl": "$200M+",
      "risk_level": "Medium",
      "security_score": 8,
      "logo": "💎",
      "features": ["Babylon staking", "DeFi composable", "Liquid"],
      "description": "Liquid Bitcoin staking token"
    }
  ],
  "route_examples": [
    {
      "name": "Conservative Native",
      "description": "Focus on native Bitcoin solutions with minimal risk",
      "allocation": [
        {"protocol": "Babylon Labs", "percentage": 40, "apy": 6.2},
        {"protocol": "Stacks sBTC", "percentage": 35, "apy": 7.8},
        {"protocol": "CoreDAO", "percentage": 25, "apy": 4.5}
      ],
      "total_apy": 6.3,
      "risk_score": 3.2,
      "type": "conservative"
    },
    {
      "name": "Balanced Multi-Chain",
      "description": "Mix of native and wrapped for optimal risk/reward",
      "allocation": [
        {"protocol": "Babylon Labs", "percentage": 30, "apy": 6.2},
        {"protocol": "wBTC Aave", "percentage": 25, "apy": 3.5},
        {"protocol": "FBTC Vaults", "percentage": 25, "apy": 6.2},
        {"protocol": "Lombard LBTC", "percentage": 20, "apy": 7.2}
      ],
      "total_apy": 5.8,
      "risk_score": 5.1,
      "type": "balanced"
    },
    {
      "name": "Aggressive DeFi",
      "description": "Maximum yield through DeFi protocols",
      "allocation": [
        {"protocol": "wBTC Uniswap", "percentage": 40, "apy": 11.5},
        {"protocol": "FBTC Vaults", "percentage": 30, "apy": 6.2},
        {"protocol": "Lombard LBTC", "percentage": 30, "apy": 7.2}
      ],
      "total_apy": 8.6,
      "risk_score": 7.8,
      "type": "aggressive"
    }
  ]
};

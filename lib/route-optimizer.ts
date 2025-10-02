
import { BTCFI_DATA, Protocol } from "@/data/btcfi-data";

export interface Allocation {
    protocol: string;
    percentage: number;
    apy: number;
    logo: string;
    type: string;
    risk_level: string;
}

export interface OptimizedRoute {
    name: string;
    description: string;
    allocation: Allocation[];
    total_apy: number;
    risk_score: number;
    annual_yield: number;
    monthly_yield: number;
}

function buildAllocation(protocols: Protocol[], percentages: number[]): Allocation[] {
    if (protocols.length === 0) return [];

    const allocation: Allocation[] = [];
    let remainingPercentage = 100;

    for (let i = 0; i < Math.min(protocols.length, percentages.length); i++) {
        const percentage = i === percentages.length - 1 ? remainingPercentage : percentages[i];
        allocation.push({
            protocol: protocols[i].protocol,
            percentage: percentage,
            apy: protocols[i].current_apy,
            logo: protocols[i].logo,
            type: protocols[i].type,
            risk_level: protocols[i].risk_level
        });
        remainingPercentage -= percentage;
    }

    return allocation;
}

function calculateWeightedAPY(allocation: Allocation[]): number {
    const totalAPY = allocation.reduce((sum, item) => sum + (item.apy * item.percentage / 100), 0);
    return Math.round(totalAPY * 10) / 10;
}

function calculateRiskScore(allocation: Allocation[]): number {
    const riskMap: { [key: string]: number } = { 'Low': 2, 'Low-Medium': 4, 'Medium': 6, 'High': 8 };
    const totalRisk = allocation.reduce((sum, item) => {
        const riskValue = riskMap[item.risk_level] || 5;
        return sum + (riskValue * item.percentage / 100);
    }, 0);
    return Math.round(totalRisk * 10) / 10;
}

function generateConservativeRoutes(protocols: Protocol[]): Omit<OptimizedRoute, 'total_apy' | 'risk_score' | 'annual_yield' | 'monthly_yield'>[] {
    const conservativeProtocols = protocols.filter(p =>
        p.risk_level === 'Low' || p.risk_level === 'Low-Medium'
    );

    return [
        {
            name: "Safe Native Focus",
            description: "Emphasis on native Bitcoin with low risk",
            allocation: buildAllocation(conservativeProtocols, [40, 35, 25])
        },
        {
            name: "Diversified Conservative",
            description: "Spread across multiple low-risk protocols",
            allocation: buildAllocation(conservativeProtocols, [30, 25, 20, 15, 10])
        },
        {
            name: "Stability First",
            description: "Maximum security with steady returns",
            allocation: buildAllocation(conservativeProtocols, [50, 30, 20])
        }
    ];
}

function generateBalancedRoutes(protocols: Protocol[]): Omit<OptimizedRoute, 'total_apy' | 'risk_score' | 'annual_yield' | 'monthly_yield'>[] {
    return [
        {
            name: "Optimal Balance",
            description: "Perfect mix of native and wrapped protocols",
            allocation: buildAllocation(protocols, [25, 25, 20, 15, 15])
        },
        {
            name: "Native-Wrapped Split",
            description: "Equal allocation between native and wrapped BTC",
            allocation: buildAllocation(protocols, [30, 25, 25, 20])
        },
        {
            name: "Yield-Risk Balanced",
            description: "Optimized for balanced risk-adjusted returns",
            allocation: buildAllocation(protocols, [35, 25, 20, 20])
        }
    ];
}

function generateAggressiveRoutes(protocols: Protocol[]): Omit<OptimizedRoute, 'total_apy' | 'risk_score' | 'annual_yield' | 'monthly_yield'>[] {
    const highYieldProtocols = protocols
        .sort((a, b) => b.current_apy - a.current_apy)
        .slice(0, 4);

    return [
        {
            name: "Maximum Yield",
            description: "Highest possible returns across all protocols",
            allocation: buildAllocation(highYieldProtocols, [40, 30, 20, 10])
        },
        {
            name: "DeFi Concentrated",
            description: "Focus on high-yield DeFi opportunities",
            allocation: buildAllocation(protocols.filter(p => p.type.includes('Mining') || p.type.includes('Farming')), [50, 30, 20])
        },
        {
            name: "Risk-Optimized High Yield",
            description: "High returns with calculated risk management",
            allocation: buildAllocation(highYieldProtocols, [30, 30, 25, 15])
        }
    ];
}

export function calculateOptimizedRoutes(
    btcAmount: number,
    riskLevel: string,
    includeNative: boolean,
    includeWrapped: boolean,
    minApy: number
): OptimizedRoute[] {
    let availableProtocols: Protocol[] = [];

    if (includeNative) {
        availableProtocols.push(...BTCFI_DATA.native_btc);
    }
    if (includeWrapped) {
        availableProtocols.push(...BTCFI_DATA.wrapped_btc);
    }

    availableProtocols = availableProtocols.filter(p => p.current_apy >= minApy);

    let routes: Omit<OptimizedRoute, 'total_apy' | 'risk_score' | 'annual_yield' | 'monthly_yield'>[] = [];

    if (riskLevel === 'conservative') {
        routes = generateConservativeRoutes(availableProtocols);
    } else if (riskLevel === 'balanced') {
        routes = generateBalancedRoutes(availableProtocols);
    } else {
        routes = generateAggressiveRoutes(availableProtocols);
    }

    const calculatedRoutes: OptimizedRoute[] = routes.map(route => {
        const total_apy = calculateWeightedAPY(route.allocation);
        const annual_yield = btcAmount * BTCFI_DATA.btc_price * (total_apy / 100);
        return {
            ...route,
            total_apy,
            risk_score: calculateRiskScore(route.allocation),
            annual_yield,
            monthly_yield: annual_yield / 12
        }
    });

    return calculatedRoutes.sort((a, b) => b.total_apy - a.total_apy);
}

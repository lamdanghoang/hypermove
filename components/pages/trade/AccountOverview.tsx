import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTradingData } from "@/services/TradingDataService";

export function AccountOverview() {
    const { balances, positions } = useTradingData();

    // Calculate account equity
    const spotEquity = balances.find((b) => b.asset === "USDC")?.usdValue || 0;
    const perpsEquity = positions.reduce((total, pos) => {
        return total + pos.size * pos.markPrice + pos.pnl;
    }, 0);

    const totalBalance = balances.find((b) => b.asset === "USDC")?.total || 0;
    const totalPnl = positions.reduce((total, pos) => total + pos.pnl, 0);
    const totalPnlPercent =
        totalBalance > 0 ? (totalPnl / totalBalance) * 100 : 0;

    // Calculate margin metrics
    const totalMargin = positions.reduce((total, pos) => total + pos.margin, 0);
    const maintenanceMargin = totalMargin * 0.005; // 0.5% maintenance margin
    const crossAccountLeverage =
        totalMargin > 0
            ? positions.reduce(
                  (total, pos) => total + pos.size * pos.markPrice,
                  0
              ) / totalMargin
            : 0;
    const crossMarginRatio =
        totalBalance > 0 ? (totalBalance / (totalBalance + totalPnl)) * 100 : 0;

    const accountEquityData = [
        { label: "Spot", value: `$${spotEquity.toFixed(2)}` },
        { label: "Perps", value: `$${perpsEquity.toFixed(2)}` },
    ];

    const perpsOverviewData = [
        { label: "Balance", value: `$${totalBalance.toFixed(2)}` },
        {
            label: "Unrealized PNL",
            value: `$${totalPnl.toFixed(2)}`,
            colorClass: totalPnl >= 0 ? "text-green-400" : "text-red-400",
        },
        {
            label: "Cross Margin Ratio",
            value: `${crossMarginRatio.toFixed(2)}%`,
        },
        {
            label: "Maintenance Margin",
            value: `$${maintenanceMargin.toFixed(2)}`,
        },
        {
            label: "Cross Account Leverage",
            value: `${crossAccountLeverage.toFixed(2)}x`,
        },
    ];

    return (
        <div className="col-span-1 bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[459px]">
            <div className="p-2.5 flex flex-col h-full w-full gap-3">
                <ActionButtons />
                <Separator className="bg-slate-400" />
                <AccountDetails
                    accountEquityData={accountEquityData}
                    perpsOverviewData={perpsOverviewData}
                />
            </div>
        </div>
    );
}

function ActionButtons() {
    return (
        <div className="flex flex-col items-stretch gap-2">
            <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                Connect
            </Button>
            <div className="grid grid-cols-2 gap-2">
                <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                    Deposit
                </Button>
                <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                    Withdraw
                </Button>
            </div>
        </div>
    );
}

interface AccountInfo {
    label: string;
    value: string;
    colorClass?: string;
}

interface AccountDetailsProps {
    accountEquityData: AccountInfo[];
    perpsOverviewData: AccountInfo[];
}

function AccountDetails({
    accountEquityData,
    perpsOverviewData,
}: AccountDetailsProps) {
    return (
        <div className="flex flex-col gap-3 text-left">
            <AccountSection title="Account Equity" data={accountEquityData} />
            <AccountSection title="Perps Overview" data={perpsOverviewData} />
        </div>
    );
}

interface AccountSectionProps {
    title: string;
    data: AccountInfo[];
}

function AccountSection({ title, data }: AccountSectionProps) {
    return (
        <div className="flex flex-col gap-2.5">
            <h6 className="text-xs">{title}</h6>
            {data.map((item, index) => (
                <AccountRow
                    key={index}
                    label={item.label}
                    value={item.value}
                    colorClass={item.colorClass}
                />
            ))}
        </div>
    );
}

function AccountRow({
    label,
    value,
    colorClass,
}: {
    label: string;
    value: string;
    colorClass?: string;
}) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{label}</span>
            <span className={colorClass || ""}>{value}</span>
        </div>
    );
}

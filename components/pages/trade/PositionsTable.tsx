import { ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    useTradingData,
    formatPrice,
    formatSize,
    getPriceChangeColor,
} from "@/services/TradingDataService";

const tabsData = [
    { value: "balances", label: "Balances" },
    { value: "positions", label: "Positions" },
    { value: "open-orders", label: "Open Orders" },
    { value: "twap", label: "TWAP" },
    { value: "trade-history", label: "Trade History" },
    { value: "funding-history", label: "Funding History" },
    { value: "order-history", label: "Order History" },
];

const balancesColumns = [
    { key: "coin", label: "Coin", width: "12%" },
    { key: "totalBalance", label: "Total Balance", width: "14%" },
    { key: "availableBalance", label: "Available Balance", width: "14%" },
    { key: "usdcValue", label: "USDC Value", width: "12%", hasIcon: true },
    { key: "pnl", label: "PNL (ROE %)", width: "12%" },
    { key: "send", label: "Send", width: "10%" },
    { key: "transfer", label: "Transfer", width: "14%" },
    { key: "contract", label: "Contract", width: "12%" },
];

const positionsColumns = [
    { key: "coin", label: "Coin", width: "9%" },
    { key: "size", label: "Size", width: "9%" },
    {
        key: "positionValue",
        label: "Position Value",
        width: "9%",
        hasIcon: true,
    },
    { key: "entryPrice", label: "Entry Price", width: "9%" },
    { key: "markPrice", label: "Mark Price", width: "9%" },
    { key: "pnl", label: "PNL (ROE %)", width: "9%" },
    { key: "liqPrice", label: "Liq. Price", width: "9%" },
    { key: "margin", label: "Margin", width: "9%" },
    { key: "funding", label: "Funding", width: "7%" },
    { key: "closeAll", label: "Close All", width: "11%" },
    { key: "tpsl", label: "TP/SL", width: "9%" },
];

export function PositionsTable() {
    const { balances, positions } = useTradingData();

    return (
        <div className="lg:col-span-2 xl:col-span-3 bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[459px]">
            <Tabs defaultValue="balances" className="w-full gap-0 flex-1">
                <TabsHeader />

                <TabsContent className="px-3 py-1 text-white" value="balances">
                    <BalancesTable balances={balances} />
                </TabsContent>

                <TabsContent className="px-3 py-1 text-white" value="positions">
                    <PositionsDataTable positions={positions} />
                </TabsContent>

                {tabsData.slice(2).map((tab) => (
                    <TabsContent
                        key={tab.value}
                        className="px-3 py-1 text-white"
                        value={tab.value}
                    >
                        <div className="text-xs/6 text-left">
                            No data available
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}

function TabsHeader() {
    return (
        <div className="px-3 w-full overflow-auto grid grid-cols-[auto_1fr_auto]">
            <TabsList
                variant="custom"
                className="px-0 py-0 w-full h-fit text-nowrap overflow-x-auto flex-nowrap hide-scrollbar border-b border-slate-700 rounded-none"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {tabsData.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        variant="custom"
                        value={tab.value}
                        className="px-3 py-2.5 text-xs"
                    >
                        {tab.label}
                    </TabsTrigger>
                ))}
            </TabsList>
            <div className="border-b border-slate-700" />
            <FilterDropdown />
        </div>
    );
}

function FilterDropdown() {
    return (
        <div className="flex items-center gap-3 border-b border-slate-700">
            <span className="text-xs">Filter</span>
            <ChevronDown className="w-3.5 h-3.5" />
        </div>
    );
}

function BalancesTable({ balances }: { balances: any[] }) {
    if (balances.length === 0) {
        return <div className="text-xs/6 text-left">No balances yet</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        {balancesColumns.map((column) => (
                            <TableHeader key={column.key} column={column} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {balances.map((balance, index) => (
                        <tr
                            key={balance.asset}
                            className="border-b border-slate-700/30"
                        >
                            <td className="text-left text-xs py-2">
                                {balance.asset}
                            </td>
                            <td className="text-left text-xs py-2">
                                {balance.total.toFixed(2)}
                            </td>
                            <td className="text-left text-xs py-2">
                                {balance.available.toFixed(2)}
                            </td>
                            <td className="text-left text-xs py-2">
                                ${balance.usdValue.toFixed(2)}
                            </td>
                            <td className="text-left text-xs py-2">
                                $0.00 (0.00%)
                            </td>
                            <td className="text-left text-xs py-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                >
                                    Send
                                </Button>
                            </td>
                            <td className="text-left text-xs py-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                >
                                    Transfer
                                </Button>
                            </td>
                            <td className="text-left text-xs py-2">-</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function PositionsDataTable({ positions }: { positions: any[] }) {
    if (positions.length === 0) {
        return <div className="text-xs/6 text-left">No open positions yet</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr>
                        {positionsColumns.map((column) => (
                            <TableHeader key={column.key} column={column} />
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {positions.map((position, index) => (
                        <tr
                            key={`${position.symbol}_${index}`}
                            className="border-b border-slate-700/30"
                        >
                            <td className="text-left text-xs py-2">
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-4 rounded-full bg-sky-400"></div>
                                    {position.symbol}
                                </div>
                            </td>
                            <td className="text-left text-xs py-2">
                                <span
                                    className={
                                        position.side === "long"
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }
                                >
                                    {position.side === "long" ? "+" : "-"}
                                    {formatSize(position.size)}
                                </span>
                            </td>
                            <td className="text-left text-xs py-2">
                                $
                                {(position.size * position.markPrice).toFixed(
                                    2
                                )}
                            </td>
                            <td className="text-left text-xs py-2">
                                {formatPrice(position.entryPrice)}
                            </td>
                            <td className="text-left text-xs py-2">
                                {formatPrice(position.markPrice)}
                            </td>
                            <td
                                className={`text-left text-xs py-2 ${getPriceChangeColor(
                                    position.pnl
                                )}`}
                            >
                                ${position.pnl.toFixed(2)} (
                                {position.pnlPercent.toFixed(2)}%)
                            </td>
                            <td className="text-left text-xs py-2">
                                {formatPrice(position.liquidationPrice)}
                            </td>
                            <td className="text-left text-xs py-2">
                                ${position.margin.toFixed(2)}
                            </td>
                            <td className="text-left text-xs py-2">$0.00</td>
                            <td className="text-left text-xs py-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                >
                                    Close
                                </Button>
                            </td>
                            <td className="text-left text-xs py-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                >
                                    TP/SL
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface Column {
    key: string;
    label: string;
    width: string;
    hasIcon?: boolean;
}

function TableHeader({ column }: { column: Column }) {
    return (
        <th
            className={`w-[${column.width}] max-w-[${column.width}] text-left text-slate-400 text-xs/6 font-normal`}
        >
            {column.hasIcon ? (
                <div className="flex flex-row gap-1 justify-start items-center">
                    <span>{column.label}</span>
                    <ChevronDown className="inline w-3 h-3" />
                </div>
            ) : (
                column.label
            )}
        </th>
    );
}

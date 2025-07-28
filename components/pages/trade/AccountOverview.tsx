import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const accountEquityData = [
    { label: "Spot", value: "$0.00" },
    { label: "Perps", value: "$0.00" },
];

const perpsOverviewData = [
    { label: "Balance", value: "$0.00" },
    { label: "Unrealized PNL", value: "$0.00" },
    { label: "Cross Margin Ratio", value: "0.00%" },
    { label: "Maintenance Margin", value: "$0.00" },
    { label: "Cross Account Leverage", value: "0.00x" },
];

export function AccountOverview() {
    return (
        <div className="col-span-1 bg-gradient-to-br from-transparent via-white/10 to-white/5 text-center rounded-md h-[459px]">
            <div className="p-2.5 flex flex-col h-full w-full gap-3">
                <ActionButtons />
                <Separator className="bg-slate-400" />
                <AccountDetails />
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
                    Spot
                </Button>
                <Button className="py-1.5 h-fit bg-gradient text-gray-800">
                    Withdraw
                </Button>
            </div>
        </div>
    );
}

function AccountDetails() {
    return (
        <div className="flex flex-col gap-3 text-left">
            <AccountSection title="Account Equity" data={accountEquityData} />
            <AccountSection title="Perps Overview" data={perpsOverviewData} />
        </div>
    );
}

interface AccountSectionProps {
    title: string;
    data: Array<{ label: string; value: string }>;
}

function AccountSection({ title, data }: AccountSectionProps) {
    return (
        <div className="flex flex-col gap-2.5">
            <h6 className="text-xs">{title}</h6>
            {data.map((item, index) => (
                <AccountRow key={index} label={item.label} value={item.value} />
            ))}
        </div>
    );
}

function AccountRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{label}</span>
            <span>{value}</span>
        </div>
    );
}

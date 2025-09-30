export default function OverviewCard({
    title,
    value,
    subValue,
    isSuccess = false,
}: {
    title: string;
    value: string;
    subValue: string;
    isSuccess?: boolean;
}) {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 shadow-lg">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {title}
            </h3>
            <div
                className={`text-3xl font-bold ${
                    isSuccess ? "text-green-400" : "text-white"
                }`}
            >
                {value}
            </div>
            <div className="text-sm text-slate-400">{subValue}</div>
        </div>
    );
}

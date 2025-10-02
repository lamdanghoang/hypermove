import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface BTCAssetInfo {
    logo: string; // URL or local path to the token logo
    symbol: string; // e.g., 'aBTC', 'mBTC', 'BTC'
}

export interface CryptoVaultCardProps {
    projectName: string;
    projectLogo: string;
    status: string; // e.g., "4.6% APY" or "COMING SOON"
    btcTypes: BTCAssetInfo[]; // Tokens accepted/used in the vault
    availableAmount: number;
    availableUnit: string;
    stakedAmount: number;
    stakedUnit: string;
    vaultCap: string; // The Total Value Locked (TVL)
    echoPointsMultiplier: number;
    isLive: boolean; // Controls the status banner and button enablement
    onDepositClick?: () => void;
}

const LogoDisplay: React.FC<{ symbol: string; logo: string }> = ({
    symbol,
    logo,
}) => (
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white">
        <Image src={logo} alt={symbol} width={24} height={24} />
    </div>
);

const CryptoVaultCard: React.FC<CryptoVaultCardProps> = ({
    projectName,
    projectLogo,
    status,
    btcTypes,
    availableAmount,
    availableUnit,
    stakedAmount,
    stakedUnit,
    vaultCap,
    echoPointsMultiplier,
    isLive,
    onDepositClick,
}) => {
    // Styles for the status banner
    const statusClasses = isLive
        ? "bg-orange-600 text-white" // For APY (e.g., Aptos)
        : "bg-orange-400 text-black"; // For COMING SOON (e.g., Movement)

    return (
        <div className="w-full h-auto bg-gray-900 border border-gray-700 rounded-lg overflow-hidden font-sans shadow-xl">
            {/* 🔸 Status Banner 🔸 */}
            <div
                className={`p-4 text-center text-lg font-bold ${statusClasses}`}
            >
                {status}
            </div>

            {/* 🔸 Header: Logo & Name 🔸 */}
            <div className="flex items-center p-4">
                {/* Placeholder for Project Logo */}
                <LogoDisplay symbol={projectName} logo={projectLogo} />
                <h3 className="ml-3 text-xl font-semibold text-white">
                    {projectName}
                </h3>
            </div>

            {/* 🔸 Main Content: Staking Details 🔸 */}
            <div className="p-2 pt-0 text-white grid grid-cols-2 gap-4">
                {/* Left Column: BTC Types */}
                <div className="flex flex-col">
                    <p className="text-gray-400 text-sm mb-2">BTC Types</p>
                    <div className="relative w-32 h-32 rounded-full border border-gray-600 bg-black">
                        {(() => {
                            const numIcons = btcTypes.length;
                            if (numIcons === 0) return null;
                            const circleRadius = numIcons > 1 ? 40 : 0; // Center single icon
                            const iconRadius = 16;
                            const center = 64;

                            return btcTypes.map((asset, index) => {
                                const angle = (index / numIcons) * 2 * Math.PI;
                                const left =
                                    center +
                                    circleRadius * Math.cos(angle) -
                                    iconRadius;
                                const top =
                                    center +
                                    circleRadius * Math.sin(angle) -
                                    iconRadius;

                                return (
                                    <div
                                        key={index}
                                        className="absolute"
                                        style={{
                                            top: `${top}px`,
                                            left: `${left}px`,
                                        }}
                                    >
                                        <Image
                                            src={asset.logo}
                                            alt={asset.symbol}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    </div>
                                );
                            });
                        })()}
                    </div>
                </div>

                {/* Right Column: Vault Cap / Amounts */}
                <div className="flex flex-col">
                    <p className="text-gray-400 text-sm mb-2">Vault Cap</p>
                    <div className="flex justify-end">
                        {(() => {
                            const total = availableAmount + stakedAmount;
                            const stakedPercent =
                                total > 0 ? (stakedAmount / total) * 100 : 0;

                            const gradientStyle = {
                                background: `linear-gradient(to top, #8b5cf6 ${stakedPercent}%, #f97316 ${stakedPercent}%)`,
                            };
                            if (stakedPercent === 100)
                                gradientStyle.background = "#8b5cf6";
                            if (stakedPercent === 0)
                                gradientStyle.background = "#f97316";

                            return (
                                <div
                                    className="relative flex h-32 w-32 items-center justify-center rounded-full"
                                    style={gradientStyle}
                                >
                                    <div className="text-center text-white">
                                        <p className="text-xs text-gray-300">
                                            Available
                                        </p>
                                        <p className="text-base font-bold">
                                            {availableAmount.toFixed(2)}{" "}
                                            {availableUnit}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-300">
                                            Staked
                                        </p>
                                        <p className="text-sm">
                                            {stakedAmount.toFixed(2)}{" "}
                                            {stakedUnit}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* 🔸 Footer: TVL and Echo Points 🔸 */}
            <div className="px-4 py-3 border-t border-gray-700 text-white flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-400">Total Value Locked</p>
                    <p className="text-lg font-bold">{vaultCap}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Echo Points</p>
                    <p className="text-lg font-bold">x{echoPointsMultiplier}</p>
                </div>
            </div>

            {/* 🔸 Action Buttons 🔸 */}
            <div className="flex p-4 space-x-2">
                <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-black"
                    onClick={onDepositClick}
                    disabled={!isLive}
                >
                    Deposit
                </Button>
                <Button
                    variant="outline"
                    className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black"
                >
                    Proof of Reserve
                </Button>
            </div>
        </div>
    );
};

export default CryptoVaultCard;

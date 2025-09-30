"use client";

export default function SettingsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-teal-400 bg-clip-text text-transparent">
                    Settings
                </h1>
                <p className="text-slate-400">
                    Customize your HyperMove experience
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Default Route Preferences */}
                <div className="bg-slate-800/50 rounded-lg shadow-lg">
                    <div className="p-6 border-b border-slate-700/50">
                        <h3 className="text-xl font-bold">
                            Default Route Preferences
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="form-group">
                            <label className="form-label">
                                Default Risk Level
                            </label>
                            <select className="form-control">
                                <option value="conservative">
                                    Conservative
                                </option>
                                <option value="balanced" selected>
                                    Balanced
                                </option>
                                <option value="aggressive">Aggressive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Bitcoin Type Preference
                            </label>
                            <select className="form-control">
                                <option value="native">
                                    Prefer Native BTC
                                </option>
                                <option value="mixed" selected>
                                    Mix Native & Wrapped
                                </option>
                                <option value="wrapped">
                                    Prefer Wrapped BTC
                                </option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">
                                Min APY Threshold
                            </label>
                            <div className="flex items-center space-x-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    defaultValue="3"
                                    className="w-full"
                                />
                                <span className="text-teal-400 font-semibold">
                                    3%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications and Theme */}
                <div className="space-y-6">
                    <div className="bg-slate-800/50 rounded-lg shadow-lg">
                        <div className="p-6 border-b border-slate-700/50">
                            <h3 className="text-xl font-bold">Notifications</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <NotificationSetting
                                label="New route opportunities"
                                defaultChecked
                            />
                            <NotificationSetting
                                label="APY changes (>1% difference)"
                                defaultChecked
                            />
                            <NotificationSetting label="New protocol launches" />
                            <NotificationSetting
                                label="Portfolio rebalancing alerts"
                                defaultChecked
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NotificationSetting({
    label,
    defaultChecked = false,
}: {
    label: string;
    defaultChecked?: boolean;
}) {
    return (
        <label className="flex items-center space-x-3 cursor-pointer">
            <input
                type="checkbox"
                defaultChecked={defaultChecked}
                className="h-5 w-5 rounded text-teal-500 focus:ring-teal-500 bg-slate-700 border-slate-600"
            />
            <span className="text-slate-300">{label}</span>
        </label>
    );
}

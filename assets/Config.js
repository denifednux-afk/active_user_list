// src/Config.ts
const defaultConfig = {
    userLifetimeMs: 60000, // 60秒
    highlightMs: 10000, // 10秒
    maxActiveUsers: 30
};
export class ConfigLoader {
    static async load(url) {
        var _a, _b, _c;
        try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const raw = (await res.json());
            return {
                userLifetimeMs: ((_a = raw.userLifetimeSeconds) !== null && _a !== void 0 ? _a : 60) * 1000,
                highlightMs: ((_b = raw.highlightSeconds) !== null && _b !== void 0 ? _b : 10) * 1000,
                maxActiveUsers: (_c = raw.maxActiveUsers) !== null && _c !== void 0 ? _c : 30
            };
        }
        catch (e) {
            console.warn("[active_users_list] config load failed, use default", e);
            return defaultConfig;
        }
    }
}

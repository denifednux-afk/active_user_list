// src/Config.ts

export interface AppConfig {
    userLifetimeMs: number;
    highlightMs: number;
    maxActiveUsers: number;
}

const defaultConfig: AppConfig = {
    userLifetimeMs: 60_000, // 60秒
    highlightMs: 10_000,    // 10秒
    maxActiveUsers: 30
};

export class ConfigLoader {
    static async load(url: string): Promise<AppConfig> {
        try {
            const res = await fetch(url, { cache: "no-store" });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const raw = (await res.json()) as Partial<{
                userLifetimeSeconds: number;
                highlightSeconds: number;
                maxActiveUsers: number;
            }>;

            return {
                userLifetimeMs:
                    (raw.userLifetimeSeconds ?? 60) * 1000,
                highlightMs:
                    (raw.highlightSeconds ?? 10) * 1000,
                maxActiveUsers: raw.maxActiveUsers ?? 30
            };
        } catch (e) {
            console.warn(
                "[active_users_list] config load failed, use default",
                e
            );
            return defaultConfig;
        }
    }
}

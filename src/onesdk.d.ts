// src/onesdk.d.ts

export {};

declare global {
    interface Window {
        OneSDK: {
            ready(): Promise<void>;
            setup(config: { jsonPath: string; commentLimit?: number }): void;
            subscribe(options: {
                action: "comments";
                callback: (events: any[]) => void;
            }): void;
            connect(): void;
        };
    }
}

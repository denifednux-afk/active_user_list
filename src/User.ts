// src/User.ts

// src/User.ts
// src/User.ts
export interface RawComment {
    authorChannelId?: string;
    channelId?: string;
    userId?: string;
    user_id?: string;
    authorId?: string;
    id?: string;

    displayName?: string;
    authorName?: string;
    channelName?: string;
    name?: string;
    author?: string;

    authorPhoto?: string;
    authorProfileImageUrl?: string;

    // ★ ここ追加：わんコメの YouTube コメントで実際に使われているプロパティ
    profileImage?: string;

    comment?: string;
    message?: string;

    timestamp?: number;
    time?: number;
    createdAt?: number | string;
}



/** 1人の視聴者を表すクラス */
export class User {
    readonly id: string;
    name: string;
    icon: string;

    /** 初めて検知された時間 */
    readonly createdAt: number;

    /** 最後にコメントした時間 */
    lastAt: number;

    /** コメント数（ランキングソート用） */
    count: number;

    /** まだ画面に出したばかりかどうか（フェードイン用） */
    isNew: boolean;

    constructor(params: { id: string; name: string; icon: string; now: number }) {
        this.id = params.id;
        this.name = params.name;
        this.icon = params.icon;
        this.createdAt = params.now;
        this.lastAt = params.now;
        this.count = 1;

        // 生成直後は「新規ユーザー」
        this.isNew = true;
    }

    /** 新しいコメントで情報更新 */
    touch(name: string, icon: string, now: number): void {
        this.name = name;
        if (icon) {
            this.icon = icon;
        }
        this.lastAt = now;
        this.count += 1;
        // 再コメントしても isNew は true のままでも false のままでもOK
        // 「初回だけフェードインしたい」ならここでは何もしない
    }

    /** フェードイン表示が終わったら呼ぶ */
    markShown(): void {
        this.isNew = false;
    }

    /** 生成から thresholdMs ミリ秒以上経っているか？ */
    isOlderThan(thresholdMs: number, now: number): boolean {
        return now - this.createdAt > thresholdMs;
    }

    /** 最後のコメントから lifetimeMs ミリ秒以上経っているか？ */
    isExpiredByLastAt(lifetimeMs: number, now: number): boolean {
        return now - this.lastAt > lifetimeMs;
    }
}

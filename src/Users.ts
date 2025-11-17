// src/Users.ts
import { User } from "./User.js";
import type { RawComment } from "./User.js";


export class Users {
    private map = new Map<string, User>();

    constructor(
        private readonly lifeMs: number,       // lastAt からの寿命
        private readonly maxUsers: number      // 表示上限
    ) {}

    /** コメントデータから ID・名前・アイコン を抽出 */
    private extractUserInfo(data: RawComment): {
        id: string;
        name: string;
        icon: string;
    } {
        const id =
            data.authorChannelId ||
            data.channelId ||
            data.userId ||
            data.user_id ||
            data.authorId ||
            data.id ||
            "";

        const name =
            data.displayName ||
            data.authorName ||
            data.channelName ||
            data.name ||
            data.author ||
            `user-${String(id).slice(-4)}`;

        const icon =
            data.authorPhoto ||
            data.authorProfileImageUrl ||
            data.profileImage ||    // ★ ここを追加
            "";

        return { id: String(id), name: String(name), icon };
    }

    // ★ maxUsers を超えたぶん、一番「古い」ユーザーから削除する
    private trimToMax(): void {
        if (this.map.size <= this.maxUsers) return;

        const overflow = this.map.size - this.maxUsers;

        const sortedByOldest = [...this.map.values()].sort((a, b) => {
            if (a.lastAt !== b.lastAt) return a.lastAt - b.lastAt;
            return a.createdAt - b.createdAt;
        });

        // 古い順に overflow 件だけ削除
        for (const u of sortedByOldest.slice(0, overflow)) {
            this.map.delete(u.id);
        }
    }


    // ★ now を外からもらう前提の touch
    touch(data: RawComment, now: number): void {
        const { id, name, icon } = this.extractUserInfo(data);

        let current = this.map.get(id);

        if (current) {
            current.touch(name, icon, now);
        } else {
            const user = new User({ id, name, icon, now });
            this.map.set(id, user);
        }

        // maxUsers を超えていたら、一番寿命の短いものから捨てる
        this.trimToMax();
    }

    getActiveUsers(now: number): User[] {
        // 寿命切れユーザーの削除（60秒ルール）
        for (const [id, u] of this.map) {
            if (u.isExpiredByLastAt(this.lifeMs, now)) {
                this.map.delete(id);
            }
        }

        const list = [...this.map.values()];
        list.sort((a, b) => {
            if (b.count !== a.count) return b.count - a.count;
            return b.lastAt - a.lastAt;
        });

        // 念のためここでも slice しておく（map.size==maxUsers ならそのまま）
        return list.slice(0, this.maxUsers);
    }

}

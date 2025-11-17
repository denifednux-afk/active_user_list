// src/User.ts
/** 1人の視聴者を表すクラス */
export class User {
    constructor(params) {
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
    touch(name, icon, now) {
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
    markShown() {
        this.isNew = false;
    }
    /** 生成から thresholdMs ミリ秒以上経っているか？ */
    isOlderThan(thresholdMs, now) {
        return now - this.createdAt > thresholdMs;
    }
    /** 最後のコメントから lifetimeMs ミリ秒以上経っているか？ */
    isExpiredByLastAt(lifetimeMs, now) {
        return now - this.lastAt > lifetimeMs;
    }
}

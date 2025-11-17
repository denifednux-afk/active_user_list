// src/main.ts
import { Users } from "./Users.js";
import { ActiveUsersView } from "./ActiveUsersView.js";
import { ConfigLoader } from "./Config.js";
let view = null;
let users = null;
function renderActiveUsers() {
    if (!view || !users)
        return;
    const now = Date.now();
    const active = users.getActiveUsers(now);
    view.render(active, now);
}
function onComments(events) {
    var _a;
    if (!users)
        return;
    for (const ev of events) {
        const data = (_a = ev.data) !== null && _a !== void 0 ? _a : ev;
        if (!data.comment && !data.message)
            continue;
        const at = getCommentTime(data); // すでに作ってあるヘルパーをそのまま利用
        users.touch(data, at);
    }
}
// ===== window load =====
window.addEventListener("load", async () => {
    const container = document.getElementById("active-users");
    if (!container) {
        console.warn("[active_users_list] #active-users not found");
        return;
    }
    // ★ コンフィグ読み込み
    const config = await ConfigLoader.load("./config.json");
    console.log("[active_users_list] config", config);
    // ★ Users / View をコンフィグで初期化
    users = new Users(config.userLifetimeMs, config.maxActiveUsers);
    view = new ActiveUsersView(container, config.highlightMs);
    await window.OneSDK.ready();
    window.OneSDK.setup({
        jsonPath: "../../comment.json",
        commentLimit: 1000
    });
    window.OneSDK.subscribe({
        action: "comments",
        callback: onComments
    });
    window.OneSDK.connect();
    setInterval(renderActiveUsers, 1000);
});
function getCommentTime(data) {
    var _a, _b;
    // 1. それっぽいフィールドを優先的に使う
    let t = (_b = (_a = data.timestamp) !== null && _a !== void 0 ? _a : data.time) !== null && _b !== void 0 ? _b : data.createdAt;
    // なにもなければ「今」とする（既存挙動）
    if (t == null)
        return Date.now();
    if (typeof t === "string") {
        // ISO文字列っぽかったら Date.parse
        const parsed = Date.parse(t);
        if (!Number.isNaN(parsed)) {
            return parsed;
        }
        // パースできなければとりあえず今
        return Date.now();
    }
    // 数字の場合：秒かミリ秒か判定
    if (t < 10000000000) {
        // 10桁未満なら「秒」扱いにしてミリ秒へ
        return t * 1000;
    }
    // それ以外はミリ秒扱い
    return t;
}

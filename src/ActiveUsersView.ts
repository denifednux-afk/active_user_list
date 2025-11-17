// src/ActiveUsersView.ts
import type { User } from "./User.js";

export class ActiveUsersView {
    private readonly container: HTMLElement;
    private readonly highlightMs: number;

    constructor(container: HTMLElement, highlightMs: number) {
        this.container = container;
        this.highlightMs = highlightMs;
    }

    render(users: readonly User[], now: number): void {
        this.container.innerHTML = "";

        users.forEach((user, index) => {
            const div = document.createElement("div");
            div.className =
                "active-user" + (index === 0 ? " active-user--top" : "");

            // ★ 光っているかどうかを「時間」で判定
            if (now - user.lastAt <= this.highlightMs) {
                div.classList.add("active-user--new");
            }

            const icon = document.createElement("img");
            icon.className = "active-user__icon";
            icon.src = user.icon;
            icon.alt = "";

            const nameEl = document.createElement("div");
            nameEl.className = "active-user__name";
            nameEl.textContent = user.name;

            div.appendChild(icon);
            div.appendChild(nameEl);
            this.container.appendChild(div);
        });
    }
}

import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: null,
        position_name: null,
        level: null,
        username: null
    }),
    getters: {
        isLoggedIn: (user) => user.id !== null
    },
    actions: {
        login(user) {
            this.id = user.id;
            this.name = user.name;
            this.position_name = user.position_name;
            this.level = user.level;
            this.username = user.username
        },
        logout() {
            this.id = null;
            this.name = null;
            this.position_name = null;
            this.level = null;
            this.username = null;
        }
    }
});
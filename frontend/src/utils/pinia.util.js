import { defineStore } from "pinia";

export const useUserStore = defineStore('user', {
    state: () => ({
        id: null,
        name: null,
        department_name: null,
        username: null
    }),
    getters: {
        isLoggedIn: (user) => user.id !== null
    },
    actions: {
        login(user) {
            this.id = user.id;
            this.name = user.name;
            this.department_name = user.department_name;
            this.username = user.username
        },
        logout() {
            this.id = null;
            this.name = null;
            this.department_name = null;
            this.username = null;
        }
    }
});
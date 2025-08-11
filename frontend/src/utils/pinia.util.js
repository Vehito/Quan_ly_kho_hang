import { defineStore } from "pinia";
import local_storageUtil from "./local_storage.util";

export const useUserStore = defineStore('user', {
    state: () => {
        const storedUser = local_storageUtil.getUser || {};
        return {
            id: storedUser.id || null,
            name: storedUser.name || null,
            position: storedUser.position || null,
            department_name: storedUser.department_name || null,
            username: storedUser.username || null
        };
    },
    getters: {
        isLoggedIn: (user) => user.id !== null
    },
    actions: {
        login(user) {
            local_storageUtil.setUser(user);
            this.id = user.id;
            this.name = user.name;
            this.department_name = user.department_name;
            this.position = user.position;
            this.username = user.username;
        },
        logout() {
            local_storageUtil.clearUser();
            this.id = null;
            this.name = null;
            this.department_name = null;
            this.position = null;
            this.username = null;
        }
    }
});
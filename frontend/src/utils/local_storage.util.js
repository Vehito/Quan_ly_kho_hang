class LocalStorage {

    get isLoggedIn() {
        const today = Date.now();
        const user = this.getUser;
        
        if (user && user.id && user.expiry && user.expiry > today) {
            return true;
        }
        return false;
    }

    setUser(user) {
        const today = new Date();
        user.expiry = today.getTime() + Number(user.ttl);
        localStorage.setItem('user', JSON.stringify(user));
    }

    get getUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    clearUser() {
        localStorage.removeItem('user');
    }
}

export default new LocalStorage();
<template>
    <nav class="navbar navbar-expand navbar-dark bg-primary">
        <div class="mr-auto navbar-nav">
            <li class="nav-item text-center">
                <RouterLink :to="{ name: 'products'}" class="nav-link">
                    <strong>Sản Phẩm</strong>
                </RouterLink>
                <i class="fas fa-box "></i>
            </li>

            <!-- <li class="nav-item text-center">
                <router-link :to="{ name: 'importShipment'}" class="nav-link">
                    <strong>Nhập hàng</strong>
                </router-link>
                <i class="fas fa-archive"></i>
            </li>

            <li class="nav-item text-center" v-if="user?.role==='admin'">
                <router-link :to="{ name: 'customer'}" class="nav-link">
                    <strong>Khách hàng</strong>
                </router-link>
                <i class="fas fa-building"></i>
            </li>

            <li class="nav-item text-center" v-if="user?.role==='admin'">
                <router-link :to="{ name: 'employee'}" class="nav-link">
                    <strong>Nhân viên</strong>
                </router-link>
                <i class="fas fa-user"></i>
            </li>

            <li class="nav-item text-center">
                <router-link :to="{ name: 'exportShipment'}" class="nav-link">
                    <strong>Xuất hàng</strong>
                </router-link>
                <i class="fa-solid fa-boxes-packing"></i>
            </li>

            <li v-if="!isLoggedIn" class="nav-item text-center ml-5">
                <router-link :to="{ name: 'login'}" class="nav-link">
                    <strong>Đăng nhập</strong>
                </router-link>
            </li> -->

            <!-- <li v-else class="nav-item ml-5 mt-2">
                <div class="dropdown">
                    <button
                        class="btn btn-primary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                    >
                        {{ user.username || 'User' }}
                    </button>
                    <div class="dropdown-menu text-center" aria-labelledby="dropdownMenuButton">
                        <router-link
                            v-if="user.id !== undefined"
                            :to="{ name: 'employee.edit', params: { id: user.id } }"
                            class="dropdown-item"
                        >
                            Thay đổi thông tin
                        </router-link>
                        <a class="dropdown-item" href="#" @click="logout">Logout</a>
                    </div>
                </div>
            </li> -->
        </div>
    </nav>
</template>

<script>
import { RouterLink } from 'vue-router';

// import authService from '@/services/auth.service';

// export default {

//     computed: {
//         isLoggedIn() {
//             return this.$store.getters.isLoggedIn;
//         },
//         user() {
//             return this.$store.getters.user;
//         }
//     },

//     methods: {
//         async logout() {
//             if(this.$store.getters.isLoggedIn) {
//                 try {
//                     this.$store.dispatch('logout');
//                     await authService.logout();
//                     this.$router.push({
//                         name: "login"
//                     })
//                 } catch (error) {
//                     alert(error);
//                 }
//             }
//         }
//     },
// }
</script>

<style scoped>
nav {
    margin-left: 220px;
}
</style>
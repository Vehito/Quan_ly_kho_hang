<script setup>
import { useRoute } from 'vue-router';
import { watch, computed } from 'vue';
const route = useRoute();
const emits = defineEmits(['click:listItem']);

const menuItems = [
    { label: "Sản phẩm", icon: "fa	s fa-box", name: "products", 
		listItem: [
            {label: 'Danh sách SP', icon: 'fa-solid fa-box', name: 'products'},
            {label: 'Tạo sản phẩm', icon: 'fa-solid fa-circle-plus', name: 'product.create'},
            {label: 'Sản phẩm hết hạn', icon: 'fa-solid fa-clock', name: 'product.expire'},
        ]
	},
    { label: "Đơn nhập", icon: "fas fa-warehouse", name: "import_shipments",
		listItem: [
            {label: 'Danh sách nhập hàng', icon: 'fas fa-warehouse', name: 'import_shipments'},
            {label: 'Tạo đơn nhập', icon: 'fa-solid fa-circle-plus', name: 'import_shipment.create'},
        ],
	},
    { label: "Đơn xuất", icon: "fa-solid fa-truck", name: "export_shipments",
		listItem: [
            {label: 'Danh sách xuất hàng', icon: 'fa-solid fa-truck', name: 'export_shipments'},
            {label: 'Tạo đơn xuất', icon: 'fa-solid fa-circle-plus', name: 'export_shipment.create'},
        ],
	},
    { label: "Nhân viên", icon: "fa-solid fa-users", name: "employees",
		listItem: [
            {label: 'Danh sách nhân viên', icon: 'fa-solid fa-users', name: 'employees'},
            {label: 'Thêm nhân viên', icon: 'fa-solid fa-circle-plus', name: 'employee.create'},
            {label: 'Bảng lương nhân viên', icon: 'fa-solid fa-tablet', name: 'monthly_payrolls'},
            {label: 'Lịch nhân viên', icon: 'fa-solid fa-calendar', name: 'employee.calendar'},
        ],
	},
    { label: "Khách hàng", icon: "fas fa-shopping-cart", name: "customers",
		listItem: [
            {label: 'Danh sách khách hàng', icon: 'fas fa-shopping-cart', name: 'customers'},
            {label: 'Thêm khách hàng', icon: 'fa-solid fa-circle-plus', name: 'customer.create'},
        ],
	},
    { label: "Nhà cung cấp", icon: "fas fa-industry", name: "suppliers",
		listItem: [
            {label: 'Danh sách nhà cung cấp', icon: 'fas fa-industry', name: 'suppliers'},
            {label: 'Thêm nhà cung cấp', icon: 'fa-solid fa-circle-plus', name: 'supplier.create'},
        ],
	},
    { label: "Thống kê", icon: "fa-solid fa-chart-simple", name: "report",
		listItem: [
            {label: 'Xuất/Nhập', icon: 'fa-solid fa-money-bill-transfer', name: 'report'},
            {label: 'Sản phẩm', icon: 'fa-solid fa-boxes-packing', name: 'product_report'},
        ],
	},
];
const activeIndex = computed(() => {
	const index = menuItems.findIndex(item => item.name === route.name);
	if(index !== -1) {
		return index;
	}
});

watch(activeIndex, (newIndex) => {
	if(newIndex > -1) {
		emits('click:listItem', menuItems[newIndex].listItem);
	}
});
</script>

<template>

<!--msb: main sidebar-->
<div class="msb" id="msb">
	<nav class="navbar navbar-default" role="navigation">
		<div class="navbar-header">
			<div class="brand-wrapper">
				<!-- Brand -->
				<div class="brand-name-wrapper">
					<strong>
						<a class="navbar-brand" href="/">Kho hàng thực phẩm</a>
					</strong>
				</div>
			</div>
		</div>

		<!-- Main Menu -->
		<div class="side-menu-container">
			<ul class="nav navbar-nav">
				<RouterLink
					v-for="(item, index) in menuItems"
					:key="item.name"
					:to="{ name: item.name }"
					v-slot="{ isActive }"
				>
					<li :class="{ active: isActive }">
						<a class="nav-link">
						<strong><i :class="item.icon"></i> {{ item.label }}</strong>
						</a>
					</li>
				</RouterLink>
			</ul>
		</div><!-- /.navbar-collapse -->
	</nav>  
</div>
</template>

<style scoped>
body {
  margin-top: 50px;
  background-color: #fff;
  font-family: Arial, sans-serif;
  font-size: 14px;
  letter-spacing: 0.01em;
  color: #39464e;
}

.navbar-default {
  background-color: #FFF;
  margin-left: 200px;
}

/*main side bar*/
.msb {
  width: 220px;
  background-color: #F5F7F9;
  position: fixed;
  left: 0;
  top: 0;
  right: auto;
  min-height: 100%;
  overflow-y: auto;
  white-space: nowrap;
  height: 100%;
  z-index: 1;
  border-right: 1px solid #ddd;
  .navbar {
    border: none;
    margin-left: 0;
    background-color: inherit;
  }
  .navbar-header {
    width: 100%;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 20px;
    background: #fff;
  }
  .navbar-nav {
    .panel {
      border: 0 none;
      box-shadow: none;
      margin: 0;
      background: inherit;
    }
    li {
      display: block;
      padding: 5px;
      width: 190px;
      text-align: center;
      border: #444;
    }
  }
  .nb {
    padding-top: 5px;
    padding-left: 10px;
    margin-bottom: 30px;
    overflow: hidden;
    
  }
}
li.active {
	color: rgb(0, 0, 255, .5);
	text-decoration: underline;
	border-radius: 20px;
	background-color: rgb(0, 0, 255, .1);
	strong {
		color: rgb(0, 0, 255, .5);
	}
}
ul.nv,
ul.ns {
  position: relative;
  padding: 0;
  list-style: none;  
}
.nv {  
  li {
    display: block;
    position: relative;
    
    &::before {
      clear: both;
      content: "";      
      display: table;
    }
    a {
      color: #444;
      padding: 10px 25px;
      display: block;
      
      .ic {
        font-size: 16px;
        margin-right: 5px;
        font-weight: 300;
        display: inline-block;
      }
    }
  }
  /*ns: nav-sub*/
  .ns {
    li {
      a {
        padding: 10px 50px;
      }
    }
    
  }
  
}

/*globals*/
a,
a:focus,
a:hover {
 text-decoration: none;
}

.inbox {
  .container-fluid {
    padding-left: 0;
    padding-right: 0;
  }
  
  ul, li {
    margin: 0;
    padding: 0;
  }
  ul {    
    li {
      list-style: none;
      a {
        display: block;
        padding: 10px 20px;
      }
    }
  }
}
</style>
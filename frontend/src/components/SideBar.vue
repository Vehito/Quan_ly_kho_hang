<script setup>
const menuItems = [
	{ label: "Sản phẩm", icon: "fas fa-box", name: "products" },
	{ label: "Nhân viên", icon: "fa-solid fa-users", name: "employees" },
	{ label: "Khách hàng", icon: "fas fa-shopping-cart", name: "customers" },
	{ label: "Nhà cung cấp", icon: "fas fa-industry", name: "suppliers" },
]
</script>

<template>

<!--msb: main sidebar-->
<div class="msb" id="msb">
		<nav class="navbar navbar-default" role="navigation">
			<div class="navbar-header">
				<div class="brand-wrapper">
					<!-- Brand -->
					<div class="brand-name-wrapper">
						<a class="navbar-brand" href="/">
							Kho hàng thực phẩm
						</a>
					</div>
				</div>
			</div>

			<!-- Main Menu -->
			<div class="side-menu-container">
				<ul class="nav navbar-nav">
					<RouterLink
						v-for="item in menuItems"
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
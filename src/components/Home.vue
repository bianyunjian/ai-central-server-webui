<template>
  <el-container>
    <el-header height="40px">
      <div class="logo">
        <img src="./../assets/ax-logo.jpg" />
      </div>
      <div class="logo-title">艾信智慧医疗AI智能平台</div>
      <div class="user-info">
        欢迎你，{{currentUser.userName}}
        <el-link type="primary" @click="logOut(true)">退出</el-link>
      </div>
    </el-header>
    <el-container class="main-container-wrapper">
      <el-aside :width="asideMenuWidth">
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :default-openeds="defaultOpeneds"
          :unique-opened="true"
          background-color="#001529"
          text-color="#fff"
        >
          <el-submenu v-for="m in menuConfig" :key="m.name" :index="m.index">
            <template slot="title">
              <i :class="m.icon"></i>
              <span slot="title">{{m.name}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                v-for="sm in m.menuItems"
                :key="sm.name"
                :index="sm.index"
                @click="openMenuItem(m,sm)"
              >{{sm.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>

        <div @click="toggleMenuCollapse" :class="isCollapse?'menuCollapse':'menuExpand'">
          <div>{{isCollapse?'>>':'收起'}}</div>
        </div>
      </el-aside>
      <el-main id="main-container">
        <div class="default-div">欢迎使用化平台</div>
      </el-main>
    </el-container>
    <!-- <el-footer height="30px">{{footerInfo}}</el-footer> -->
  </el-container>
</template>

<script>
import loginService from "@/api/auth";
import {
  getUserData,
  setUserData,
  removeAccessToken,
  removeRefreshToken,
  removeUserData,
  setAccessToken,
  setRefreshToken,
  getRefreshToken
} from "@/utils/auth";
import { Message } from "element-ui";
export default {
  data() {
    return {
      footerInfo: "XXXXXXXX信息科技有限公司 © 2017 苏ICP备00000000号-0",
      asideMenuCollapseWidth: "64px",
      asideMenuExpandWidth: "195px",
      asideMenuWidth: "195px",
      isCollapse: false,
      defaultOpeneds: ["1"],
      currentUser: { userName: "" },

      menuConfig: []
    };
  },
  mounted: function() {
    this.getCurrentUserInfo();
  },
  destroyed: function name(params) {},

  methods: {
    getCurrentUserInfo() {
      var d = getUserData();

      if (d) {
        d = JSON.parse(d);
        if (d && d.userName) {
          this.currentUser.userName = d.userName;
          this.refreshMenuConfig(d, window.MENU_CONFIG);
        }
      } else {
        this.logOut(false);
      }
    },
    logOut(prompt) {
      if (prompt == undefined) {
        prompt = true;
      }

      if (prompt) {
        this.$confirm("确定将退出系统吗, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          removeAccessToken();
          removeRefreshToken();
          removeUserData();
          this.$router.push("Login");
        });
      } else {
        removeAccessToken();
        removeRefreshToken();
        removeUserData();
        this.$router.push("Login");
      }
    },
    toggleMenuCollapse() {
      this.isCollapse = !this.isCollapse;
      if (this.isCollapse) {
        this.asideMenuWidth = this.asideMenuCollapseWidth;
      } else {
        this.asideMenuWidth = this.asideMenuExpandWidth;
      }
    },
    openMenuItem(m, sm) {
      console.log(m.name, "---", sm.name, "---", sm.routeName);

      let routeName = sm.routeName;
      if (routeName) {
        this.$router.push({ name: routeName });
      }
    },

    refreshMenuConfig(userData, mc) {
      let filterMenuConfig = [];

      mc.forEach(m => {
        let smArray = [];
        for (let index = 0; index < m.menuItems.length; index++) {
          const sm = m.menuItems[index];
          if (sm.requirePermission == undefined || sm.requirePermission == "") {
            smArray.push(sm);
          } else {
            let checkPermission = sm.requirePermission;

            if (userData.permissionList) {
              let checkPassed = false;
              userData.permissionList.forEach(p => {
                if (p.permissionName == checkPermission) {
                  checkPassed = true;
                  return;
                }
              });
              if (checkPassed) {
                smArray.push(sm);
              }
            }
          }
        }
        if (smArray.length > 0) {
          filterMenuConfig.push({
            index: m.index,
            name: m.name,
            icon: m.icon,
            menuItems: smArray
          });
        }
      });

      this.menuConfig = filterMenuConfig;
    }
  }
};
</script>

<style scoped>
.el-container {
  height: 100%;
  /* background: #f5f7fa; */
}

.el-header {
  /* background-color: #b3c0d1; */
  /* background-color: rgb(0, 21, 41); */
  color: #333;
  text-align: center;
  line-height: 30px;
  font-size: 13px;
  border-bottom: solid 1px #eee;
}
.main-container-wrapper {
  height: calc(100% - 40px);
}

.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 30px;
  font-size: 13px;
}

.el-aside {
  background: #001529;
  color: #333;
  text-align: left;
  overflow: hidden;
}

.el-main {
  background: #fff;
  text-align: center;
  margin: 0px;
  /* TODO  */
  padding: 0px;
  /* border-radius: 4px; */
  box-shadow: rgba(0, 0, 0, 0.05) 1px 0px 4px;
}

.logo {
  float: left;
}

.logo img {
  width: 130px;
  margin-top: 5px;
}
.logo-title {
  float: left;

  height: 16px;
  font-size: 16px;
  font-family: NotoSansHans-Medium, NotoSansHans;
  font-weight: 500;
  color: rgba(74, 80, 94, 1);
  line-height: 42px;
}

.user-info {
  float: right;
  line-height: 20px;
  margin-top: 10px;
  font-size: 14px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 195px;
  min-height: 400px;
}

.el-menu-vertical-demo.el-menu {
  height: calc(100% - 45px);
}
.el-menu-item.is-active {
  background-color: rgb(18, 48, 76) !important;
}
.menuExpand {
  width: 195px;
  border-right: solid 1px #eae6e6;
  cursor: pointer;
  color: #fff;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
}

.menuCollapse {
  width: 64px;
  border-right: solid 1px #eae6e6;
  cursor: pointer;
  color: #fff;
  line-height: 40px;
  font-size: 14px;
  text-align: center;
}
.menuExpand:hover,
.menuCollapse:hover {
  background-color: rgb(18, 48, 76);
}

.default-div {
  padding: 50px;
}
</style>
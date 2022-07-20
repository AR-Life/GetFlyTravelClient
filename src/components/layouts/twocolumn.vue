<script>
import router from '@/router';
import {
  SimpleBar,
} from 'simplebar-vue3';
import {
  layoutComputed,
} from '@/state/helpers';
import NavBar from '@/components/nav-bar.vue';
import RightBar from '@/components/right-bar.vue';
import Footer from '@/components/footer.vue';
/**
 * Vertical layout
 */
export default {
  components: {
    NavBar,
    RightBar,
    Footer,
    SimpleBar,
  },
  data() {
    return {
      isMenuCondensed: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  created: () => {
    document.body.removeAttribute('data-layout', 'horizontal');
    document.body.removeAttribute('data-topbar', 'dark');
    document.body.removeAttribute('data-layout-size', 'boxed');
  },
  methods: {
    initActiveMenu() {
      const pathName = window.location.pathname;
      const ul = document.getElementById('navbar-nav');
      if (ul) {
        const items = Array.from(ul.querySelectorAll('a.nav-link'));
        const activeItems = items.filter((x) => x.classList.contains('active'));
        this.removeActivation(activeItems);
        const matchingMenuItem = items.find((x) => x.getAttribute('href') === pathName);
        if (matchingMenuItem) {
          this.activateParentDropdown(matchingMenuItem);
        } else {
          const id = pathName.replace('/', '');
          if (id) document.body.classList.add('twocolumn-panel');
          this.activateIconSidebarActive(pathName);
        }
      }
    },
    updateMenu(e) {
      document.body.classList.remove('twocolumn-panel');
      const ul = document.getElementById('navbar-nav');
      if (ul) {
        const items = Array.from(ul.querySelectorAll('.show'));
        items.forEach((item) => {
          item.classList.remove('show');
        });
      }
      const icons = document.getElementById('two-column-menu');
      if (icons) {
        const activeIcons = Array.from(icons.querySelectorAll('.nav-icon.active'));
        activeIcons.forEach((item) => {
          item.classList.remove('active');
        });
      }
      document.getElementById(e).classList.add('show');
      this.activateIconSidebarActive(`#${e}`);
    },
    removeActivation(items) {
      items.forEach((item) => {
        if (item.classList.contains('menu-link')) {
          if (!item.classList.contains('active')) {
            item.setAttribute('aria-expanded', false);
          }
          item.nextElementSibling.classList.remove('show');
        }
        if (item.classList.contains('nav-link')) {
          if (item.nextElementSibling) {
            item.nextElementSibling.classList.remove('show');
          }
          item.setAttribute('aria-expanded', false);
        }
        item.classList.remove('active');
      });
    },
    activateIconSidebarActive(id) {
      const menu = document.querySelector(`#two-column-menu .simplebar-content-wrapper a[href='${
        id
      }'].nav-icon`);
      if (menu !== null) {
        menu.classList.add('active');
      }
    },
    activateParentDropdown(item) {
      // navbar-nav menu add active
      item.classList.add('active');
      const parentCollapseDiv = item.closest('.collapse.menu-dropdown');
      if (parentCollapseDiv) {
        // to set aria expand true remaining
        parentCollapseDiv.classList.add('show');
        parentCollapseDiv.parentElement.children[0].classList.add('active');
        parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
        if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
          this.activateIconSidebarActive(`#${parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown').getAttribute('id')}`);
          parentCollapseDiv.parentElement.closest('.collapse').classList.add('show');
          if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling) {
            parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.classList.add('active');
          }
          return false;
        }
        this.activateIconSidebarActive(`#${parentCollapseDiv.getAttribute('id')}`);
        return false;
      }
      return false;
    },
    toggleMenu() {
      document.body.classList.toggle('sidebar-enable');
      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove('sidebar-enable');
          document.body.classList.remove('vertical-collpsed');
        });
        document.body.classList.toggle('vertical-collpsed');
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove('sidebar-enable');
        });
        document.body.classList.remove('vertical-collpsed');
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
    toggleRightSidebar() {
      document.body.classList.toggle('right-bar-enabled');
    },
    hideRightSidebar() {
      document.body.classList.remove('right-bar-enabled');
    },
  },
  mounted() {
    this.initActiveMenu();
  },
};
</script>
<template>
<div id="layout-wrapper">
  <NavBar />
  <div>
    <!-- ========== Left Sidebar Start ========== -->
    <!-- ========== App Menu ========== -->
    <div class="app-menu navbar-menu">
      <!-- LOGO -->
      <div class="navbar-brand-box">
        <!-- Dark Logo-->
        <router-link to="/" class="logo logo-dark">
          <span class="logo-sm">
            <img src="@/assets/images/logo-sm.png" alt="" height="22" />
          </span>
          <span class="logo-lg">
            <img src="@/assets/images/logo-dark.png" alt="" height="17" />
          </span>
        </router-link>
        <!-- Light Logo-->
        <router-link to="/" class="logo logo-light">
          <span class="logo-sm">
            <img src="@/assets/images/logo-sm.png" alt="" height="22" />
          </span>
          <span class="logo-lg">
            <img src="@/assets/images/logo-light.png" alt="" height="17" />
          </span>
        </router-link>
        <button type="button" class="
        btn btn-sm
        p-0
        fs-20
        header-item
        float-end
        btn-vertical-sm-hover
      " id="vertical-hover">
          <i class="ri-record-circle-line"></i>
        </button>
      </div>
      <div id="scrollbar">
        <div class="container-fluid">
          <div id="two-column-menu">
            <SimpleBar class="twocolumn-iconview list-unstyled">
              <a href="#" class="logo">
                <img src="@/assets/images/logo-sm.png" alt="Logo" height="22" />
              </a>
              <li>
                <a class="nav-icon" href="#sidebarDashboards" role="button" @click.prevent="updateMenu('sidebarDashboards')">
                  <i class="ri-dashboard-2-line"></i>
                </a>
              </li>
              <li>
                <a class="nav-icon" href="#sidebarApps" role="button" @click.prevent="updateMenu('sidebarApps')">
                  <i class="ri-apps-2-line"></i>
                </a>
              </li>
            </SimpleBar>
          </div>
          <template v-if="layoutType === 'twocolumn'">
            <SimpleBar class="navbar-nav" id="navbar-nav">
              <li class="menu-title">
                <span data-key="t-menu"> {{ $t("t-menu") }}</span>
              </li>
              <li class="nav-item">
                <div class="collapse menu-dropdown" id="sidebarDashboards">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <router-link to="/hotels" class="nav-link custom-abc" data-key="t-hotels">
                        {{ $t("t-hotels") }}
                      </router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/hotels/add" class="nav-link" data-key="t-hotel-add">
                        {{ $t("t-hotel-add") }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </li>
              <!-- end Dashboard Menu -->
              <li class="nav-item">
                <div class="collapse menu-dropdown" id="sidebarApps">
                  <ul class="nav nav-sm flex-column">
                    <li class="nav-item">
                      <router-link to="/markets" class="nav-link" data-key="t-markets">
                        {{ $t("t-markets") }}
                      </router-link>
                    </li>
                    <li class="nav-item">
                      <router-link to="/markets/add" class="nav-link" data-key="t-market-add">
                        {{ $t("t-market-add") }}
                      </router-link>
                    </li>
                  </ul>
                </div>
              </li>
            </SimpleBar>
          </template>
        </div>
      </div>
    </div>
    <!-- Left Sidebar End -->
    <!-- Vertical Overlay-->
    <div class="vertical-overlay"></div>
  </div>
  <!-- ============================================================== -->
  <!-- Start Page Content here -->
  <!-- ============================================================== -->
  <div class="main-content">
    <div class="page-content">
      <!-- Start Content-->
      <div class="container-fluid">
        <slot />
      </div>
    </div>
    <Footer />
  </div>
  <RightBar />
</div>
</template>

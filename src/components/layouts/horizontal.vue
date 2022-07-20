<script>
import NavBar from '@/components/nav-bar.vue';
import RightBar from '@/components/right-bar.vue';
import Footer from '@/components/footer.vue';

export default {
  watch: {
    $route: {
      handler: 'onRoutechange',
      immediate: true,
      deep: true,
    },
  },
  methods: {
    onRoutechange(ele) {
      this.initActiveMenu(ele.path);
    },
    initActiveMenu(ele) {
      setTimeout(() => {
        if (document.querySelector('#navbar-nav')) {
          const a = document.querySelector('#navbar-nav').querySelector(`[href="${ele}"]`);
          if (a) {
            a.classList.add('active');
            const parentCollapseDiv = a.closest('.collapse.menu-dropdown');
            if (parentCollapseDiv) {
              parentCollapseDiv.classList.add('show');
              parentCollapseDiv.parentElement.children[0].classList.add('active');
              parentCollapseDiv.parentElement.children[0].setAttribute('aria-expanded', 'true');
              if (parentCollapseDiv.parentElement.closest('.collapse.menu-dropdown')) {
                parentCollapseDiv.parentElement.closest('.collapse').classList.add('show');
                if (parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling) {
                  parentCollapseDiv.parentElement.closest('.collapse').previousElementSibling.classList.add('active');
                }
              }
            }
          }
        }
      }, 1000);
    },
  },
  components: {
    NavBar,
    RightBar,
    Footer,
  },
};
</script>
<template>
<div>
  <div id="layout-wrapper">
    <NavBar />
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
          <ul class="navbar-nav h-100" id="navbar-nav">
            <li class="menu-title">
              <span data-key="t-menu"> {{ $t("t-menu") }}</span>
            </li>
            <li class="nav-item">
              <a class="nav-link menu-link" href="#sidebarDashboards" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarDashboards">
                <i class="ri-dashboard-2-line"></i>
                <span data-key="t-dashboards"> {{ $t("t-dashboards") }}</span>
              </a>
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
              <a class="nav-link menu-link" href="#sidebarApps" data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="sidebarApps">
                <i class="ri-apps-2-line"></i>
                <span data-key="t-apps"> {{ $t("t-apps") }}</span>
              </a>
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
            <li class="nav-item">

              <router-link to="/actions" class="nav-link menu-link">
                      <i class="ri-exchange-box-line"></i>{{ $t("t-actions") }}
                    </router-link>
            </li>
          </ul>
        </div>
        <!-- Sidebar -->
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
</div>
</template>

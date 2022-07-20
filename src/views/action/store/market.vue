<template>
<div>
  <div class="d-flex  flex-wrap justify-content-center">
    <div class="card text-dark col-3 mx-1" v-for="m in markets" :key="m">
      <div class="card-header bg-light">
        <span class="fs-5">{{m.mainMarketName}} </span>
        <br>{{m.subMarketName}}
      </div>
      <div class="card-body">
        <p class="card-title">
          <span v-for="c in m.country_id" :key="c" :class="['p-1 m-1 fi fi-'+c.code]"></span>
        </p>
        <p class="card-text">
          <span v-for="c in m.country_id" :key="c" class="ms-1">{{c.code.toUpperCase()}}</span>
        </p>
      </div>
      <div class="card-footer text-muted">
        <div class="form-check form-switch form-switch-success form-switch-lg d-flex justify-content-center" dir="ltr">
          <input type="checkbox" class="form-check-input" :id="m._id" :value="m._id" v-on:change="checkedMarket(m)">
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-xxl-6">
      <div class="card">
        <div class="card-header align-items-center d-flex">
          <h4 class="card-title mb-0 flex-grow-1">ADD COUNTRY</h4>
        </div>
        <!-- end card header -->
        <div class="card-body">
          <!-- Secondary Alert -->
          <div class="live-preview">
            <div class="row">
              <!--end col-->
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="address1ControlTextarea" class="form-label">Search Country</label>
                  <input v-model="search" type="text" class="form-control" placeholder="Search a country name" id="address1ControlTextarea" />
                  <ol style="column-count: 3;">
                    <li v-for="item in searchCountry" :key="item._id">
                      <span v-on:click="addCountry(item)" @keydown="addCountry(item)">
                        <span :class="['fi fi-'+item.code]"></span> {{item.name}}
                      </span>
                    </li>
                  </ol>
                </div>
              </div>
              <!--end col-->
            </div>
            <!--end row-->
          </div>
        </div>
      </div>
    </div>
    <div class="col-xxl-6">
      <div class="card">
        <div class="card-header align-items-center d-flex">
          <h4 class="card-title mb-0 flex-grow-1">PREVİEW</h4>
        </div>
        <!-- end card header -->
        <div class="card-body">
          <!-- Small Tables -->
          <ol style="column-count: 1;">
            <li v-for="item in hotel.country" :key="item">
              <span v-on:click="removeCountry(item)" @keydown="removeCountry(item)">
                <span :class="['fi fi-'+item.code]"></span> {{item.name}}
              </span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <!-- end col -->
</div>
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="save" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save and Close </button>
  </div>
</div>
</template>
<script>
import store from '@/state';
import { cloneDeep } from 'lodash';
import appAxios from '@/utils/appAxios';

export default {
  props: ['data', 'close', 'next'],
  computed: {
    hotel() {
      return this.data;
    },
  },
  methods: {
    async getData() {
      if (store.getters['market/getMarket']) {
        this.markets = this.markets.length < 1 ? cloneDeep(store.getters['market/getMarket']) : true;
        this.country = this.country.length < 1 ? cloneDeep(store.getters['market/getCountry']) : true;
      } else {
        await appAxios.appAxios.get('/country').then((response) => {
          this.$store.commit('market/setCountry', response.data);
          this.country = cloneDeep(response.data);
        });
        await appAxios.appAxios.get('/market').then((response) => {
          response.data.length > 0 ? response.data.forEach((element) => {
            this.$store.commit('market/setMarket', element);
          }) : false;
          this.markets = cloneDeep(response.data);
        });
      }
    },
  },
};
</script>

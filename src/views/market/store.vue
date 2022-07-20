<template>
<layout>
  <PageHeader :title="'Market Add'" />
  <div class="row">
    <div class="col-xxl-6">
      <div class="card">
        <div class="card-header align-items-center d-flex">
          <h4 class="card-title mb-0 flex-grow-1">CREATE A NEW MARKET</h4>
        </div>
        <!-- end card header -->
        <div class="card-body">
          <!-- Secondary Alert -->
          <div class="live-preview">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="mainMarketName" class="form-label">Main Market Name</label>
                  <input v-model="market.mainMarketName" type="text" class="form-control" placeholder="Enter your Main Market Name" id="mainMarketName" />
                </div>
              </div>
              <!--end col-->
              <div class="col-md-6">
                <div class="mb-3">
                  <label for="sub-MarketName" class="form-label">Sub-Market Name</label>
                  <input v-model="market.subMarketName" type="text" class="form-control" placeholder="Enter your Sub-Market Name" id="sub-MarketName" />
                </div>
              </div>
              <!--end col-->
              <div class="col-md-12">
                <div class="mb-3">
                  <label for="address1ControlTextarea" class="form-label">Search Country</label>
                  <input v-model="search" type="text" class="form-control" placeholder="Search a country name" id="address1ControlTextarea" />
                </div>
              </div>
              <div class="col-lg-12">
                <div class="text-end">
                  <button @click="save" type="submit" class="btn btn-primary"> Save </button>
                </div>
              </div>
              <!--end col-->
            </div>
            <!--end row-->
          </div>
          <ol style="column-count: 3;">
            <li v-for="item in searchCountry" :key="item._id">
              <span v-on:click="addCountry(item)" @keydown="addCountry(item)">
                <span :class="['fi fi-'+item.code]"></span> {{item.name}}
              </span>
            </li>
          </ol>
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
          <table class="table table-sm table-nowrap">
            <thead>
              <tr>
                <th scope="col">Main Market Name</th>
                <th scope="col">Sub-Market Name</th>
                <th scope="col">Countries</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{market.mainMarketName}}</td>
                <td>{{market.subMarketName}}</td>
                <td>
                  <ol style="column-count: 1;">
                    <li v-for="item in market.country_id" :key="item._id" :item="item.name">
                      <span v-on:click="removeCountry(item)" @keydown="removeCountry(item)">
                        <span :class="['fi fi-'+item.code]"></span> {{item.name}}
                      </span>
                    </li>
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- end col -->
  </div>
</layout>
</template>
<script>
/* eslint-disable prefer-spread */
import 'flag-icons/css/flag-icons.css';
import layout from '@/components/layouts/main.vue';
import PageHeader from '@/components/page-header.vue';
import store from '@/state';
import {
  cloneDeep,
} from 'lodash';
import appAxios from '../../utils/appAxios';

export default {
  data() {
    return {
      markets: [],
      country: [],
      market: {
        mainMarketName: null,
        subMarketName: null,
        country_id: [],
      },
      search: null,
    };
  },
  components: {
    layout,
    PageHeader,
  },
  computed: {
    deActiveCountry() {
      let delist = [].concat.apply([], this.markets.map((x) => x));
      delist = [].concat.apply([], delist.map((x) => x.country_id));
      return this.country.filter((x) => !delist.map((y) => y._id).includes(x._id)).filter((x) => !this.market.country_id.map((y) => y._id).includes(x._id));
    },
    searchCountry() {
      return this.deActiveCountry.filter((country) => (country.name && country.name.toLowerCase()).includes(this.search && this.search.toLowerCase()));
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
    addCountry(item) {
      this.market.country_id.push(item);
    },
    removeCountry(item) {
      this.market.country_id = this.market.country_id.filter((x) => x !== item);
    },
    save() {
      this.market.country_id = this.market.country_id.map((x) => x._id);
      appAxios.appAxios.post('market/create', this.market).then((response) => {
        this.market = response.data;
        this.market.country_id = this.country.filter((x) => this.market.country_id.includes(x._id));
        this.$store.commit('market/setMarket', cloneDeep(response.data));
        this.$router.push('/markets');
      }).catch(() => {
        this.market.country_id = this.country.filter((x) => this.market.country_id.includes(x._id));
      });
    },
  },
  created() {
    this.getData();
  },
};
</script>
<style>
.card-body li {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none
}

.card-body li:hover {
  cursor: pointer
}

.card-body li:hover span {
  color: #fff;
  background-color: #0d6efd
}
</style>

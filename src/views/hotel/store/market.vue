<script>
import appAxios from '@/utils/appAxios';
import 'flag-icons/css/flag-icons.css';
import store from '@/state';
import {
  cloneDeep,
} from 'lodash';

export default {
  props: ['data', 'next', 'finish'],
  data() {
    return {
      hotelData: this.data,
      country: [],
      markets: [],
      checkedMarkets: [],
      search: null,
    };
  },
  computed: {
    searchCountry() {
      const list = this.country.filter((x) => !this.hotel.contract.country.map((y) => y._id).includes(x._id));
      return list.length > 0 ? list.filter((country) => (country.name && country.name.toLowerCase()).includes(this.search && this.search.toLowerCase())).slice(0, 30) : [];
    },
    hotel() {
      return this.hotelData;
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
      this.hotel.contract.country = this.country.filter((x) => this.hotel.contract.country.includes(x._id));
      let currentHotel = cloneDeep(store.getters['hotel/getHotel']);
      currentHotel = currentHotel.length > 0 ? currentHotel.find((x) => x.id === this.hotel.id) : null;
      console.log(currentHotel);
      if (currentHotel) {
        const hotelMarket = [];
        const hotelCountry = [];
        currentHotel.contract.map((x) => x.market.forEach((y) => hotelMarket.push(y)));
        currentHotel.contract.map((x) => x.country.forEach((y) => hotelCountry.push(y)));
        this.markets = this.markets.filter((x) => !hotelMarket.includes((x._id)));
        this.country = this.country.filter((x) => !hotelCountry.includes((x._id)));
      }
    },
    selectAllMarket() {
      this.checkedMarkets = this.markets.map((x) => x._id);
    },
    removeAllMarket() {
      this.checkedMarkets = [];
    },
    addCountry(item) {
      this.hotel.contract.country.push(item);
    },
    removeCountry(item) {
      this.hotel.contract.country = this.hotel.contract.country.filter((x) => x !== item);
    },
    checkedMarket(item) {
      if (this.checkedMarkets.findIndex((x) => x._id === item._id) >= 0) {
        this.checkedMarkets = this.checkedMarkets.filter((x) => x._id !== item._id);
        this.hotel.contract.country = this.hotel.contract.country.filter((x) => !item.country_id.map((y) => y._id).includes(x._id));
      } else {
        this.checkedMarkets.push(item);
        this.hotel.contract.country = this.hotel.contract.country.concat(item.country_id);
      }
    },
    nextData() {
      this.hotel.contract.market = this.checkedMarkets;
      this.next(this.hotel, 'finish');
      this.finish();
    },
  },
  created() {
    this.getData();
  },
};
</script>
<template>
<div>
  <div class="card-group d-flex flex-wrap">
    <div class="card text-dark m-2 col-3" style="max-width: 18rem;" v-for="m in markets" :key="m">
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
          <input type="checkbox" class="form-check-input" v-on:change="checkedMarket(m)">
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
            <li v-for="item in hotel.contract.country" :key="item._id">
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
</template>
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

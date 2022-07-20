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
          <input type="checkbox" v-model="checkedMarkets" class="form-check-input" :id="m._id" :value="m._id">
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
            <li v-for="item in getContractCountry()" :key="item">
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
    <!-- <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>-->
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="save" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save and Close </button>
  </div>
</div>
</template>
<script>
import store from '@/state';
import {
  cloneDeep, difference,
} from 'lodash';
import 'flag-icons/css/flag-icons.min.css';

export default {
  props: ['data', 'next', 'close'],
  data() {
    return {
      hotel: cloneDeep(this.data),
      country: [],
      markets: [],
      checkedMarkets: [],
      search: null,
      onMounted: false,
    };
  },
  computed: {
    searchCountry() {
      const list = this.country.filter((x) => {
        const a = [];
        this.hotel.contract.map((c) => c.country.map((y) => y._id)).map((y) => y.map((z) => a.push(z)));
        return !a.includes(x._id);
      });
      return list.length > 0 ? list.filter((country) => (country.name && country.name.toLowerCase()).includes(this.search && this.search.toLowerCase())).slice(0, 30) : [];
    },
  },
  methods: {
    async getData() {
      if (store.getters['market/getMarket']) {
        this.markets = this.markets.length < 1 ? await cloneDeep(store.getters['market/getMarket']) : true;
        this.country = this.country.length < 1 ? await cloneDeep(store.getters['market/getCountry']) : true;
      } else {
        await this.$store.dispatch('market/getCountry');
        await this.$store.dispatch('market/getMarket');
        this.country = await cloneDeep(store.getters['market/getCountry']);
        this.markets = await cloneDeep(store.getters['market/getMarket']);
      }
      this.checkedMarkets = [...this.hotel.contract.find((x) => x._id === this.hotel.selectedContract._id).market.map((y) => y._id)];
      this.hotel.contract.filter((x) => x._id !== this.hotel.selectedContract._id).forEach((x) => {
        this.markets = this.markets.filter((y) => !x.market.map((z) => z._id).includes(y._id));
        this.country = this.country.filter((y) => !x.country.map((z) => z._id).includes(y._id));
      });
    },
    getContractCountry() {
      const i = this.hotel.contract.findIndex((x) => x._id === this.hotel.selectedContract._id);
      return this.hotel.contract[i].country;
    },
    addCountry(item) {
      const i = this.hotel.contract.findIndex((x) => x._id === this.hotel.selectedContract._id);
      this.hotel.contract[i].country.push(item);
    },
    removeCountry(item) {
      const i = this.hotel.contract.findIndex((x) => x._id === this.hotel.selectedContract._id);
      this.hotel.contract[i].country = this.hotel.contract[i].country.filter((x) => x !== item);
    },
    async save() {
      const i = this.hotel.contract.findIndex((x) => x._id === this.hotel.selectedContract._id);
      this.hotel.contract[i].market = this.markets.filter((x) => this.checkedMarkets.includes(x._id));
      await this.$store.dispatch('hotel/updateHotelMarket', cloneDeep(this.hotel));
      await this.close(this.hotel.id);
    },
  },
  watch: {
    checkedMarkets(newValue, old) {
      const i = this.hotel.contract.findIndex((x) => x._id === this.hotel.selectedContract._id);
      const newItem = this.markets.find((x) => (difference(newValue, old)).includes(x._id));
      const removeItem = this.markets.find((x) => (difference(old, newValue)).includes(x._id));

      if (newItem) {
        if (this.onMounted) {
          this.hotel.contract[i].market.push(newItem._id);
          this.hotel.contract[i].country = this.hotel.contract[i].country.concat(newItem.country_id.filter((x) => !this.hotel.contract[i].country.map((y) => y._id).includes(x._id)));
        } else {
          this.onMounted = true;
        }
      }
      if (removeItem) {
        this.hotel.contract[i].market = this.hotel.contract[i].market.filter((x) => x !== removeItem._id);
        this.hotel.contract[i].country = this.hotel.contract[i].country.filter((x) => !removeItem.country_id.map((y) => y._id).includes(x._id));
      }
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

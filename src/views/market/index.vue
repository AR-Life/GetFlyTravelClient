<template>
<layout>
  <PageHeader title='Markets' />
  <!-- Tables Without Borders -->
  <div class="row">
    <div class="card">
      <div class="card-body">
        <table class="table table-borderless table-nowrap">
          <thead>
            <tr>
              <th scope="col">Market Name</th>
              <th scope="col">Sub-Market Name</th>
              <th scope="col">Country</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in markets" :key="item._id" class="border-bottom">
              <td>{{item.mainMarketName}}</td>
              <td>{{item.subMarketName}}</td>
              <td>
                <ol>
                  <li v-for="it in  item?.country_id" :key="it._id">
                    <span :class="['fi fi-'+it.code]"></span>
                    <span>&nbsp;&nbsp;{{it.name}}</span>
                  </li>
                </ol>
              </td>
              <td>
                <div class="hstack gap-3 fs-15">
                  <a @click="market = item" @keyup="market = item" class="link-primary" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">
                    <i class="ri-settings-4-line"></i>
                  </a>
                  <a @click="market = item" @keyup="market = item" data-bs-toggle="modal" data-bs-target=".bs-example-modal-center" class="link-danger">
                    <i class="ri-delete-bin-5-line"></i>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <update>
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
            <div class="hstack gap-2 justify-content-end">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
              <button @click="save" type="submit" class="btn btn-primary" data-bs-dismiss="modal"> Save and Close </button>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
      <div class="d-flex -justify-content-between">
        <ol class="col-6" style="column-count: 2;">
          <li v-for="item in searchCountry" :key="item._id">
            <span v-on:click="addCountry(item)" @keydown="addCountry(item)">
              <span :class="['fi fi-'+item.code]"></span> {{item.name}}
            </span>
          </li>
        </ol>
        <ol class="col-6">
          <li v-for="item in market.country_id" :key="item._id" :item="item.name">
            <span v-on:click="removeCountry(item)" @keydown="removeCountry(item)">
              <span :class="['fi fi-'+item.code]"></span> {{item.name}}
            </span>
          </li>
        </ol>
      </div>
    </div>
  </update>
  <div class="modal fade bs-example-modal-center" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center p-5">
          <Vue3Lottie :animationData="loadingData" colors="primary:#121331,secondary:#08a88a" style="width: 120px; height: 120px"></Vue3Lottie>
          <div class="mt-4">
            <h4 class="mb-3">Silmek istediğinize emin misiniz?</h4>
            <div class="hstack gap-2 justify-content-center">
              <button type="button" class="btn btn-light" data-bs-dismiss="modal"> HAYIR </button>
              <a @click="removeItem()" @keyup="removeItem()" class="btn btn-danger" data-bs-dismiss="modal">EVET</a>
            </div>
          </div>
        </div>
      </div>
      <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
  </div>
</layout>
</template>
<script>
/* eslint-disable prefer-spread */
import PageHeader from '@/components/page-header.vue';
import 'flag-icons/css/flag-icons.css';
import layout from '@/components/layouts/main.vue';
import update from '@/components/widgets/modal-xl.vue';
import {
  Vue3Lottie,
} from 'vue3-lottie';
import 'vue3-lottie/dist/style.css';
import store from '@/state';
import appAxios from '@/utils/appAxios';
import {
  cloneDeep,
} from 'lodash';

export default {
  components: {
    layout,
    PageHeader,
    update,
    Vue3Lottie,
  },
  data() {
    return {
      markets: [],
      country: [],
      market: {
        mainMarketName: null,
        subMarketName: null,
        _id: null,
        country_id: [],
      },
      search: null,
      loadingData: require('@/components/widgets/hrqwmuhr.json'),
    };
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
    removeItem() {
      appAxios.appAxios.get(`/market/destroy/${this.market._id}`).then(() => {
        this.markets = this.markets.filter((e) => e._id !== this.market._id);
        this.$store.commit('market/deleteMarket', this.market);
      });
    },
    save() {
      this.market.country_id = this.market.country_id.map((x) => x._id);
      appAxios.appAxios.post(`market/edit/${this.market._id}`, this.market).then(() => {
        this.market.country_id = this.country.filter((x) => this.market.country_id.includes(x._id));
        this.$store.commit('market/setMarket', cloneDeep(this.market));
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

<template>
<table v-if="select" class="table table-borderless table-nowrap">
    <thead>
        <tr>
            <th scope="col">Id</th>
            <th scope="col">Main Market</th>
            <th scope="col">Sub Market</th>
            <th scope="col">Season</th>
            <th scope="col">Season from-to</th>
            <th scope="col">Currency</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="[i, c] in hotel.contract.entries()" :key="c">
            <th scope="row">{{i + 1}}</th>
            <td><span v-for="market in c.market" :key="market">({{market.mainMarketName}})</span></td>
            <td><span v-for="market in c.market" :key="market">({{market.subMarketName}})</span></td>
            <td>{{c.season}}</td>
            <td>{{getDate(c.seasonFromTo.start)}} - {{getDate(c.seasonFromTo.end)}}</td>
            <td>{{c.currency}}</td>
            <td>
                <div class="hstack gap-3 fs-15">
                    <a @click="selectContract(c._id)"  role="presentation" class="link-primary"><i class="ri-edit-2-line"></i></a>
                </div>
            </td>
        </tr>
    </tbody>
</table>
          <div class="row" v-else>
            <div class="col-4">
              <div class="row me-2 mb-2">
                <button class="btn btn-primary" @click="next(hotel, 'info')" >Otel Bilgileri</button>
              </div>
              <div class="row me-2">
                <button class="btn btn-primary" @click="next(hotel, 'period')" >Period</button>
              </div>
            </div>
            <div class="col-4">
              <div class="row me-2 mb-2">
                <button class="btn btn-primary" @click="next(hotel, 'room')" >Oda</button>
              </div>
              <div class="row me-2">
                <button class="btn btn-primary" @click="next(hotel, 'pricePerPerson')" >Kişi Başı Ücret</button>
              </div>
            </div>
            <div class="col-4">
              <div class="row">
                <button class="btn btn-primary mb-2" @click="next(hotel, 'periodCalc')" >Çarpan</button>
              </div>
              <div class="row">
                <button class="btn btn-primary"  @click="next(hotel, 'market')">Market</button>
              </div>
            </div>
          </div>
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button v-if="!select" @click="selectContract(null)" type="button" class="btn btn-light"> Back </button>
    <button @click="close(data.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
  </div>
</div>
</template>
<script>
import store from '@/state';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export default {
  props: ['data', 'close', 'next'],
  data() {
    return {
      hotelData: this.data,
      markets: [],
      country: [],
      select: true,
    };
  },
  computed: {
    hotel() {
      const returnData = cloneDeep(this.hotelData);
      returnData.contract = returnData.contract.map((x) => {
        const contract = x;
        contract.market = this.markets.filter((z) => contract.market.includes(z._id));
        contract.country = this.country.filter((z) => contract.country.includes(z._id));
        return contract;
      });

      return returnData;
    },
  },
  methods: {
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
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
    },
    selectContract(cId) {
      if (cId === null) {
        this.select = true;
      } else {
        this.hotel.selectedContract = this.hotel.contract.find((x) => x._id === cId);
        this.select = false;
      }
    },
  },
  created() {
    this.getData();
    this.select = !(('selectedContract' in this.hotel) && this.hotel.selectedContract.length > 0);
  },
};
</script>

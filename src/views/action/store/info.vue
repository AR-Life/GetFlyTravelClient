<template>
<div class="row g-3">
  <h4 class="col-4 d-flex justify-content-center pt-3 text-success">{{hotel.info.name}}</h4>
  <div class="col-sm-4">
    <label class="form-label">Action Date</label>
    <flatpickr v-model="action.actionDate" :config="config" class="form-control flatpickr-input form-control-sm" />
  </div>
  <div class="col-sm-4">
    <label class="form-label">Action Series</label>
    <input v-model="action.actionSeries" type="text" class="form-control form-control-sm" placeholder="S001" />
  </div>
  <div class="col-sm-4">
    <div>
      <label class="form-label">Sales Date</label>
      <flatpickr v-model="action.salesDate.start" :config="config" class="form-control flatpickr-input form-control-sm" placeholder="start" />
    </div>
    <div class="mt-2">
      <flatpickr v-model="action.salesDate.end" :config="config" class="form-control flatpickr-input form-control-sm" placeholder="end" />
    </div>
  </div>
  <div class="col-sm-4">
    <div>
      <label class="form-label">checkIn Date</label>
      <flatpickr v-model="action.checkInDate.start" :config="config" class="form-control flatpickr-input form-control-sm" placeholder="start" />
    </div>
    <div class="mt-2">
      <flatpickr v-model="action.checkInDate.end" :config="config" class="form-control flatpickr-input form-control-sm" placeholder="end" />
    </div>
  </div>
  <div class="col-4">
    <div class="col-3 form-check form-switch form-check-success form-check-right pt-4">
      <input class="form-check-input" v-model="action.stayAndArrival" v-on:change="changePeriod" type="checkbox">
      <label class="form-check-label" for="flexSwitchCheckRightDisabled">Arrival/Stay</label>
    </div>
    <div class="col-3 offset-3 form-check form-switch form-check-success form-check-right pt-4">
      <input class="form-check-input" v-model="action.combine" v-on:change="changePeriod" type="checkbox">
      <label class="form-check-label" for="flexSwitchCheckRightDisabled">Combine</label>
    </div>
    <div>
      <select v-model="action.type" class="form-select form-select-sm  my-3">
        <option disabled value="null">Choose action type</option>
        <option value="normal">Normal Action</option>
        <option value="earlyBooking">Early Booking</option>
        <option value="stopSale">Stop Sale</option>
        <option value="freeSale">Free Sale</option>
        <option value="dayPromotion">Day Promotion</option>
        <option value="longStay">Long Stay</option>
        <option value="honeyMoon">Honeymoon</option>
      </select>
    </div>
  </div>
</div>
  <h6>Select Market:</h6>
<div class="row border-bottom border-success mb-1">
  <div class="col-1"><b>Seç</b></div>
  <div class="col-5"><b>Market</b></div>
  <div class="col-6"><b>Ülke</b></div>
</div>
<div class="row border-bottom border-primary mb-1" v-for="m in market" :key="m">
<div class="col-1 d-flex align-items-center"><input type="checkbox" :id="m.contractId" v-model="action.contract" :value="m"/></div>
<div class="col-5 align-items-center d-flex"><table><tr v-for="marketInMarket in m.market" :key="marketInMarket"><td v-if="'subMarketName' in marketInMarket"><label :for="m.contractId"><span>{{marketInMarket.mainMarketName }} » </span><span>{{marketInMarket.subMarketName}}</span></label></td><td v-else><label :for="m.contractId"><span>Market Bulunamadı</span></label></td></tr></table></div>
<div class="col-6 d-flex align-items-center"><span class="row"><span class="border-1 col-1" v-for="c in m.country" :key="c"><span :class="['fi fi-'+c.code]" :title="c.name"></span><span>{{c.code.toUpperCase()}}</span></span></span></div>
</div>

<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button :disabled="validation" @click="save" type="button" class="btn btn-primary"> Save and Close </button>
  </div>
</div>
</template>
<script>
import flatpickr from 'vue-flatpickr-component';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';
import 'flag-icons/css/flag-icons.min.css';
import { cloneDeep } from 'lodash';
import store from '@/state';

export default {
  components: {
    flatpickr,
  },
  props: ['data', 'close', 'next'],
  data() {
    // eslint-disable-next-line no-return-assign
    return {
      hotel: cloneDeep(this.data),
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'd/m/Y',
        allowInput: true,
        altInput: true,
        dateFormat: 'Y-m-d',
      },
      action: {
        type: null,
        contract: [],
        market: [],
        country: [],
        room: [],
        stayAndArrival: true,
        actionSeries: null,
        salesDate: {
          start: null,
          end: null,
        },
        checkInDate: {
          start: null,
          end: null,
        },
        combine: false,
        actionDate: Date.now(),
      },
      markets: store.getters['market/getMarket'],
      country: cloneDeep(store.getters['market/getCountry']),
    };
  },
  computed: {
    validation() {
      /*
      // burası çalışıyor sadece debug modunda olduğumuzdan aktif etmiyoruz :)
      let show = this.action.type === null;
      show = show === true ? show : this.action.salesDate.start === null;
      show = show === true ? show : this.action.salesDate.end === null;
      show = show === true ? show : this.action.checkInDate.start === null;
      show = show === true ? show : this.action.checkInDate.end === null;
      show = show === true ? show : this.action.contract.length < 1;
      */
      return false;
    },
    market() {
      return this.hotel.contract.map((c) => {
        const returnData = {
          contractId: c._id,
          market: [],
          country: [],
        };
        if (c.market.length > 0) {
          returnData.market = this.markets.filter((x) => c.market.includes(x._id));
          returnData.country = this.country.filter((x) => c.country.includes(x._id));
        } else {
          returnData.market.push({});
          returnData.country = this.country.filter((x) => c.country.includes(x._id));
        }
        return returnData;
      });
    },
  },
  methods: {
    changePeriod() {
      console.log(this.action);
    },
    save() {
      const country = [];
      this.action.contract.map((x) => x.country.forEach((y) => {
        country.push(y);
      }));
      this.action.market = this.action.contract.map((x) => x.market);
      this.action.country = country;
      this.action.contract = this.action.contract.map((x) => x.contractId);
      this.hotel.action = this.action;
      this.next(this.hotel, this.action.type);
    },
  },
  mounted() {
    console.log(this.hotel);
  },
};
</script>

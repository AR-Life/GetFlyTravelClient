<template>
<div v-if="actions(selectedContract)">
    <div class="row border-bottom border-success mb-1">
        <div class="col-1">
            <b>Seç</b>
        </div>
        <div class="col-5">
            <b>Market</b>
        </div>
        <div class="col-6">
            <b>Ülke</b>
        </div>
    </div>
    <div  v-for="(m,i) in market" :key="m" :class="['row border-bottom border-primary pb-1',{ 'bg-light': i % 2 }]">
        <div class="col-1 d-flex align-items-center">
                  <a @click="actions(m.contractId)" role="presentation" class="link-primary">
                    <i class="ri-eye-line"></i>
                  </a>
        </div>
        <div class="col-5 align-items-center d-flex">
            <table>
                <tr v-for="marketInMarket in m.market" :key="marketInMarket">
                    <td v-if="'subMarketName' in marketInMarket">
                        <label :for="m.contractId">
                            <span class="pe-2">({{m.currency}})</span>
                            <span>{{marketInMarket.mainMarketName }} » </span>
                            <span>{{marketInMarket.subMarketName}}</span>
                        </label>
                    </td>
                    <td v-else>
                        <label :for="m.contractId">
                            <span class="pe-2">({{m.currency}})</span>
                            <span>Market Bulunamadı</span>
                        </label>
                    </td>
                </tr>
            </table>
        </div>
        <div class="col-6 d-flex align-items-center">
            <span class="row">
                <span class="border-1 col-1" v-for="c in m.country" :key="c">
                    <span :class="['fi fi-'+c.code]" :title="c.name"></span>
                    <span>{{c.code.toUpperCase()}}</span>
                </span>
            </span>
        </div>
    </div>
    </div>
<div v-else>
  <div class="row border-bottom border-success pb-3">
    <div class="col-2"><input v-model="series" type="text" class="form-control form-control-sm" placeholder="S001" /></div>
    <div class="col-2"><select v-model="type" class="form-select form-select-sm" placeholder="Type">
        <option value="null"></option>
        <option value="normal">Normal Action</option>
        <option value="earlyBooking">Early Booking</option>
        <option value="stopSale">Stop Sale</option>
        <option value="freeSale">Free Sale</option>
        <option value="dayPromotion">Day Promotion</option>
        <option value="longStay">Long Stay</option>
        <option value="honeyMoon">Honeymoon</option>
      </select></div>
    <div class="col-3 text-center"><input type="date" v-model="salesDate" /></div>
    <div class="col-3 text-center"><input type="date" v-model="checkInDate" /></div>
    <div class="col-2 form-check form-switch form-check-success d-flex justify-content-center"><select v-model="stayAndArrival" class="form-select form-select-sm" placeholder="Arrival/Stay">
        <option value="null"></option>
        <option value="false">Arrival</option>
        <option value="true">Stay</option>
      </select></div>
  </div>
  <div v-for="(action, i) in actionList" :key="i" style="cursor:pointer" :class="['row border-bottom border-primary pb-1',{ 'bg-light': i % 2 }]" role="presentation" v-on:click="getAction(action)" >
    <div class="col-2 text-center ">{{action.series}}</div>
    <div class="col-2 text-center">{{action.type}}</div>
    <div class="col-3 text-center">{{getDate(action.salesDate.start)}} - {{getDate(action.salesDate.end)}}</div>
    <div class="col-3 text-center">{{getDate(action.checkInDate.start)}} - {{getDate(action.checkInDate.end)}}</div>
    <div class="col-2 text-center">{{action.stayAndArrival ? 'Stay': 'Arrival'}}</div>
  </div>
</div>
</template>
<script>
import store from '@/state';
import { cloneDeep } from 'lodash';
import moment from 'moment';

export default {
  props: ['data'],
  data() {
    return {
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'd/m/Y',
        allowInput: true,
        altInput: true,
        dateFormat: 'Y-m-d',
      },
      selectedContract: null,
      hotel: this.data,
      markets: store.getters['market/getMarket'],
      country: cloneDeep(store.getters['market/getCountry']),
      series: null,
      type: null,
      stayAndArrival: null,
      salesDate: null,
      checkInDate: null,
    };
  },
  computed: {
    market() {
      return this.hotel.contract.map((c) => {
        const returnData = {
          currency: c.currency,
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
    actionData() { return this.hotel.contract.find((x) => x._id === this.selectedContract)?.action; },
    actionList() {
      let data = this.actionData;
      if (this.series) {
        data = data.filter((action) => (action.series.toLowerCase()).includes(this.series && this.series.toLowerCase()));
      }
      if (this.type) {
        data = data.filter((action) => (action.type === this.type));
      }
      if (this.stayAndArrival != null) {
        data = data.filter((action) => action.stayAndArrival.toString() === this.stayAndArrival);
      }
      if (this.salesDate != null) {
        data = data.filter((action) => moment(action.salesDate.start).format('DD/MM/YYYY') <= moment(this.salesDate).format('DD/MM/YYYY') && moment(this.salesDate).format('DD/MM/YYYY') <= moment(action.salesDate.end).format('DD/MM/YYYY'));
      }
      if (this.checkInDate != null) {
        data = data.filter((action) => moment(action.checkInDate.start).format('DD/MM/YYYY') <= moment(this.checkInDate).format('DD/MM/YYYY') && moment(this.checkInDate).format('DD/MM/YYYY') <= moment(action.checkInDate.end).format('DD/MM/YYYY'));
      }
      return data;
    },
  },
  methods: {
    actions(id) {
      if (id == null) {
        return true;
      }
      this.selectedContract = id;
      return false;
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY');
    },
    getAction(data) {
      console.log(data, this.salesDate);
    },
  },

};
</script>

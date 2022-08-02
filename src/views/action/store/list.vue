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
    <div class="row border-bottom border-primary mb-1" v-for="m in market" :key="m">
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
<div v-else class="row" v-for="action in hotel.contract.find((x) => x._id === selectedContract)?.action" :key="action">{{action}}</div>
</template>
<script>
import store from '@/state';
import { cloneDeep } from 'lodash';

export default {
  props: ['data'],
  data() {
    return {
      selectedContract: null,
      hotel: this.data,
      markets: store.getters['market/getMarket'],
      country: cloneDeep(store.getters['market/getCountry']),
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
  },
  methods: {
    actions(id) {
      if (id == null) {
        return true;
      }
      this.selectedContract = id;
      return false;
    },
  },

};
</script>

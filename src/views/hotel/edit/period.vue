<template>
<div class="row">
  <ol>
    <li style="list-style: none;">
      <div class="row text-center">
        <div class="col-2"> Start Time </div>
        <div class="col-2"> End Time </div>
        <div class="col-2"> Arrival/Stay </div>
        <div class="col-2"> Release </div>
        <div class="col-2"> Min Stay </div>
        <div class="col-2">
          <span class="ri ri-delete-bin-2-line"></span>
        </div>
      </div>
    </li>
  </ol>
  <ol class="px-3" style="list-style-type: upper-alpha" v-if="hotel.period.length > 0">
    <li class="my-2" v-for="item in listItem()" :key="item" :item="item">
      <div class="row">
        <div class="col-2">
          <flatpickr v-model="item.startDate" :config="config" v-on:change="changeItem(item)" class="form-control flatpickr-input form-control-sm"></flatpickr>
        </div>
        <div class="col-2">
          <flatpickr v-model="item.endDate" :config="config" v-on:change="changeItem(item)" class="form-control flatpickr-input form-control-sm"></flatpickr>
        </div>
        <div class="col-2">
          <div class="form-check form-switch form-switch-lg form-switch-success mb-3 d-flex justify-content-center">
            <input v-model="item.stayAndArrival" v-on:change="changeItem(item)" class="form-check-input " type="checkbox" id="SwitchCheck3">
          </div>
        </div>
        <div class="col-2">
          <input v-model="item.release" @focus="$event.target.select()"  v-on:change="changeItem(item)" type="number" class="form-control form-control-sm">
        </div>
        <div class="col-2">
          <input v-model="item.minStay" @focus="$event.target.select()" v-on:change="changeItem(item)" type="number" class="form-control form-control-sm">
        </div>
        <div class="col-2 text-center">
          <button class="btn" type="button" @click="deleteItem(item)">
            <span class="ri ri-delete-bin-2-line"></span>
          </button>
        </div>
      </div>
    </li>
  </ol>
  <button type="button" class="btn btn-primary" @click="addNew">ADD NEW</button>
</div>
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button v-if="!addnew" @click="save" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save and Close </button>
    <button v-if="addnew" @click="pppSettings" type="button" class="btn btn-primary">Price Per Person Settings </button>
  </div>
</div>
</template>
<script>
import {
  cloneDeep,
  random,
  groupBy,
} from 'lodash';
import state from '@/state';
import appAxios from '@/utils/appAxios';
import flatpickr from 'vue-flatpickr-component';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';

export default {
  props: ['data', 'next', 'close'],
  data() {
    return {
      hotelData: this.data,
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'd/m/Y',
        allowInput: true,
        altInput: true,
        dateFormat: 'Y-m-d',
      },
      addnew: false,
      deletePeriod: [],
      changePeriod: [],
    };
  },
  computed: {
    hotel() {
      return this.hotelData;
    },
  },
  methods: {
    listItem() {
      return this.hotel.period.filter((x) => x.contract_id === this.hotel.selectedContract._id);
    },
    addNew() {
      const newperiod = {
        _id: Math.floor(Math.random() * 1000) + 1,
        startDate: null,
        endDate: null,
        stayAndArrival: true,
        release: null,
        minStay: null,
        contract_id: this.hotel.selectedContract._id,
      };
      this.hotel.period = this.hotel.period.filter((x) => typeof x._id === 'number');
      this.hotel.period.push(newperiod);
      this.addnew = true;
    },
    pppSettings() {
      this.hotel.pricePerPerson = [];
      this.hotel.room.forEach((r) => {
        this.hotel.period.forEach((p) => {
          this.hotel.pricePerPerson.push({
            period_id: p._id,
            room_id: r._id,
            purchasePrice: 0,
            salesPrice: 0,
          });
        });
      });
      const per = groupBy(this.hotel.pac, 'period_id');
      const pacItems = [];
      per[Object.keys(per)[0]].forEach((x) => {
        pacItems.push(x);
      });
      this.hotel.pac = [];
      this.hotel.period.forEach((p) => {
        pacItems.forEach((x) => {
          let item = null;
          item = cloneDeep(x);
          item.period_id = p._id;
          item._id = `${random(1, 1000)}${random(1, 1000)}`;
          item.calc = 0;
          if ('age' in item) {
            for (let j = 0; j < item.age.length; j += 1) {
              item.age[j].calc = 0;
              item.age[j].id = random(10000, 1000000);
            }
          }
          this.hotel.pac.push(item);
        });
      });
      this.next(this.hotel, 'pricePerPerson');
    },
    deleteItem(item) {
      if (this.hotel.period.length > 1) {
        this.deletePeriod.push(item._id);
        this.hotel.period = this.hotel.period.filter((x) => x._id !== item._id);
      }
      // bu burayı güncellerken lazım olacak paşam console.log(this.hotel.period.filter((x) => !this.deletePeriod.includes(x)));
      // console.log(cloneDeep(this.hotel.pac.filter((p) => !this.deletePeriod.some((dp) => dp._id === p.period_id))));
    },
    changeItem(item) {
      if (this.changePeriod.findIndex((x) => x._id === item._id) < 1) {
        this.changePeriod.push(item._id);
      }
    },

    save() {
      if (this.deletePeriod.length > 0) {
        appAxios.appAxios.post('period/destroy', this.deletePeriod).catch((e) => console.log(e));
        // const oldHotel = cloneDeep(state.getters['hotel/getHotel']);
        // const i = oldHotel.findIndex((x) => x.id === this.hotel.id);
        // oldHotel[i].period = this.hotel.period.filter((x) => !this.deletePeriod.includes(x));
        // oldHotel[i].pricePerPerson = this.hotel.pricePerPerson.filter((p) => !this.deletePeriod.some((dp) => dp._id === p.period_id));
        // oldHotel[i].pac = this.hotel.pac.filter((p) => !this.deletePeriod.some((dp) => dp._id === p.period_id));
      }
      // state.commit({ type: 'hotel/changeHotelValue', data: { hotel: this.hotel, contract: this.hotel.contract[0]._id, type: 'period' } });

      appAxios.appAxios.post(`/period/edit/${this.hotel.id}`, this.hotel.period.filter((x) => this.changePeriod.includes(x._id))).then(() => {
        const data = {
          id: this.hotel.id,
          delete: this.deletePeriod,
          period: this.hotel.period.filter((x) => this.changePeriod.includes(x._id)),
          contract: this.hotel.selectedContract._id,
          type: 'period',
        };
        state.commit('hotel/changeHotelValue', data);
        this.close(this.hotel.id);
      });
    },
  },
  components: {
    flatpickr,
  },
};
</script>

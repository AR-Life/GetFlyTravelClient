<script>
import {
  cloneDeep,
} from 'lodash';
import state from '@/state';
import appAxios from '@/utils/appAxios';

export default {
  props: ['data', 'next', 'close'],
  data() {
    return {
      hotelData: this.data,
      changePricePerPerson: [],
    };
  },
  computed: {
    hotel() {
      return this.hotelData;
    },
  },
  methods: {
    listItem() {
      const period = this.hotel.period.filter((x) => x.contract_id === this.hotel.selectedContract._id);
      return this.hotel.pricePerPerson.filter((x) => period.map((y) => y._id).includes(x.period_id));
    },
    getPeriodDate(periodId) {
      const per = this.hotel.period.findIndex((x) => x._id === periodId);
      return `${this.hotel.period[per]?.startDate.slice(0, 10)} - ${this.hotel.period[per]?.endDate.slice(0, 10)}`;
    },
    changeValue(item) {
      const i = this.changePricePerPerson.findIndex((x) => x._id === item._id);
      if (i < 0) {
        this.changePricePerPerson.push(item);
      } else {
        this.changePricePerPerson[i] = item;
      }
    },
    save() {
      appAxios.appAxios.post(`/priceperperson/edit/${this.hotel.id}`, this.changePricePerPerson).then((response) => {
        const oldHotel = cloneDeep(state.getters['hotel/getHotel'].find((x) => x.id === this.hotel.id));
        delete oldHotel.pricePerPerson;
        oldHotel.pricePerPerson = this.hotel.pricePerPerson;
        state.commit('hotel/setHotel', oldHotel);
        this.close(this.hotel.id);
      });
    },
  },
};
</script>
<template>
<div class="row" v-for="room in hotel.room" :key="room">
  <div class="col-12">
    <div class="card">
      <div class="card-header align-items-center d-flex bg-success">
        <h4 class="card-title mb-0 flex-grow-1 text-white">{{room.name}}</h4>
        <button type="button" class="btn btn-primary" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room._id]" aria-expanded="true" :aria-controls="['roomCardBody'+room._id]"> göster/gizle</button>
      </div>
      <!-- end card header -->
      <div class="card-body bg-soft-success collopse collapse" :id="['roomCardBody'+room._id]">
        <div class="live-preview">
          <div class="row">
            <ol>
              <li style="list-style: none;">
                <div class="row text-center">
                  <div class="col-3"> Period Date </div>
                  <div class="col-3"> Buying Price Per Person </div>
                  <div class="col-3"> Sales Price Per Person </div>
                </div>
              </li>
            </ol>
            <ol class="px-3" style="list-style-type: upper-alpha">
              <li class="my-2" v-for="p in listItem().filter((x) => x.room_id === room._id)" :key="p">
                <div class="row">
                  <div class="col-3 text-center">
                    <label>{{getPeriodDate(p.period_id)}}</label>
                  </div>
                  <div class="col-3">
                    <input v-model="p.purchasePrice" v-on:change="changeValue(p)" @focus="$event.target.select()" type="number" class="form-control">
                  </div>
                  <div class="col-3">
                    <input v-model="p.salesPrice" v-on:change="changeValue(p)" @focus="$event.target.select()" type="number" class="form-control">
                  </div>
                </div>
              </li>
            </ol>
          </div>
          <!--end row-->
        </div>
      </div>
    </div>
  </div>
</div>
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button v-if="typeof hotel.period[0]._id === 'number'" @click="next(hotel, 'periodCalc')" type="button" class="btn btn-primary">Calc Settings</button>
    <button v-else-if="typeof hotel.room[0]._id === 'number'" @click="next(hotel, 'accomodation')" type="button" class="btn btn-primary">Accomodation Settings </button>
    <button v-else @click="save" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save and Close </button>
  </div>
</div>
</template>

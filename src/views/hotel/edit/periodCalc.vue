<template>
<div class="card shadow-none">
  <div class="card-body">
    <ul class="nav nav-pills nav-justified mb-3" role="tablist">
      <li class="nav-item waves-effect waves-light" v-for="(per, i) in getPeriod()" :key="per">
        <a :class="{'nav-link': true, active: i === 0}" data-bs-toggle="tab" :href="['#per'+per._id]" role="tab"> {{alphabet(i+1)}} </a>
      </li>
    </ul>
    <!-- Tab panes -->
    <div class="tab-content text-muted">
      <div v-for="(per, i) in getPeriod()" :key="per" :class="{'tab-pane': true, active: i === 0}" :id="['per'+per._id]" role="tabpanel">
        <div class="row my-2" v-for="room in hotel.room" :key="room">
          <a class="btn" data-bs-toggle="collapse" :href="['#room'+room._id]" role="button" aria-expanded="false" :aria-controls="['room'+room._id]">
            <h5>{{room.name}}</h5>
          </a>
          <div class="collapse" :id="['room'+room._id]">
            <div class="row border-bottom py-2" v-for="item in getPac(per._id, room)" :key="item">
              <div class="col-2">
                <span v-show="item?.adultSize == 1"> Single </span>
                <span v-show="item?.adultSize == 2"> Double </span>
                <span v-show="item?.adultSize == 3"> Triple </span>
                <span v-show="item?.adultSize > 3"> {{item.adultSize}} Adult </span>
                <span v-if="item?.childSize != 0">+ {{item?.childSize}} Child </span>
              </div>
              <div class="col-10" v-if="item.age.length > 0">
                <div v-for="age in item.age" :key="age" class="row mb-2">
                  <div class="col-3">
                    <input v-model="age.calc" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?">
                  </div>
                  <div class="col-2">
                    <span>{{age.min}}</span>
                  </div>
                  <div class="col-2">
                    <span>{{age.max}}</span>
                  </div>
                  <div class="col-3 form-check form-switch form-switch-lg form-switch-success d-flex justify-content-center">
                    <span>{{age.year ? 'year' : 'mount'}}</span>
                  </div>
                </div>
              </div>
              <div v-else class="col-10">
                <div class="row">
                  <div class="col-3">
                    <input v-model="item.calc" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end card-body -->
</div>
<!-- end card -->
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="save" type="button" class="btn btn-primary" data-bs-dismiss="modal">Save and Close </button>
  </div>
</div>
</template>
<script>
import state from '@/state';
import appAxios from '@/utils/appAxios';
import {
  cloneDeep,
} from 'lodash';

export default {
  props: ['data', 'close', 'next'],
  data() {
    return {
      hotelData: this.data,
    };
  },
  computed: {
    hotel() {
      return this.hotelData;
    },
  },
  methods: {
    alphabet(i) {
      const a = 'abcdefghijklmnopqrstuvwxyz';
      return a.toUpperCase().charAt(i - 1);
    },
    getPeriod() {
      return this.hotel.period.filter((x) => x.contract_id === this.hotel.selectedContract._id);
    },
    listItem() {
      const period = this.hotel.period.filter((x) => x.contract_id === this.hotel.selectedContract._id);
      return this.hotel.pac.filter((x) => period.map((y) => y._id).includes(x.period_id));
    },
    getPac(periodId, room) {
      const roomId = room._id;
      return this.listItem().filter((x) => x.room_id === roomId && x.period_id === periodId);
    },
    async save() {
      let item = await state.getters['hotel/getHotel'];
      const i = await item.findIndex((x) => x.id === this.hotel.id);
      item = await cloneDeep(item[i]);
      if (typeof this.hotel.period[0]._id === 'number') {
        appAxios.appAxios.post('/period/create', this.hotel).then((response) => {
          response.data.periodItems.forEach((p) => {
            item.period.push(p);
          });
          response.data.pacItems.forEach((p) => {
            item.pac.push(p);
          });
          response.data.pricePerPersonItems.forEach((p) => {
            item.pricePerPerson.push(p);
          });
          state.commit('hotel/setHotel', item);
          this.close(this.hotel.id);
        });
      } else if (typeof this.hotel.room[0]._id === 'number') {
        appAxios.appAxios.post('/room/create', this.hotel).then((response) => {
          response.data.roomItems.forEach((p) => {
            item.room.push(p);
          });
          response.data.pacItems.forEach((p) => {
            item.pac.push(p);
          });
          response.data.pricePerPersonItems.forEach((p) => {
            item.pricePerPerson.push(p);
          });
          state.commit('hotel/setHotel', item);
          this.close(this.hotel.id);
        });
      } else {
        appAxios.appAxios.post('/pac/edit', this.hotel).then((response) => {
          item.pac = cloneDeep(response.data);
          state.commit('hotel/setHotel', item);
          this.close(this.hotel.id);
        });
      }
    },
  },
};
</script>

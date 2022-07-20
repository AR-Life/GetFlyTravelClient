<script>
import {
  cloneDeep,
  random,
} from 'lodash';
import state from '@/state';
import appAxios from '@/utils/appAxios';

export default {
  props: ['data', 'next', 'close'],
  data() {
    return {
      hotelData: cloneDeep(this.data),
      changeRoom: [],
      addnew: false,
      deleteItem: [],
    };
  },
  computed: {
    hotel() {
      return this.hotelData;
    },
  },
  methods: {
    changeValue(item) {
      const i = this.changeRoom.findIndex((x) => x._id === item._id);
      if (i < 0) {
        this.changeRoom.push(item);
      } else {
        this.changeRoom[i] = item;
      }
    },
    addNew() {
      const qot = this.hotel.room[0]?.qouta;
      const newroom = {
        _id: random(1, 1000),
        name: null,
        maxAdult: 0,
        maxChild: 0,
        qouta: qot,
      };
      this.hotel.room = this.hotel.room.filter((x) => typeof x._id === 'number');
      this.hotel.room.push(newroom);
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
      this.hotel.accomodation = [];
      if (this.hotel.room.length > 0) {
        this.hotel.room.forEach((x) => {
          for (let i = 1; i <= x.maxAdult; i += 1) {
            for (let j = 0; j <= x.maxChild; j += 1) {
              this.hotel.accomodation.push({
                id: this.hotel.accomodation.length + 1,
                room_id: x._id,
                adultSize: i,
                childSize: j,
                calc: random(0, 4),
                age: [],
              });
            }
          }
          if (this.hotel.accomodation.length > 0) {
            this.hotel.accomodation.forEach((y) => {
              for (let i = 1; i <= y.childSize; i += 1) {
                if (y.childSize > y.age.length) {
                  y.age.push({
                    id: y.age.length + 1,
                    min: random(0, 12.99).toFixed(2),
                    max: random(0, 12.99).toFixed(2),
                    year: true,
                    calc: random(0, 4),
                  });
                }
              }
            });
          }
        });
      }
      this.next(this.hotel, 'pricePerPerson');
    },
    deleteRoom(item) {
      if (this.hotel.room.length > 1) {
        this.deleteItem.push(item);
        this.hotel.room = this.hotel.room.filter((x) => x._id !== item._id);
      }
    },
    save() {
      if (this.deleteItem.length > 0) {
        appAxios.appAxios.post('room/destroy', this.deleteItem).then(() => {
          const oldHotel = cloneDeep(state.getters['hotel/getHotel']);
          const item = oldHotel.find((x) => x.id === this.hotel.id);
          item.room = this.hotel.room.filter((x) => !this.deleteItem.includes(x));
          item.pricePerPerson = this.hotel.pricePerPerson.filter((p) => !this.deleteItem.some((dp) => dp._id === p.room_id));
          item.pac = this.hotel.pac.filter((p) => !this.deleteItem.some((dp) => dp._id === p.room_id));
          state.commit('hotel/setHotel', item);
          this.close(this.hotel.id);
        });
      }
      appAxios.appAxios.post(`/room/edit/${this.hotel.id}`, this.changeRoom).then((response) => {
        state.commit('hotel/setHotel', this.hotel);
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
      <div class="card-body bg-soft-success collopse collapse" style="transition: 0ms;" :id="['roomCardBody'+room._id]">
        <div class="live-preview">
          <div class="row">
            <div class="col-4"> Room Name </div>
            <div class="col-2"> Max Adult </div>
            <div class="col-2"> Max Child </div>
            <div class="col-2"> Qouta </div>
            <div class="col-2"> Delete </div>
          </div>
          <div class="row">
            <div class="col-4 text-center">
              <input v-model="room.name" v-on:change="changeValue(room)" @focus="$event.target.select()" type="text" class="form-control">
            </div>
            <div class="col-2">
              <input v-if="typeof room._id === 'number'" v-model="room.maxAdult" @focus="$event.target.select()" type="text" class="form-control" />
              <label v-else>{{room.maxAdult}}</label>
            </div>
            <div class="col-2">
              <input v-if="typeof room._id === 'number'" v-model="room.maxChild" @focus="$event.target.select()" type="text" class="form-control" />
              <label v-else>{{room.maxChild}}</label>
            </div>
            <div class="col-2">
              <input v-model="room.qouta" v-on:change="changeValue(room)" @focus="$event.target.select()" type="number" class="form-control">
            </div>
            <div class="col-2">
              <button class="btn" @click="deleteRoom(room)" type="button">
                <span class="ri ri-delete-bin-2-line"></span>
              </button>
            </div>
          </div>
          <!--end row-->
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row mt-2">
  <button type="button" class="btn btn-primary" @click="addNew()">ADD NEW</button>
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

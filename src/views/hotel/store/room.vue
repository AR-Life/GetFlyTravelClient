<script>
import {
  random,
} from 'lodash';

export default {
  props: ['data', 'next'],
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
    addNew() {
      const qot = (this.hotel.room.length) > 0 ? this.hotel.room[0].qouta : 0;
      this.hotel.room.push({
        _id: this.hotel.room.length + 1,
        name: null,
        maxAdult: random(1, 5),
        maxChild: random(0, 3),
        qouta: qot,
      });
    },
    deleteRoom(item) {
      this.hotel.room = this.hotel.room.filter((i) => i._id !== item._id);
    },
    addPricePerPerson() {
      console.log(this.hotel);
      this.hotel.pricePerPerson = [];
      this.hotel.room.forEach((r) => {
        this.hotel.period.forEach((p) => {
          this.hotel.pricePerPerson.push({
            _id: this.hotel.pricePerPerson.length + 1,
            period_id: p._id,
            room_id: r._id,
            purchasePrice: random(10, 150),
            salesPrice: random(10, 150),
          });
        });
      });
    },
    addPac() {
      console.log(this.hotel);
      if ('accomodation' in this.hotel) {
        this.hotel.accomodation.length > 0 ? this.hotel.accomodation = [] : true;
        if (this.hotel.room.length > 0) {
          this.hotel.room.forEach((x) => {
            for (let i = 1; i <= x.maxAdult; i += 1) {
              for (let j = 0; j <= x.maxChild; j += 1) {
                this.hotel.accomodation.push({
                  _id: this.hotel.accomodation.length + 1,
                  room_id: x._id,
                  adultSize: i,
                  childSize: j,
                  extBed: { active: i === x.maxAdult, value: false },
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
                      _id: y.age.length + 1,
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
      }
    },
    nextData() {
      this.addPricePerPerson();
      this.addPac();
      this.next(this.hotel, 'pricePerPerson');
    },
  },
};
</script>
<template>
<div class="row">
  <div class="col-12">
    <div class="card">
      <div class="card-header align-items-center d-flex bg-success">
        <h4 class="card-title mb-0 flex-grow-1 text-white">Room Add</h4>
      </div>
      <!-- end card header -->
      <div class="card-body bg-soft-success">
        <div class="live-preview">
          <div class="row">
            <ol>
              <li style="list-style: none;">
                <div class="row text-center">
                  <div class="col-4"> Room Name </div>
                  <div class="col-2"> Max Adult </div>
                  <div class="col-2"> Max Child </div>
                  <div class="col-2"> Quota </div>
                  <div class="col-2">
                    <span class="ri ri-delete-bin-2-line"></span>
                  </div>
                </div>
              </li>
            </ol>
            <div v-if="hotel.room.length > 0">
              <ol class="px-3" style="list-style-type: upper-alpha">
                <li class="my-2" v-for="room in hotel.room" :key="room">
                  <div class="row">
                    <div class="col-4">
                      <input v-model="room.name" type="text" class="form-control form-control-sm">
                    </div>
                    <div class="col-2">
                      <input v-model="room.maxAdult" @focus="$event.target.select()" type="number" class="form-control form-control-sm">
                    </div>
                    <div class="col-2">
                      <input v-model="room.maxChild" @focus="$event.target.select()" type="number" class="form-control form-control-sm">
                    </div>
                    <div class="col-2">
                      <input v-model="room.qouta" @focus="$event.target.select()" type="number" class="form-control form-control-sm">
                    </div>
                    <div class="col-2 text-center">
                      <button class="btn" @click="deleteRoom(room)" type="button">
                        <span class="ri ri-delete-bin-2-line"></span>
                      </button>
                    </div>
                  </div>
                </li>
              </ol>
            </div>
            <button @click="addNew()" type="button" class="btn btn-primary">ADD</button>
          </div>
          <!--end row-->
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import flatpickr from 'vue-flatpickr-component';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';
import { random } from 'lodash';
import moment from 'moment';

export default {
  props: ['data', 'next'],
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
    };
  },
  components: {
    flatpickr,
  },
  computed: {
    hotel() {
      return this.hotelData;
    },
  },
  methods: {
    async addPeriod() {
      const startDate = (this.hotel.period.length > 0) ? (moment(this.hotel.period[this.hotel.period.length - 1]?.endDate, 'YYYY-MM-DD').add(1, 'd'))._d : null;
      const newPeriod = {
        _id: this.hotel.period.length + 1,
        startDate,
        endDate: null,
        stayAndArrival: true,
        release: null,
        minStay: null,
      };
      await this.hotel.period.push(newPeriod);
      if (this.$refs.enddate.length > 1) {
        this.$refs.enddate[this.$refs.enddate.length - 1].$el.nextSibling.focus();
      }
    },
    deletePeriod(item) {
      this.hotel.period = this.hotel.period.filter((i) => i._id !== item._id);
    },
    addPricePerPerson() {
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
      if ('id' in this.hotel) {
        this.addPac();
        this.addPricePerPerson();
        this.next(this.hotel, 'pricePerPerson');
      } else {
        this.next(this.hotel, 'room');
      }
    },
  },
};
</script>
<template>
<div class="row">
  <div class="col-12">
    <div class="card">
      <div class="card-header align-items-center d-flex bg-info">
        <h4 class="card-title mb-0 flex-grow-1 text-white">Period Add</h4>
      </div>
      <!-- end card header -->
      <div class="card-body bg-soft-info">
        <div class="live-preview">
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
              <li class="my-2" v-for="it in hotel.period" :key="it">
                <div class="row">
                  <div class="col-2">
                    <flatpickr v-model="it.startDate" :config="config" class="form-control flatpickr-input form-control-sm"></flatpickr>
                  </div>
                  <div class="col-2">
                    <flatpickr v-model="it.endDate" ref="enddate" :config="config" class="form-control flatpickr-input form-control-sm"></flatpickr>
                  </div>
                  <div class="col-2">
                    <div class="form-check form-switch form-switch-lg form-switch-success mb-3 d-flex justify-content-center">
                      <input v-model="it.stayAndArrival" class="form-check-input " type="checkbox" id="SwitchCheck3">
                    </div>
                  </div>
                  <div class="col-2">
                    <input v-model="it.release" @focus="$event.target.select()" type="number" class="form-control form-control-sm">
                  </div>
                  <div class="col-2">
                    <input v-model="it.minStay" @focus="$event.target.select()" type="number" class="form-control form-control-sm">
                  </div>
                  <div class="col-2 text-center">
                    <button class="btn" @click="deletePeriod(it)" type="button">
                      <span class="ri ri-delete-bin-2-line"></span>
                    </button>
                  </div>
                </div>
              </li>
            </ol>
            <button @click="addPeriod()" type="button" class="btn btn-primary">ADD NEW</button>
          </div>
          <!--end row-->
        </div>
      </div>
    </div>
  </div>
</div>
</template>

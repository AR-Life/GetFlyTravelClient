<template>
<div class="row g-3">
  <h4 class="col-4 d-flex justify-content-center pt-3 text-success">{{name}}</h4>
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

export default {
  components: {
    flatpickr,
  },
  props: ['data', 'name', 'close', 'next'],
  data() {
    // eslint-disable-next-line no-return-assign
    return {
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'd/m/Y',
        allowInput: true,
        altInput: true,
        dateFormat: 'Y-m-d',
      },
      action: null,
    };
  },
  computed: {
    validation() {
      let show = true;
      show = this.action.type === null;
      show = show === false ? show : this.action.salesDate.end === null && this.action.salesDate.end === null;
      show = show === false ? show : this.action.checkInDate.end === null && this.action.checkInDate.end === null;
      return show;
    },
  },
  methods: {
    changePeriod() {
      console.log(this.action);
    },
    save() {
      this.action.room = this.hotel.room.map((x) => ({
        room_id: x._id,
        purchasePrice: 0,
        salesPrice: 0,
      }));
      'actions' in this.hotelData ? true : this.hotelData.actions = [];
      this.hotel.actions.push(this.action);
      this.next(this.hotel, 'room');
    },
  },
  created() {
    if ('actionSeries' in this.data) {
      this.action = this.data;
    } else {
      this.action = {
        _id: 1,
        type: null,
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
      };
    }
  },
};
</script>

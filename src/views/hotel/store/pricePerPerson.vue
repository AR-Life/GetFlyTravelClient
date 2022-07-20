<script>
import moment from 'moment';

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
    getPeriod(item) {
      const period = this.hotel.period.find((x) => x._id === item.period_id);
      return `${moment(period.startDate, 'YYYY-MM-DD').format('MM/DD/YYYY')} - ${moment(period.endDate, 'YYYY-MM-DD').format('MM/DD/YYYY')}`;
    },
    nextData() {
      this.next(this.hotel, 'accomodation');
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
      </div>
      <!-- end card header -->
      <div class="card-body bg-soft-success">
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
              <li class="my-2" v-for="item in hotel.pricePerPerson.filter((x) => x.room_id === room._id)" :key="item">
                <div class="row">
                  <div class="col-3 text-center">
                    <label :for="item._id">{{getPeriod(item)}}</label>
                  </div>
                  <div class="col-3">
                    <input v-model="item.purchasePrice" @focus="$event.target.select()" type="number" class="form-control" :id="item._id">
                  </div>
                  <div class="col-3">
                    <input v-model="item.salesPrice" @focus="$event.target.select()" type="number" class="form-control" :id="item._id">
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
</template>

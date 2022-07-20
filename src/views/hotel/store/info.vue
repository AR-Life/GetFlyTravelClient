<script>
import { cloneDeep } from 'lodash';

export default {
  props: ['data', 'next', 'hotels'],
  data() {
    return {
      searchHotel: null,
      addNew: true,
    };
  },
  computed: {
    hotel() {
      return this.data;
    },
    searchHotels() {
      if (this.searchHotel != null) {
        return this.hotels.filter((x) => (x.info && x.info.name.toLowerCase()).includes(this.searchHotel && this.searchHotel.toLowerCase())).slice(0, 5);
      }
      return this.hotels;
    },
  },
  methods: {
    refresh() {
      this.addNew = true;
      this.hotel.info.name = null;
      this.searchHotel = null;
    },
    nextData() {
      const date = new Date();
      this.hotel.contract.season = (date.getMonth() > 2 && date.getMonth() < 10) ? `SUMMER ${date.getFullYear()}` : `WINTER ${date.getFullYear()}`;
      this.next(this.hotel, 'contract');
    },
    selectHotel(item) {
      this.hotel.info = cloneDeep(item.info);
      this.hotel.id = cloneDeep(item.id);
      this.hotel.contract.hotel_id = cloneDeep(item.id);
      this.hotel.contract.currency = 'EUR';
      // this.hotel.selectPeriod = cloneDeep(item.period);
      this.hotel.room = cloneDeep(item.room);
    },
  },
};
</script>
<template>
<div class="row g-3" v-if="hotel.info.name === null && addNew">
  <div class="col-6 border input-group-sm  border-primary">
    <label class="form-label mt-2">Search Hotel</label>
  <input type="text" class="form-control mb-3" v-model="searchHotel"/>
  <ol>
    <li v-for=" h in searchHotels" :key="h" @click="selectHotel(h)" v-on:keydown="selectHotel(h)">{{h.info.name}}</li>
  </ol>
  </div>
  <div class="col-6 d-grid gap-2">
    <button type="button" class="btn btn-primary" @click="addNew = false">ADD NEW</button>
  </div>
</div>
<div class="row g-3" v-else>
  <div class="col-sm-6">
    <label for="hotelName" class="form-label">Hotel Name:</label>
    <input v-model="hotel.info.name" type="text" class="form-control" id="hotelName" placeholder="Delphin İmperial Hotel" required>
  </div>
  <div class="col-sm-4">
    <label for="hotelName" class="form-label">Hostel Type:</label>
    <input v-model="hotel.info.hostelType" type="text" class="form-control" id="hostelType" placeholder="Ultra..." required>
  </div>
    <div class="col-sm-2">
    <label for="rating" class="form-label">Rating</label>
    <input v-model="hotel.info.rating" type="number" class="form-control" id="rating" placeholder="5*" required>
  </div>
  <div class="col-sm-12">
    <label for="companyName" class="form-label">Company Name:</label>
    <input v-model="hotel.info.companyName" type="text" class="form-control" id="companyName" placeholder="Delphin Hotels Group" required>
  </div>
  <div class="col-sm-6">
    <label for="administration" class="form-label">Tax Administration:</label>
    <input v-model="hotel.info.administration" type="text" class="form-control" id="administration" placeholder="Antalya Vergi Dairesi" required>
  </div>
  <div class="col-sm-3">
    <label for="region" class="form-label">Region:</label>
    <input v-model="hotel.info.region" type="text" class="form-control" id="region" placeholder="Antalya Kundu" required>
  </div>
  <div class="col-sm-3">
    <label for="location" class="form-label">Location:</label>
    <input v-model="hotel.info.location" type="text" class="form-control" id="location" placeholder="Antalya Kundu" required>
  </div>
  <div class="col-sm-6">
    <label for="tel" class="form-label">Tel:</label>
    <input v-model="hotel.info.tel" type="text" class="form-control" id="tel" placeholder="+90 (242) 242 24 24" required>
  </div>
  <div class="col-sm-6">
    <label for="web" class="form-label">Web Site:</label>
    <input v-model="hotel.info.web" type="text" class="form-control" id="web" placeholder="www.delphinhotel.com" required>
  </div>
  <div class="col-sm-6">
    <label for="firstMail" class="form-label">Contact Mail:</label>
    <input v-model="hotel.info.firstMail" type="email" class="form-control" id="firstMail" placeholder="sales@imperial.com" required>
  </div>
  <div class="col-sm-6">
    <label for="secondMail" class="form-label">Contact Mail:</label>
    <input v-model="hotel.info.secondMail" type="email" class="form-control" id="secondMail" placeholder="info@imperial.com" required>
  </div>
</div>
</template>

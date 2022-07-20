<template>
<div class="row g-3">
  <div class="col-sm-8">
    <label for="hotelName" class="form-label">Hotel Name:</label>
    <input v-model="hotel.info.name" type="text" class="form-control" id="hotelName" placeholder="Delphin İmperial Hotel" required>
  </div>
  <div class="col-sm-4">
    <label for="hotelName" class="form-label">Hostel Type:</label>
    <input v-model="hotel.info.hostelType" type="text" class="form-control" id="hostelType" placeholder="Ultra..." required>
  </div>
  <div class="col-sm-12">
    <label for="companyName" class="form-label">Company Name:</label>
    <input v-model="hotel.info.companyName" type="text" class="form-control" id="companyName" placeholder="Delphin Hotels Group" required>
  </div>
  <div class="col-sm-6">
    <label for="administration" class="form-label">Tax Administration:</label>
    <input v-model="hotel.info.administration" type="text" class="form-control" id="administration" placeholder="Antalya Vergi Dairesi">
  </div>
  <div class="col-sm-6">
    <label for="address" class="form-label">Address:</label>
    <input v-model="hotel.info.address" type="text" class="form-control" id="address" placeholder="Antalya Kundu">
  </div>
  <div class="col-sm-6">
    <label for="tel" class="form-label">Tel:</label>
    <input v-model="hotel.info.tel" type="text" class="form-control" id="tel" placeholder="+90 (242) 242 24 24" required>
  </div>
  <div class="col-sm-6">
    <label for="web" class="form-label">Web Site:</label>
    <input v-model="hotel.info.web" type="text" class="form-control" id="web" placeholder="www.delphinhotel.com">
  </div>
  <div class="col-sm-6">
    <label for="firstMail" class="form-label">Contact Mail:</label>
    <input v-model="hotel.info.firstMail" type="email" class="form-control" id="firstMail" placeholder="sales@imperial.com" required>
  </div>
  <div class="col-sm-6">
    <label for="secondMail" class="form-label">Contact Mail:</label>
    <input v-model="hotel.info.secondMail" type="email" class="form-control" id="secondMail" placeholder="info@imperial.com">
  </div>
</div>
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="save" type="submit" class="btn btn-primary" data-bs-dismiss="modal"> Save and Close </button>
  </div>
</div>
</template>
<script>
import state from '@/state';
import appAxios from '@/utils/appAxios';

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
    save() {
      appAxios.appAxios.post(`/hotel/edit/${this.hotel.id}`, this.hotel.info).then(() => {
        state.commit('hotel/changeHotelValue', this.hotel, null, 'info');
        this.close(this.hotel.id);
      });
    },
  },
};
</script>

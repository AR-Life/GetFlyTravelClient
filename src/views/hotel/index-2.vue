<script setup>
import PageHeader from '@/components/page-header.vue';
import Layout from '@/components/layouts/main.vue';
import modal from '@/components/widgets/modal-xl.vue';
import state from '@/state';
import {
  cloneDeep,
} from 'lodash';
import {
  computed,
  onMounted,
  reactive,
} from 'vue';
import appAxios from '@/utils/appAxios';
import editInfo from './edit/info.vue';
import editPeriod from './edit/period.vue';
import calcSettings from './edit/periodCalc.vue';
import pricePerPerson from './edit/pricePerPerson.vue';
import editRoom from './edit/room.vue';
import Accomodation from './edit/accomodation.vue';
import marketVue from './edit/market.vue';

const data = reactive({
  title: 'Hotels',
  items: [{
    text: 'Hotels',
    href: '/hotels',
  }],
  hotels: [],
  searchHotel: '',
  editData: null,
  editType: null,
});
const searchHotels = computed(() => {
  if (data.searchHotel != null) {
    return data.hotels.filter((x) => (x.info && x.info.name.toLowerCase()).includes(data.searchHotel && data.searchHotel.toLowerCase()));
  }
  return data.hotels;
});

function getHotel(id) {
  if (id == null) {
    data.hotels = [];
    if (state.getters['hotel/getHotel']) {
      data.hotels = cloneDeep(state.getters['hotel/getHotel']);
    } else {
      appAxios.appAxios.get('/hotel').then((response) => {
        response.data.forEach((hotel) => {
          state.commit('hotel/setHotel', hotel);
        });
        data.hotels = cloneDeep(response.data);
      });
    }
  } else {
    const i = data.hotels.findIndex((x) => x.id === id);
    data.hotels[i] = cloneDeep(state.getters['hotel/getHotel']).find((x) => x.id === id);
  }
  data.editData = null;
  data.editType = '';
}
onMounted(() => {
  getHotel(null);
  console.log(data.hotels);
});

function listHotel(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

function listHotelItem(obj, i) {
  return Object.values(obj).slice(((i - 1) * 3), (i * 3));
}

function edit(i, type) {
  data.editData = null;
  data.editData = i;
  data.editType = '';
  data.editType = type;
}
</script>
<template>
<Layout>
  <PageHeader :title="data.title" :items="data.items" />
  <div class="row mb-2">
    <div class="offset-10 col-2 ">
      <input v-model="data.searchHotel" class="form-control" placeholder="search hotel" />
    </div>
  </div>
  <div class="row">
    <div class="card">
      <div class="card-body">
        <div class="div div-borderless div-nowrap">
          <div class="row">
            <h5>Hotel</h5>
          </div>
          <div v-for="hotel in searchHotels" :key="hotel" class="border-bottom row">
            <div class="col-6 mb-2">
              <div class="row" v-for="i in Math.ceil((Object.keys(listHotel(hotel.info)).length)/3)" :key="i">
                <div v-for="item in listHotelItem(listHotel(hotel.info), i )" :key="item" class="col-4 border border-success p-1">{{item}}</div>
              </div>
            </div>
            <div class="offset-1 col-5">
              <div class="row">
                <div class="col-4">
                  <div class="row me-2 mb-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'info')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Otel Bilgileri</button>
                  </div>
                  <div class="row me-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'period')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Period</button>
                  </div>
                </div>
                <div class="col-4">
                  <div class="row me-2 mb-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'room')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Oda</button>
                  </div>
                  <div class="row me-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'pricePerPerson')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Kişi Başı Ücret</button>
                  </div>
                </div>
                <div class="col-4">
                  <div class="row">
                    <button class="btn btn-primary mb-2" @click="edit(hotel, 'periodCalc')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Çarpan</button>
                  </div>
                  <div class="row">
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl" @click="edit(hotel, 'market')">Market</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <modal>
    <editInfo v-if="data.editType == 'info'" :data="data.editData" :close="getHotel" />
    <editPeriod v-if="data.editType == 'period'" :data="data.editData" :next="edit" :close="getHotel" />
    <pricePerPerson v-if="data.editType == 'pricePerPerson'" :data="data.editData" :next="edit" :close="getHotel" />
    <calcSettings v-if="data.editType == 'periodCalc'" :data="data.editData" :close="getHotel" />
    <editRoom v-if="data.editType == 'room'" :data="data.editData" :next="edit" :close="getHotel" />
    <Accomodation v-if="data.editType == 'accomodation'" :data="data.editData" :next="edit" :close="getHotel" />
    <marketVue v-if="data.editType == 'market'" :data="data.editData" :close="getHotel" />
  </modal>
</Layout>
</template>

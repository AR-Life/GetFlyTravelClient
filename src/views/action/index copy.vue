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
import infoVue from './store/info.vue';
import roomVue from './store/room.vue';
import marketVue from './store/market.vue';

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
                <div v-for="item in listHotelItem(listHotel(hotel.info), i)" :key="item" class="col-4 border border-success p-1">{{item}}</div>
              </div>
            </div>
            <div class="offset-1 col-5">
              <div class="row">
                <div class="col-4">
                  <div class="row me-2 mb-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'list')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Aksiyonlar</button>
                  </div>
                  <div class="row me-2">
                    <button class="btn btn-primary" @click="edit(hotel, 'new')" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">Yeni Aksiyon</button>
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
    <infoVue v-if="data.editType === 'new'" :data="data.editData" :name="data.editData.info.name" :close="getHotel" :next="edit"/>
    <roomVue v-if="data.editType === 'room'" :data="data.editData" :close="getHotel" :next="edit"/>
    <marketVue v-if="data.editType === 'market'" :data="data.editData" :close="getHotel" :next="edit"/>
  </modal>
</Layout>
</template>

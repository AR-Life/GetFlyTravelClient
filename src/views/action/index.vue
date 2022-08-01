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
  onBeforeMount,
  reactive,
} from 'vue';
import infoVue from './store/info.vue';
import normalVue from './store/normal.vue';
import listVue from './store/list.vue';

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
async function getHotel(id) {
  if (id == null) {
    data.hotels = [];
    if (state.getters['hotel/getHotel']) {
      data.hotels = await cloneDeep(state.getters['hotel/getHotel']);
    } else {
      await state.dispatch('market/initApp');
      await state.dispatch('hotel/initApp');
      data.hotels = await cloneDeep(state.getters['hotel/getHotel']);
    }
  } else {
    const i = data.hotels.findIndex((x) => x.id === id);
    data.hotels[i] = cloneDeep(state.getters['hotel/getHotel'].find((x) => x.id === id));
  }
  data.editData = null;
  data.editType = '';
  data.hotels = data.hotels.map((x) => {
    const y = x;
    if ('selectedContract' in x) {
      delete y.selectedContract;
    }
    return y;
  });
}
onBeforeMount(() => {
  getHotel(null);
});

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
  <div class="row">
    <div class="card">
      <div class="card-header row">
    <div class="offset-10 col-2 ">
      <input v-model="data.searchHotel" class="form-control" placeholder="search hotel" />
  </div>
      </div>
      <div class="card-body">
        <!-- Tables Without Borders -->
        <table class="table table-borderless table-nowrap">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Tel</th>
              <th scope="col">First Mail</th>
              <th scope="col">Second Mail</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="[i, hotel] in searchHotels.entries()" :key="hotel">
              <th scope="row">{{i + 1}}</th>
              <td>
                <a role="presentation" class="link-primary" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">{{hotel.info.name}}</a>
              </td>
              <td>
                <a :href="['tel:+'+hotel.info.tel]">{{hotel.info.tel}}</a>
              </td>
              <td>
                <a :href="['mailto:'+hotel.info.firstMail]">{{hotel.info.firstMail}}</a>
              </td>
              <td>
                <a :href="['mailto:'+hotel.info.secondMail]">{{hotel.info.secondMail}}</a>
              </td>
              <td>
                <span class="badge badge-soft-success">Active</span>
              </td>
              <td>
                <div class="hstack gap-3 fs-15">
                  <a @click="edit(hotel, 'info')" role="presentation" class="link-primary" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">
                    <i class="ri-add-line"></i>
                  </a>
                  <a @click="edit(hotel, 'list')" role="presentation" class="link-primary" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl">
                    <i class="ri-list-check"></i>
                  </a>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <modal>
    <infoVue v-if="data.editType === 'info'" :data="data.editData" :next="edit" :close="getHotel"/>
    <normalVue v-if="data.editType === 'normal'" :data="data.editData" :next="edit" :close="getHotel"/>
    <listVue v-if="data.editType === 'list'" :data="data.editData" />
  </modal>
</Layout>
</template>

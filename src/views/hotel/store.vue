<script>
import Layout from '@/components/layouts/main.vue';
import PageHeader from '@/components/page-header.vue';
import {
  Vue3Lottie,
} from 'vue3-lottie';
import appAxios from '@/utils/appAxios';
import state from '@/state';
import {
  cloneDeep,
} from 'lodash';
import periodVue from './store/period.vue';
import roomVue from './store/room.vue';
import pricePerPersonVue from './store/pricePerPerson.vue';
import accomodationVue from './store/accomodation.vue';
import pac from './store/pac.vue';
import marketVue from './store/market.vue';
import 'vue3-lottie/dist/style.css';
import infoVue from './store/info.vue';
import Contract from './store/contract.vue';

export default {
  components: {
    Layout,
    PageHeader,
    periodVue,
    roomVue,
    pricePerPersonVue,
    accomodationVue,
    pac,
    marketVue,
    Vue3Lottie,
    infoVue,
    Contract,
  },
  data() {
    return {
      hotels: [],
      items: [{
        text: 'Hotels',
        href: '/hotels',
      }, {
        text: 'Add Hotel',
        active: true,
      }],
      title: 'Add Hotel',
      hotel: {
        info: {
          name: null,
          companyName: 'Delphin Hotel Group',
          hostelType: 'Ultra',
          administration: 'Antalya Vergi Dairesi',
          region: 'Antalya',
          location: 'Kundu',
          tel: '+90 (242) 424 24 24',
          web: 'www.delphinimperial.com',
          firstMail: 'sales@imperial.com',
          secondMail: 'info@imperial.com',
          rating: null,
        },
        contract: {
          season: null,
          validFrom: null,
          seasonFromTo: {
            start: null,
            end: null,
          },
          market: [],
          country: [],
          currency: 'EUR',
          hotel_id: null,
        },
        period: [],
        room: [],
        pricePerPerson: [],
        accomodation: [],
        pac: [],
      },
      saveHotel: {
        success: false,
        message: '',
        elp: 0,
      },
      animationData: require('@/components/widgets/lupuorrc.json'),
      loadingData: require('@/components/widgets/2523-loading.json'),
      edit: {
        data: null,
        type: null,
      },
    };
  },
  methods: {
    async getData() {
      if (state.getters['hotel/getHotel']) {
        this.hotels = await cloneDeep(state.getters['hotel/getHotel']);
      } else {
        await state.dispatch('market/initApp');
        await state.dispatch('hotel/initApp');
        this.hotels = await cloneDeep(state.getters['hotel/getHotel']);
      }
    },

    next(data, type) {
      this.edit.data = data;
      this.edit.type = type;
    },
    elp() {
      setTimeout(() => {
        this.saveHotel.elp += 1;
        this.elp();
      }, 1000);
    },
    async saveAndFinish() {
      console.log(this.edit.data);
      this.elp();
      await appAxios.appAxios.post('hotel/create', this.edit.data).then((response) => {
        state.commit('hotel/setHotel', response.data);
        setTimeout(() => {
          this.saveHotel.success = true;
        }, 10000);
        this.edit.data = null;
      }).catch((e) => {
        this.saveHotel.message = e;
      });
    },
  },
  mounted() {
    this.getData();
    document.querySelectorAll('.form-steps').forEach((form) => {
      // next tab
      form.querySelectorAll('.nexttab').forEach((nextButton) => {
        const tabEl = form.querySelectorAll('button[data-bs-toggle="pill"]');
        tabEl.forEach((item) => {
          item.addEventListener('show.bs.tab', (event) => {
            event.target.classList.add('done');
          });
        });
        nextButton.addEventListener('click', () => {
          const nextTab = nextButton.getAttribute('data-nexttab');
          document.getElementById(nextTab).click();
        });
      });
      // Pervies tab
      form.querySelectorAll('.previestab').forEach((prevButton) => {
        prevButton.addEventListener('click', () => {
          const prevTab = prevButton.getAttribute('data-previous');
          const totalDone = prevButton.closest('form').querySelectorAll('.custom-nav .done').length;
          for (let i = totalDone - 1; i < totalDone; i += 1) {
            (prevButton.closest('form').querySelectorAll('.custom-nav .done')[i]) ? prevButton.closest('form').querySelectorAll('.custom-nav .done')[i].classList.remove('done') : '';
          }
          document.getElementById(prevTab).click();
        });
      });
      // Step number click
      const tabButtons = form.querySelectorAll('button[data-bs-toggle="pill"]');
      tabButtons.forEach((button, i) => {
        button.setAttribute('data-position', i);
        button.addEventListener('click', () => {
          const getProgreebar = button.getAttribute('data-progressbar');
          if (getProgreebar) {
            const totallength = document.getElementById('custom-progress-bar').querySelectorAll('li').length - 1;
            const current = i;
            const percent = (current / totallength) * 100;
            document.getElementById('custom-progress-bar').querySelector('.progress-bar').style.width = `${percent}%`;
          }
          (form.querySelectorAll('.custom-nav .done').length > 0) ? form.querySelectorAll('.custom-nav .done').forEach((doneTab) => {
            doneTab.classList.remove('done');
          }) : '';
          for (let j = 0; j <= i; j += 1) {
            tabButtons[j].classList.contains('active') ? tabButtons[j].classList.remove('done') : tabButtons[j].classList.add('done');
          }
        });
      });
    });
  },
};
</script>
<template>
<Layout>
  <PageHeader :title="title" :items="items" />
  <div class="row">
    <div class="col-xl-12">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title mb-0">Add Hotel</h4>
        </div>
        <!-- end card header -->
        <div class="card-body form-steps">
          <form class="vertical-navs-step was-validated">
            <div class="row gy-5">
              <div class="col-lg-3">
                <div class="nav flex-column custom-nav nav-pills" role="tablist" aria-orientation="vertical">
                  <button class="nav-link active" id="v-pills-bill-hotel-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-hotel" type="button" role="tab" aria-controls="v-pills-bill-hotel" aria-selected="true">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 1 </span> Hotel İnfo </button>
                  <button class="nav-link" id="v-pills-bill-contract-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-contract" type="button" role="tab" aria-controls="v-pills-bill-contract" aria-selected="true">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 2 </span> Contract İnfo </button>
                  <button class="nav-link" id="v-pills-bill-period-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-period" type="button" role="tab" aria-controls="v-pills-bill-period" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 3 </span> Period </button>
                  <button class="nav-link" id="v-pills-bill-roomtype-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-roomtype" type="button" role="tab" aria-controls="v-pills-bill-roomtype" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 4 </span> Room Type </button>
                  <button class="nav-link" id="v-pills-bill-ppp-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-ppp" type="button" role="tab" aria-controls="v-pills-bill-ppp" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 5 </span> Price Per Person </button>
                  <button class="nav-link" id="v-pills-bill-accomodation-type-tab" data-bs-toggle="pill" data-bs-target="#v-pills-bill-accomodation-type" type="button" role="tab" aria-controls="v-pills-bill-accomodation-type" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 6 </span> Accomodation Type </button>
                  <button class="nav-link" id="v-pills-price-tab" data-bs-toggle="pill" data-bs-target="#v-pills-price" type="button" role="tab" aria-controls="v-pills-price" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 7 </span> Price </button>
                  <button class="nav-link" id="v-pills-market-tab" data-bs-toggle="pill" data-bs-target="#v-pills-market" type="button" role="tab" aria-controls="v-pills-market" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 8 </span> Market </button>
                  <button class="nav-link" id="v-pills-finish-tab" data-bs-toggle="pill" data-bs-target="#v-pills-finish" type="button" role="tab" aria-controls="v-pills-finish" aria-selected="false">
                    <span class="step-title me-2">
                      <i class="ri-close-circle-fill step-icon me-2"></i> Step 9 </span> Finish </button>
                </div>
                <!-- end nav -->
              </div>
              <!-- end col-->
              <div class="col-lg-9">
                <div class="px-lg-4">
                  <div class="tab-content">
                    <div class="tab-pane fade show active" id="v-pills-bill-hotel" role="tabpanel" aria-labelledby="v-pills-bill-hotel-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Hotel Info</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <div>
                        <infoVue :data="hotel" ref="info" :next="next" :hotels="hotels" />
                      </div>
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button @click="$refs.info.refresh()" type="button" class="btn btn-light btn-label">
                          <i class="bx bx-refresh label-icon align-middle fs-16 me-2"></i> Reload </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-bill-contract-tab" @click="$refs.info.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to Shipping </button>
                      </div>
                    </div>
                    <div class="tab-pane fade" id="v-pills-bill-contract" role="tabpanel" aria-labelledby="v-pills-bill-contract-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Hotel Info</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <div>
                        <Contract v-if="edit.type == 'contract'" :data="edit.data" :next="next" ref="contract" />
                      </div>
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-hotel-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Billing Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-bill-period-tab" @click="$refs.contract.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to Shipping </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-bill-period" role="tabpanel" aria-labelledby="v-pills-bill-period-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Period Info</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <div>
                        <periodVue v-if="edit.type == 'period'" :data="edit.data" :next="next" ref="period"></periodVue>
                      </div>
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-contract-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Billing Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" :data-nexttab="[(typeof edit.data?.id) === 'undefined' ? 'v-pills-bill-roomtype-tab' : 'v-pills-bill-ppp-tab']" @click="$refs.period.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to price </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-bill-roomtype" role="tabpanel" aria-labelledby="v-pills-bill-roomtype-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Room Type Info</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <roomVue v-if="edit.type == 'room'" :data="edit.data" :next="next" ref="room" />
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-period-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Billing Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-bill-ppp-tab" @click="$refs.room.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to price </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-bill-ppp" role="tabpanel" aria-labelledby="v-pills-bill-ppp-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Price Per Person</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <pricePerPersonVue v-if="edit.type == 'pricePerPerson'" :data="edit.data" :next="next" ref="pricePerPerson"></pricePerPersonVue>
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-roomtype-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Billing Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-bill-accomodation-type-tab" @click="$refs.pricePerPerson.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to price </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-bill-accomodation-type" role="tabpanel" aria-labelledby="v-pills-bill-accomodation-type-tab">
                      <div class="d-flex justify-content-between">
                        <div>
                          <h5>Room Type Info</h5>
                          <p class="text-muted">Fill all information below</p>
                        </div>
                        <div class="col-4 ataturk"></div>
                      </div>
                      <accomodationVue v-if="edit.type == 'accomodation'" :data="edit.data" :next="next" ref="accomodation" />
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-ppp-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Billing Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-price-tab" @click="$refs.accomodation.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>Go to </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-price" role="tabpanel" aria-labelledby="v-pills-price-tab">
                      <div>
                        <h5>price</h5>
                        <p class="text-muted">Fill all information below</p>
                      </div>
                      <pac v-if="edit.type == 'pac'" :data="edit.data" :next="next" ref="pac" />
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-bill-accomodation-type-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Shipping Info </button>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-market-tab" @click="$refs.pac.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i> Order Complete </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-market" role="tabpanel" aria-labelledby="v-pills-market-tab">
                      <div>
                        <h5>Market</h5>
                        <p class="text-muted">Fill all information below</p>
                      </div>
                      <marketVue v-if="edit.type == 'market'" :data="edit.data" :next="next" ref="market" :finish="saveAndFinish" />
                      <div class="d-flex align-items-start gap-3 mt-4">
                        <button type="button" class="btn btn-light btn-label previestab" data-previous="v-pills-price-tab">
                          <i class="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i> Back to Shipping Info </button>
                        <div class="ms-auto">
                          <button type="button" class="btn btn-success me-2" @click="$refs.market.selectAllMarket()">Tüm Marketleri Seç</button>
                          <button type="button" class="btn btn-danger" @click="$refs.market.removeAllMarket()">Tüm Marketleri Kaldır</button>
                        </div>
                        <button type="button" class="btn btn-success btn-label right ms-auto nexttab
nexttab" data-nexttab="v-pills-finish-tab" @click="$refs.market.nextData()">
                          <i class="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i> Order Complete </button>
                      </div>
                    </div>
                    <!-- end tab pane -->
                    <!-- end tab pane -->
                    <div class="tab-pane fade" id="v-pills-finish" role="tabpanel" aria-labelledby="v-pills-finish-tab">
                      <div v-if="saveHotel.message !== ''">{{saveHotel.message}}</div>
                      <div class="text-center pt-4 pb-2" v-if="saveHotel.success">
                        <div class="mb-4">
                          <Vue3Lottie colors="primary:#67b173,secondary:#3d78e3" :animationData="animationData" :height="120" :width="120" />
                        </div>
                        <h5>Your Order is Completed !</h5>
                        <p class="text-muted">You Will receive an order confirmation email with details of your order.</p>
                      </div>
                      <div class="text-center pt-4 pb-2" v-if="!saveHotel.success" style="transition: 500ms;">
                        <div class="mb-4">
                          <Vue3Lottie colors="primary:#67b173,secondary:#3d78e3" :animationData="loadingData" :height="300" :width="300" />
                        </div>
                        <h5>İşlem tamamlanıyor lütfen bekleyin</h5>
                        <h5>geçen süre {{saveHotel.elp}} sn</h5>
                      </div>
                    </div>
                    <!-- end tab pane -->
                  </div>
                  <!-- end tab content -->
                </div>
              </div>
              <!-- end col -->
            </div>
            <!-- end row -->
          </form>
        </div>
      </div>
      <!-- end -->
    </div>
    <!-- end col -->
  </div>
  <!-- end row -->
</Layout>
</template>

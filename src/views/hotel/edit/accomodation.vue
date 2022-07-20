<script>
export default {
  props: ['data', 'next', 'close'],
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
    changePosition(arr, from, to) {
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      return arr;
    },
    addNew(item) {
      const id = this.hotel.accomodation.length + 1;
      this.hotel.accomodation.push({
        id,
        room_id: item.room_id,
        adultSize: item.adultSize,
        childSize: item.childSize,
        calc: 0,
        age: [],
      });
      const it = this.hotel.accomodation.findIndex((x) => x.id === id);
      for (let i = 1; i <= item.childSize; i += 1) {
        this.hotel.accomodation[it].age.push({
          id: this.hotel.accomodation[it].age.length + 1,
          min: 0,
          max: 0,
          year: true,
          calc: 0,
        });
      }
      const is = this.hotel.accomodation.findIndex((x) => x.id === item.id);
      this.hotel.accomodation = this.changePosition(this.hotel.accomodation, it, is + 1);
    },
    deleteAccomadation(item, itemId, type) {
      if (type === 'age') {
        const it = this.hotel.accomodation.findIndex((x) => x.id === itemId);
        // const is = hotel.accomodation[it].age.findIndex((x) => x.id === item.id);
        this.hotel.accomodation[it].age = this.hotel.accomodation[it].age.filter((x) => x.id !== item.id);
        if (this.hotel.accomodation[it].age.length < 1) {
          this.hotel.accomodation = this.hotel.accomodation.filter((x) => x.id !== item.accomodation_id);
        }
      } else {
        this.hotel.accomodation = this.hotel.accomodation.filter((x) => x.id !== itemId);
      }
    },
    changeAge(age, item) {
      if (age.id === 1) {
        const i = this.hotel.accomodation.findIndex((x) => x.id === item.id);
        for (let j = 0; j < this.hotel.accomodation[i].age.length; j += 1) {
          this.hotel.accomodation[i].age[j].calc = age.calc;
        }
      }
    },
    addPac() {
      if (this.hotel.room.length > 0 && this.hotel.period.length > 0 && this.hotel.accomodation.length > 0) {
        this.hotel.pac.length > 0 ? this.hotel.pac = [] : true;
        this.hotel.room.forEach((r) => {
          const pacItem = this.hotel.accomodation.filter((x) => x.room_id === r._id);
          if (pacItem.length > 0) {
            this.hotel.period.forEach((p) => {
              pacItem.forEach((pc) => {
                const pacId = this.hotel.pac.length + 1;
                this.hotel.pac.push({
                  _id: pacId,
                  room_id: r._id,
                  period_id: p._id,
                  adultSize: pc.adultSize,
                  childSize: pc.childSize,
                  calc: pc.calc,
                  age: [],
                });
                if (pc.age.length > 0) {
                  pc.age.forEach((pca) => {
                    const pacIndex = this.hotel.pac.findIndex((x) => x._id === pacId);
                    this.hotel.pac[pacIndex].age.push({
                      id: `${pacId}2${this.hotel.pac.length}5${this.hotel.pac[pacIndex].age.length}3${pacIndex > 0 ? pacIndex : 0}4${Math.floor(Math.random() * 1000) + 1}`,
                      min: pca.min,
                      max: pca.max,
                      year: pca.year,
                      calc: pca.calc,
                    });
                  });
                }
              });
            });
          }
        });
      }
    },
    nextData() {
      this.addPac();
      this.next(this.hotel, 'periodCalc');
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
                  <div class="col-3 text-center">Accomodation</div>
                  <div class="col-2">Calc</div>
                  <div class="col-2">Min</div>
                  <div class="col-2">Max</div>
                  <div class="col-2">Mount/Year</div>
                  <div class="col-1">Delete</div>
                </div>
              </li>
            </ol>
            <ol class="px-3" style="list-style-type: upper-alpha">
              <li class="my-2" v-for="item in hotel.accomodation.filter((a) => a.room_id === room._id)" :key="item">
                <div class="row">
                  <div class="col-3">
                    <label>
                      <span v-show="item?.adultSize === 1"> Single </span>
                      <span v-show="item?.adultSize === 2"> Double </span>
                      <span v-show="item?.adultSize === 3"> Triple </span>
                      <span v-show="item?.adultSize > 3"> {{item.adultSize}} Adult </span>
                      <span v-if="item?.childSize != 0">+ {{item?.childSize}} Child </span>
                      <button @click="addNew(item)" class=" btn ri  ri-add-circle-line fs-5" type="button"></button>
                    </label>
                  </div>
                  <div v-if="item?.age.length > 0" class="col-9">
                    <div class="row" v-for="age in item.age" :key="age">
                      <div class="col-3">
                        <input v-on:change="changeAge(age, item)" v-model="age.calc" @focus="$event.target.select()" type="number" step="0.01" class="form-control form-control-sm" placeholder="calc x?">
                      </div>
                      <div class="col-2">
                        <input v-model="age.min" @focus="$event.target.select()" type="number" step="0.01" class="form-control form-control-sm" :placeholder="age.id + '. child age start'">
                      </div>
                      <div class="col-2">
                        <input v-model="age.max" @focus="$event.target.select()" type="number" step="0.01" class="form-control form-control-sm" :placeholder="age.id + '. child age end'">
                      </div>
                      <div class="col-3 form-check form-switch form-switch-lg form-switch-success d-flex justify-content-center">
                        <input class="form-check-input" type="checkbox" v-model="age.year">
                      </div>
                      <div class="col-2 d-flex justify-content-end">
                        <button class="btn" @click="deleteAccomadation(age, item.id, 'age')" type="button">
                          <span class="ri ri-delete-bin-2-line"></span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div v-else class="col-9">
                    <div class="row">
                      <div class="col-3">
                        <input v-model="item.calc" @focus="$event.target.select()" type="number" step="0.01" class="form-control form-control-sm" placeholder="calc x?">
                      </div>
                      <div class="col-2 offset-7 d-flex justify-content-end">
                        <button class="btn" @click="deleteAccomadation(item, item.id, 'adult')" type="button">
                          <span class="ri ri-delete-bin-2-line"></span>
                        </button>
                      </div>
                    </div>
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
<div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="next(hotel, 'select')" type="button" class="btn btn-light"> Back </button>
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="nextData" type="button" class="btn btn-primary"> Period Calc Settings</button>
  </div>
</div>
</template>

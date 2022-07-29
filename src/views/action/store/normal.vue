<template>
<div class="row" v-for="room in hotel.action.value" :key="room">
    <div class="col-12">
        <div class="card">
            <div class="card-header w-100 align-items-center d-flex text-bg-success">
                <div class="row w-100">
                  <div class="col-1 d-flex align-items-center">
                    <input class="form-check-input" type="checkbox" style="font-size:1rem" :id="room.room_id" v-model="hotel.action.room" :value="room.room_id" role="button" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room.room_id]" aria-expanded="true" :aria-controls="['roomCardBody'+room.room_id]"/>
                  </div>
                  <div class="col-5 d-flex align-items-center" role="button" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room.room_id]" aria-expanded="true" :aria-controls="['roomCardBody'+room.room_id]">
                    <h4 class="card-title mb-0 flex-grow-1 text-white">{{hotel.room.find((x) => x._id === room.room_id)?.name}}</h4>
                  </div>
                  <div class="col-3 d-flex align-items-center">
                    <input v-model="room.purchasePrice" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="Purchase Price">
                  </div>
                  <div class="col-3 d-flex align-items-center">
                    <input v-model="room.salesPrice" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="Sales Price">
                  </div>
                </div>
            </div>
            <!-- end card header -->
            <div class="card-body collopse collapse" style="transition: 0ms;" :id="['roomCardBody'+room.room_id]">
                                <div class="row text-center">
                                    <div class="col-2 text-center">Accomodation</div>
                                    <div class="col-2">Calc</div>
                                    <div class="col-2">Min</div>
                                    <div class="col-2">Max</div>
                                    <div class="col-2">Mount/Year</div>
                                    <div class="col-2">Purchase Price
                                        <hr class="m-0 p-0">Sales Price
                                    </div>
                                </div>
                        <ol style="list-style-type: upper-alpha">
                            <li class="my-2 border-bottom" v-for="it in pacItems.filter((x) => x.room_id === room.room_id)" :key="it">
                                <div class="row py-1">
                                  <div class="col-2">
                                    <label>
                                      <span>{{it?.adultSize}} Adult</span>
                                            <span v-if="it?.childSize != 0">+ {{it?.childSize}} Child </span>
                                            <span v-if="it.extBed.active === true && it.extBed.value === true">&nbsp;(Extra Bed.)</span>
                                        </label>
                                    </div>
                                    <div v-if="it.age.length > 0" class="col-10">
                                        <div class="row py-1" v-for="age in it.age" :key="age">
                                            <div class="col-3">
                                              <input v-model="age.calc" v-on:change="changeItem(it)" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?">
                                            </div>
                                            <div class="col-2">
                                              <span>{{age.min}}</span>
                                            </div>
                                            <div class="col-2">
                                              <span>{{age.max}}</span>
                                            </div>
                                            <div class="col-3 form-check form-switch form-switch-lg form-switch-success d-flex justify-content-center">
                                              <span>{{age.year ? 'year' : 'mount'}}</span>
                                            </div>
                                            <div class="col-2 text-center">{{room.purchasePrice * age.calc}}/{{room.salesPrice * age.calc}} {{currency}}</div>
                                        </div>
                                    </div>
                                    <div v-else class="col-10">
                                        <div class="row">
                                            <div class="col-3">
                                                <input v-model="it.calc" v-on:change="changeItem(it)" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?">
                                            </div>
                                    <div class="col-2 offset-7 text-center">{{room.purchasePrice * it.calc}}/{{room.salesPrice * it.calc}} {{currency}}</div>

                                        </div>
                                    </div>
                                </div>
                           </li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-lg-12 mt-2">
  <div class="hstack gap-2 justify-content-end">
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="save" type="button" class="btn btn-primary"> Save and Close </button>
  </div>
</div>
</template>
<script>
import { cloneDeep, groupBy } from 'lodash';

export default {
  props: ['data', 'next', 'close'],
  data() {
    return {
      hotel: cloneDeep(this.data),
      purchasePrice: null,
      salesPrice: null,
      currency: null,
      pacItems: [],
    };
  },
  methods: {
    getPac() {
      const per = groupBy(this.hotel.pac, 'period_id');
      per[Object.keys(per)[0]].map((x) => this.pacItems.push(x));
      this.hotel.room.map((x) => this.hotel.action.value.push({
        room_id: x._id,
        purchasePrice: null,
        salesPrice: null,
        pac: [],
      }));
    },
    changeItem(item) {
      console.log(item);
      const action = this.hotel.action.value.find((x) => x.room_id === item.room_id);
      const pacIndex = action.pac.findIndex((x) => x.adultSize === item.adultSize && x.childSize === item.childSize);
      const pacItem = {
        adultSize: item.adultSize,
        childSize: item.childSize,
        calc: item.calc,
        age: item.age,
      };
      if (pacItem.age.length > 0) { pacItem.age = pacItem.age.map((x) => ({ calc: x.calc })); }

      console.log(pacIndex);
      if (pacIndex > -1) {
        action.pac[pacIndex] = pacItem;
      } else {
        action.pac.push(pacItem);
      }
      console.log(action);
      console.log(this.hotel.action);
    },
    save() {
      console.log(this.hotel);
    },
  },
  mounted() {
    this.getPac();
    this.currency = this.hotel.contract.find((x) => this.hotel.action.contract.includes(x._id))?.currency;
  },

};
</script>

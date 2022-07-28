<template>
<div class="row" v-for="room in hotel.room" :key="room">
    <div class="col-12">
        <div class="card">
            <div class="card-header align-items-center d-flex text-bg-success">
                <div class="row">
                  <div class="col-1">
                    <input type="checkbox" :id="room._id" v-model="hotel.action.room" :value="room._id" role="button" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room._id]" aria-expanded="true" :aria-controls="['roomCardBody'+room._id]"/>
                  </div>
                  <div class="col-5 d-flex align-items-center" role="button" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room._id]" aria-expanded="true" :aria-controls="['roomCardBody'+room._id]">
                    <h4 class="card-title mb-0 flex-grow-1 text-white">{{room.name}}</h4>
                  </div>
                  <div class="col-3">
                    <input v-model="purchasePrice" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="Purchase Price">
                  </div>
                  <div class="col-3">
                    <input v-model="salesPrice" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="Sales Price">
                  </div>
                </div>
            </div>
            <!-- end card header -->
            <div class="card-body collopse collapse" style="transition: 0ms;" :id="['roomCardBody'+room._id]">
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
                            <li class="my-2 border-bottom" v-for="it in getPac(room._id)" :key="it">
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
                                              <input v-model="age.calc" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?">
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
                                            <div class="col-2 text-center">{{purchasePrice * age.calc}}€ ({{purchasePrice}})/{{salesPrice * age.calc}}€ ({{salesPrice}})</div>
                                        </div>
                                    </div>
                                    <div v-else class="col-10">
                                        <div class="row">
                                            <div class="col-3">
                                                <input v-model="it.calc" @focus="$event.target.select()" type="number" class="form-control form-control-sm" placeholder="calc x?">
                                            </div>
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
  props: ['data', 'next'],
  data() {
    return {
      hotel: cloneDeep(this.data),
      purchasePrice: null,
      salesPrice: null,
    };
  },
  methods: {
    getPac(roomId) {
      const per = groupBy(this.hotel.pac, 'period_id');
      const pacItems = [];
      per[Object.keys(per)[0]].map((x) => pacItems.push(x));
      return pacItems.filter((x) => x.room_id === roomId);
    },
  },
  created() {
    console.log(this.hotel);
  },

};
</script>

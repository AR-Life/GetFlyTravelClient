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
    alphabet(i) {
      const a = 'abcdefghijklmnopqrstuvwxyz';
      return a.toUpperCase().charAt(i - 1);
    },
    pricePerPerson(roomId, periodId) { // Room Price Per Person
      return this.hotel.pricePerPerson.find((x) => x.room_id === roomId && x.period_id === periodId);
    },
    nextData() {
      this.next(this.hotel, 'market');
    },
    getPeriod(period) {
      return `${moment(period.startDate, 'YYYY-MM-DD').format('MM/DD/YYYY')} - ${moment(period.startDate, 'YYYY-MM-DD').format('MM/DD/YYYY')}`;
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
                <button type="button" class="btn btn-primary" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room._id]" aria-expanded="true" :aria-controls="['roomCardBody'+room._id]"> göster/gizle</button>
            </div>
            <!-- end card header -->
            <div class="card-body collopse collapse" style="transition: 0ms;" :id="['roomCardBody'+room._id]">
                <ul class="nav nav-pills animation-nav nav-justified mb-3" role="tablist">
                    <li class="nav-item" v-for="(per,index) in hotel.period" :key="per">
                        <a style="color:white; font-weight:bolder; text-shadow: 0 0 3px black, 0 0 3px black;" :class="['nav-link text-center', { active: index === 0 } ]" data-bs-toggle="tab" :href="['#period'+room._id+''+alphabet(index+1)+''+per._id]" role="tab">
                            <div>{{alphabet(index+1)}} {{index +1 }} </div>
                            <small style="color:white; font-weight:bolder; text-shadow: 0 0 3px black, 0 0 3px black;">{{getPeriod(per)}}</small>
                        </a>
                    </li>
                </ul>
                <div class="tab-content text-muted">
                    <div v-for="(per, index) in hotel.period" :key="per" :class="['tab-pane', { active: index === 0 }]" :id="['period'+room._id+''+alphabet(index+1)+''+per._id]" role="tabpanel">
                        <ol>
                            <li style="list-style: none;">
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
                            </li>
                        </ol>
                        <ol style="list-style-type: upper-alpha">
                            <li v-for="it in this.hotel.pac.filter((x) => x.room_id === room._id && x.period_id ===per._id)" :key="it">
                                <div class="row">
                                    <div class="col-2">
                                        <label>
                                            <span>{{it?.adultSize}} Adult</span>
                                            <span v-if="it?.childSize != 0">+ {{it?.childSize}} Child </span>
                                            <span v-if="it.extBed.active === true && it.extBed.value === true">&nbsp;(Extra Bed.)</span>
                                        </label>
                                    </div>
                                    <div v-if="it.age.length > 0" class="col-10">
                                        <div class="row" v-for="age in it.age" :key="age">
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
                                            <div class="col-2 text-center">{{pricePerPerson(room._id, per._id).purchasePrice * age.calc}}€ ({{pricePerPerson(room._id, per._id).purchasePrice}})/{{pricePerPerson(room._id, per._id).salesPrice * age.calc}}€ ({{pricePerPerson(room._id, per._id).salesPrice}})</div>
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
    </div>
</div>
</template>

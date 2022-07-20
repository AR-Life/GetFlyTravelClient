<script setup>
import {
  defineProps,
  onMounted,
} from 'vue';

const props = defineProps({
  hotel: Object,
});
const a = 'abcdefghijklmnopqrstuvwxyz';

function alphabet(i) {
  return a.toUpperCase().charAt(i - 1);
}

function getPeriodCalc(pid, rid, type) {
  const it = props.hotel.pricePerPerson.findIndex((x) => x.period_id === pid && x.room_id === rid);
  switch (type) {
    case 1:
      return props.hotel.pricePerPerson[it].purchasePrice;
    case 2:
      return props.hotel.pricePerPerson[it].salesPrice;
    default:
      return props.hotel.pricePerPerson[it].purchasePrice;
  }
}

function getAccomodation(pid, rid) {
  return props.hotel.pac.filter((x) => x.room_id === rid && x.period_id === pid);
}
onMounted(() => {
  alphabet(1);
});
</script>
<template>
<div class="row">
  <div class="col-xl-12">
    <div class="card">
      <div class="card-header">
        <h4 class="card-title mb-0">Live Preview</h4>
      </div>
      <div class="card-body">
        <!-- Tables Border Colors -->
        <h2>Hotel İnfo</h2>
        <table class="table table-bordered border-secondary table-nowrap">
          <thead>
            <tr>
              <th scope="col">HOTEL</th>
              <td scope="col">{{hotel.name}}</td>
              <th scope="col">Tax Administration</th>
              <td scope="col">{{hotel.administration}}</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Company name</th>
              <td>{{hotel.companyName}}</td>
              <th>Adress</th>
              <td>{{hotel.address}}</td>
            </tr>
            <tr>
              <th scope="row">Web & Tel</th>
              <td>{{hotel.web}}</td>
              <td>{{hotel.tel}}</td>
              <th>Hostel Type</th>
            </tr>
            <tr>
              <th scope="row">Contact Mail</th>
              <td>{{hotel.firstMail}}</td>
              <td>{{hotel.secondMail}}</td>
              <td>{{hotel.hostelType}}</td>
            </tr>
          </tbody>
        </table>
        <h2>Period</h2>
        <table class="table table-bordered border-secondary table-nowrap smalltable">
          <thead>
            <tr>
              <th scope="colgroup" :colspan="hotel.period.length+1" class="text-center">S E A S O N S & R A T E S</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th rowspan="4" scope="rowgroup"></th>
              <td v-for="i in props.hotel.period.length" :key="i" class="text-center">{{alphabet(i)}}</td>
            </tr>
            <tr>
              <td v-for="i in props.hotel.period" :key="i" class="text-center">
                <span v-if="i.stayAndArrival">Stay</span>
                <span v-else>Arrival</span>
              </td>
            </tr>
            <tr>
              <td v-for="i in props.hotel.period" :key="i" class="text-center">{{i.startDate}}</td>
            </tr>
            <tr>
              <td v-for="i in props.hotel.period" :key="i" class="text-center">{{i.endDate}}</td>
            </tr>
            <tr v-for="i in props.hotel.roomType" :key="i" class="">
              <td>
                <table class="table mb-0 border-0 table-bordered border-secondary table-nowrap smalltable">
                  <tr>
                    <td colspan="2">
                      <span class="fw-bold">{{i.name}}</span>
                    </td>
                  </tr>
                  <tr v-for="k in props.hotel.accomodationType" :key="k">
                    <td class="p-0" v-if="k.room_id === i.id" :colspan="k.childSize < 1 ? 2 : 1">
                      <span>{{k.adultSize}} Adult</span>
                      <span v-if="k.childSize > 0"> + {{k.childSize}} Child</span>
                    </td>
                    <td v-if="k.room_id === i.id && k.age.length > 0" class="p-0">
                      <table>
                        <tr v-for="(s, index) in k.age" :key="s">
                          <td class="border-0">{{index+1}}. ({{s.min}}-{{s.max}})</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
              <td v-for="j in props.hotel.period" :key="j">
                <table class="table table-bordered border-primary">
                  <tr>
                    <td>Calc.</td>
                    <td>{{getPeriodCalc(j.id, i.id, 1)}}</td>
                    <td>{{getPeriodCalc(j.id, i.id, 2)}}</td>
                  </tr>
                  <tr v-for="a in getAccomodation(j.id, i.id)" :key="a">
                    <td v-if="a.age.length > 0">
                      <table>
                        <tr v-for="h in a.age" :key="h">
                          <td>
                            {{h.calc}}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td v-else>
                      <table>
                        <tr>
                          <td>{{a.calc}}</td>
                        </tr>
                      </table>
                    </td>
                    <td v-if="a.age.length > 0">
                      <table>
                        <tr v-for="h in a.age" :key="h">
                          <td>
                            {{typeof h.calc === 'string' ? (h.calc.replace(',', '.') * getPeriodCalc(j.id, i.id, 1)).toFixed(2): h.calc *  getPeriodCalc(j.id, i.id, 1)}}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td v-else>
                      <table>
                        <tr>
                          <td>{{(typeof a.calc === 'string' ? (a.calc.replace(',', '.') * getPeriodCalc(j.id, i.id, 1)).toFixed(2) : a.calc * getPeriodCalc(j.id, i.id, 1))}}</td>
                        </tr>
                      </table>
                    </td>
                    <td v-if="a.age.length > 0">
                      <table>
                        <tr v-for="h in a.age" :key="h">
                          <td>
                            {{(typeof h.calc === 'string' ? (h.calc.replace(',', '.') * getPeriodCalc(j.id, i.id, 2)).toFixed(2) : h.calc * getPeriodCalc(j.id, i.id, 2))}}
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td v-else>
                      <table>
                        <tr>
                          <td>{{(typeof a.calc === 'string' ? (a.calc.replace(',', '.') * getPeriodCalc(j.id, i.id, 2)).toFixed(2) : a.calc * getPeriodCalc(j.id, i.id, 2))}}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>
<style>
table {
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid #3d78e3 !important;
  table-layout: fixed;
  border: none !important;
}

td>table>tr>td {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

td>table>tr {
  margin: 0,  !important;
  padding: 0,  !important;
}

.table-bordered td {
  border: 1px solid #3d78e3;
}

td {
  word-wrap: break-word;
  text-overflow: ellipsis;
}

table th {
  font-weight: 900;
}

.smalltable> :not(caption)>*>* {
  padding: 0;
}
</style>

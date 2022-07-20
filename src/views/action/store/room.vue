<template>
<div class="row" v-for="room in hotel.room" :key="room">
  <div class="col-12">
    <div class="card">
      <div class="card-header align-items-center d-flex bg-success">
        <h4 class="card-title mb-0 flex-grow-1 text-white">{{room.name}}</h4>
        <button type="button" class="btn btn-primary" data-bs-toggle="collapse" :data-bs-target="['#roomCardBody'+room._id]" aria-expanded="true" :aria-controls="['roomCardBody'+room._id]"> göster/gizle</button>
      </div>
      <!-- end card header -->
      <div class="card-body bg-soft-success collopse collapse" :id="['roomCardBody'+room._id]">
        <div class="live-preview">
          <div class="row">
            <ol>
              <li style="list-style: none;">
                <div class="row text-center">
                  <div class="col-3"> Buying Price Per Person </div>
                  <div class="col-3"> Sales Price Per Person </div>
                </div>
              </li>
            </ol>
            <ol class="px-3" style="list-style-type: upper-alpha">
              <li class="my-2" v-for="p in getPrice(room._id)" :key="p">
                <div class="row">
                  <div class="col-3">
                    <input v-model="p.purchasePrice" v-on:change="changeValue(p)" @focus="$event.target.select()" type="number" class="form-control">
                  </div>
                  <div class="col-3">
                    <input v-model="p.salesPrice" v-on:change="changeValue(p)" @focus="$event.target.select()" type="number" class="form-control">
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
    <button @click="close(hotel.id)" type="button" class="btn btn-light" data-bs-dismiss="modal"> Close </button>
    <button @click="next(this.hotel, 'market')" type="button" class="btn btn-primary"> Next</button>
  </div>
</div>
</template>
<script>

export default {
  props: ['data', 'close', 'next'],
  computed: {
    hotel() {
      return this.data;
    },
  },
  methods: {
    changeValue() {
      console.log(this.hotel);
    },
    getPrice(roomId) {
      const action = this.hotel.actions.find((x) => typeof x._id === 'number');
      console.log(action);
      return action.room.filter((x) => x.room_id === roomId);
    },
  },
  created() {
    console.log(this.hotel);
  },
};

</script>

<template>
<div v-for="room in hotel.room" :key="room" class="row">{{room}}</div>
</template>
<script>
export default {
  props: ['data'],
  data() {
    return {
      hotel: this.data,
    };
  },

};
</script>

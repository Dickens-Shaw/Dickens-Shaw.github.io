<template>
  <h2>Global Variables</h2>
  <div>
    <p><strong>userAgent:</strong> {{ globalVars.userAgent }}</p>
    <p><strong>vendor:</strong> {{ globalVars.vendor }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import eruda from 'eruda';

eruda.init();

const globalVars = ref({
  window: '',
  ethereum: '',
  userAgent: '',
  vendor: '',
});

onMounted(() => {
  console.log('window------', window);
  console.log('ethereum------', window.ethereum);
  console.log('userAgent------', navigator.userAgent);
  console.log('vendor------', navigator.vendor);
  globalVars.value = {
    userAgent: navigator.userAgent || 'undefined',
    vendor: navigator.vendor || 'undefined',
  };
});
</script>

<style>

</style>
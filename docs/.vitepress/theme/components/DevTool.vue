<template>
  <h1>Global Variables</h1>
  <div>
    <p><strong>userAgent:</strong> {{ globalVars.userAgent }}</p>
    <p><strong>vendor:</strong> {{ globalVars.vendor }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const globalVars = ref({
  window: '',
  ethereum: '',
  userAgent: '',
  vendor: '',
});

onMounted(async() => {
  if (typeof window !== 'undefined') {
    const eruda = await import('eruda');
    eruda.init();

    console.log('window------', window);
    console.log('ethereum------', window.ethereum);
    console.log('userAgent------', navigator.userAgent);
    console.log('vendor------', navigator.vendor);
    globalVars.value = {
      userAgent: navigator.userAgent || 'undefined',
      vendor: navigator.vendor || 'undefined',
    };
  }
});
</script>

<style></style>
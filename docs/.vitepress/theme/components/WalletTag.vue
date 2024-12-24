<template>
  <div>
    <div v-for=" wallet in walletSupport" :key="wallet.name">
      {{ wallet.name }} web: {{ wallet.web ? '✔' : '✘' }} mobile: {{ wallet.mobile ? '✔' : '✘' }}
    </div>
    <p></p>
    <div>UserAgent: {{clientInfo.userAgent}}</div>
    <div>Vendor: {{clientInfo.vendor}}</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const walletSupport = ref([])
const clientInfo = ref({})

onMounted(() => {
  if (typeof window === 'undefined') return;
  walletSupport.value = [
    // Argent
    {
      name: 'ArgentX',
      web: window.starknet || window.starknet_argentX,
      mobile: window.starknet_argentX // && window.starknet_argentX.isInAppBrowser
    },
    // BitGet
    {
      name: 'Bitget',
      web: window.bitgetWallet || window.bitgetTonWallet || window.bitkeep || window.ethereum?.isBitKeep || window.ethereum?.isBitKeepChrome,
      mobile: window.bitgetWallet || window.bitgetTonWallet || window.bitkeep
    },
    // CoinBase
    {
      name: 'CoinBase',
      web: window.coinbaseWalletExtension || window.ethereum?.isCoinbaseWallet,
      mobile: window.coinbaseWallet || window.ethereum?.isCoinbaseBrowser
    },
    // MetaMask
    {
      name: 'MetaMask',
      web: window.ethereum?.isMetaMask,
      mobile: window.metamask || window.ethereum
    },
    // Phantom
    {
      name: 'Phantom',
      web: window.phantom,
      mobile: window.phantom
    },
    // TokenPocket
    {
      name: 'TokenPocket',
      web: window.tokenpocket || window.ethereum?.isTokenPocket,
      mobile: window.tokenpocket
    },
    // TronLink
    {
      name: 'TronLink',
      web: window.tronLink || window.ethereum?.isTronLink,
      mobile: window.tronLink
    },
    // TrustWallet
    {
      name: 'TrustWallet',
      web: window.trustwallet || window.trustWallet || window.ethereum?.isTrust || window.ethereum?.isTrustWallet,
      mobile: window.trustwallet || window.trustWallet
    },
    // 欧意 OKX
    {
      name: 'OKX',
      web: window.okexchain || window.okxwallet,
      mobile:  window.okexchain || window.okxwallet
    },
  ]

  clientInfo.value = {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor
  }
})
</script>

<style></style>
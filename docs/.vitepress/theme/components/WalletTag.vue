<template>
  <div>
    <div v-for=" wallet in walletSupport" :key="wallet.name">
      <div>[{{ wallet.name }}]: web: {{ wallet.web ? '✔' : '✘' }} mobile: {{ wallet.mobile ? '✔' : '✘' }}</div>
      <ul>
        <li v-for="(value, key) in wallet.envs" :key="key">
          window.{{ key.replace('_', '.') }}: {{ value }}
        </li>
      </ul>
    </div>
    <p></p>
    <div>UserAgent: {{ clientInfo.userAgent }}</div>
    <div>Vendor: {{ clientInfo.vendor }}</div>
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
      mobile: window.starknet_argentX,
      envs: {
        starknet: window.starknet ? '✔' : '✘',
        starknet_argentX: window.starknet_argentX ? '✔' : '✘',
      },
    },
    // BitGet
    {
      name: 'Bitget',
      web: window.bitgetWallet || window.bitgetTonWallet || window.bitkeep || window.ethereum?.isBitKeep || window.ethereum?.isBitKeepChrome,
      mobile: window.bitgetWallet || window.bitgetTonWallet || window.bitkeep,
      envs: {
        bitgetWallet: window.bitgetWallet ? '✔' : '✘',
        bitgetTonWallet: window.bitgetTonWallet ? '✔' : '✘',
        bitkeep: window.bitkeep ? '✔' : '✘',
        ethereum_isBitKeep: window.ethereum?.isBitKeep ? '✔' : '✘',
        ethereum_isBitKeepChrome: window.ethereum?.isBitKeepChrome ? '✔' : '✘',
      },
    },
    // CoinBase
    {
      name: 'CoinBase',
      web: window.coinbaseWalletExtension || window.ethereum?.isCoinbaseWallet,
      mobile: window.coinbaseWallet || window.ethereum?.isCoinbaseBrowser,
      envs: {
        coinbaseWalletExtension: window.coinbaseWalletExtension ? '✔' : '✘',
        ethereum_isCoinbaseWallet: window.ethereum?.isCoinbaseWallet ? '✔' : '✘',
        coinbaseWallet: window.coinbaseWallet ? '✔' : '✘',
        ethereum_isCoinbaseBrowser: window.ethereum?.isCoinbaseBrowser ? '✔' : '✘',
      },
    },
    // MetaMask
    {
      name: 'MetaMask',
      web: window.ethereum?.isMetaMask,
      mobile: window.metamask || window.ethereum,
      envs: {
        ethereum_isMetaMask: window.ethereum?.isMetaMask ? '✔' : '✘',
        metamask: window.metamask ? '✔' : '✘',
        ethereum: window.ethereum ? '✔' : '✘',
      },
    },
    // Phantom
    {
      name: 'Phantom',
      web: window.phantom,
      mobile: window.phantom,
      envs: {
        phantom: window.phantom ? '✔' : '✘',
      },
    },
    // TokenPocket
    {
      name: 'TokenPocket',
      web: window.tokenpocket || window.ethereum?.isTokenPocket,
      mobile: window.tokenpocket,
      envs: {
        tokenpocket: window.tokenpocket ? '✔' : '✘',
        ethereum_isTokenPocket: window.ethereum?.isTokenPocket ? '✔' : '✘',
      },
    },
    // TronLink
    {
      name: 'TronLink',
      web: window.tronLink || window.ethereum?.isTronLink,
      mobile: window.tronLink,
      envs: {
        tronLink: window.tronLink ? '✔' : '✘',
        ethereum_isTronLink: window.ethereum?.isTronLink ? '✔' : '✘',
      },
    },
    // TrustWallet
    {
      name: 'TrustWallet',
      web: window.trustwallet || window.trustWallet || window.ethereum?.isTrust || window.ethereum?.isTrustWallet,
      mobile: window.trustwallet || window.trustWallet,
      envs: {
        trustwallet: window.trustwallet ? '✔' : '✘',
        trustWallet: window.trustWallet ? '✔' : '✘',
        ethereum_isTrust: window.ethereum?.isTrust ? '✔' : '✘',
        ethereum_isTrustWallet: window.ethereum?.isTrustWallet ? '✔' : '✘',
      },
    },
    // 欧意 OKX
    {
      name: 'OKX',
      web: window.okexchain || window.okxwallet,
      mobile: window.okexchain || window.okxwallet,
      envs: {
        okexchain: window.okexchain ? '✔' : '✘',
        okxwallet: window.okxwallet ? '✔' : '✘',
      },
    },
  ]

  clientInfo.value = {
    userAgent: navigator.userAgent,
    vendor: navigator.vendor
  }
})
</script>

<style></style>

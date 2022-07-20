<script>
import flatpickr from 'vue-flatpickr-component';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'flatpickr/dist/flatpickr.css';

export default {
  props: ['data', 'next'],
  data() {
    return {
      config: {
        wrap: true, // set wrap to true only when using 'input-group'
        altFormat: 'd/m/Y',
        allowInput: true,
        altInput: true,
        dateFormat: 'Y-m-d',
      },
    };
  },
  components: {
    flatpickr,
  },
  computed: {
    hotel() {
      return this.data;
    },
  },
  methods: {
    nextData() {
      this.next(this.hotel, 'period');
    },
  },
};
</script>
<template>
<div class="row g-3">
  <div class="col-sm-2">
    <label class="form-label">Season</label>
    <input v-model="hotel.contract.season" type="text" class="form-control" id="hotelName" required>
  </div>
  <div class="col-sm-2">
    <label class="form-label">Valid from:</label>
    <flatpickr v-model="hotel.contract.validFrom" :config="config" />
  </div>
  <div class="col-sm-3">
    <label class="form-label">Season start:</label>
    <flatpickr v-model="hotel.contract.seasonFromTo.start" :config="config" />
  </div>
  <div class="col-sm-3">
    <label class="form-label">Season end:</label>
    <flatpickr v-model="hotel.contract.seasonFromTo.end" :config="config" />
  </div>
  <div class="col-sm-2">
      <label class="form-label">Currency:</label>
      <select class="form-select  mb-3" v-model="hotel.contract.currency">
        <option value="USD">USD $</option>
        <option value="TRY">TRY ₺</option>
        <option value="EUR">EUR €</option>
        <option value="GBP">GBP £</option>
        <option value="CHF">CHF CHF</option>
        <option value="CNY">CNY ¥</option>
        <option value="JPY">JPY ¥</option>
        <option value="SAR">SAR ﷼</option>
        <option value="NOK">NOK kr</option>
        <option value="DKK">DKK kr</option>
        <option value="AUD">AUD $</option>
        <option value="CAD">CAD $</option>
        <option value="SEK">SEK kr</option>
        <option value="KWD">KWD د.ك</option>
        <option value="IRR">IRR ﷼</option>
        <option value="RUB">RUB руб</option>
        <option value="AFN">AFN ؋</option>
        <option value="AOA">AOA Kz</option>
        <option value="ARS">ARS $</option>
        <option value="ALL">ALL Lek</option>
        <option value="AWG">AWG ƒ</option>
        <option value="AZN">AZN ман</option>
        <option value="AED">AED د.إ</option>
        <option value="BSD">BSD $</option>
        <option value="BHD">BHD د.ب</option>
        <option value="BDT">BDT ৳</option>
        <option value="BBD">BBD $</option>
        <option value="BYR">BYR p.</option>
        <option value="BZD">BZD BZ$</option>
        <option value="BMD">BMD $</option>
        <option value="BTN">BTN Nu</option>
        <option value="BOB">BOB $b</option>
        <option value="BAM">BAM KM</option>
        <option value="BWP">BWP P</option>
        <option value="BRL">BRL R$</option>
        <option value="BND">BND $</option>
        <option value="BGN">BGN лв</option>
        <option value="BIF">BIF BIF</option>
        <option value="XAF">XAF XAF</option>
        <option value="CVE">CVE CVE</option>
        <option value="GIP">GIP £</option>
        <option value="DZD">DZD DZD</option>
        <option value="DJF">DJF DJF</option>
        <option value="CZK">CZK Kč</option>
        <option value="DOP">DOP RD$</option>
        <option value="XCD">XCD $</option>
        <option value="SVC">SVC $</option>
        <option value="IDR">IDR Rp</option>
        <option value="ERN">ERN ERN</option>
        <option value="AMD">AMD AMD</option>
        <option value="ETB">ETB ETB</option>
        <option value="FKP">FKP £</option>
        <option value="MAD">MAD MAD</option>
        <option value="FJD">FJD $</option>
        <option value="PHP">PHP ₱</option>
        <option value="GMD">GMD GMD</option>
        <option value="GHS">GHS ¢</option>
        <option value="GNF">GNF GNF</option>
        <option value="GTQ">GTQ Q</option>
        <option value="GYD">GYD $</option>
        <option value="ZAR">ZAR R</option>
        <option value="KRW">KRW ₩</option>
        <option value="GEL">GEL GEL</option>
        <option value="HTG">HTG HTG</option>
        <option value="INR">INR ₹</option>
        <option value="ANG">ANG ƒ</option>
        <option value="HNL">HNL L</option>
        <option value="HKD">HKD $</option>
        <option value="HRK">HRK kn</option>
        <option value="IQD">IQD IQD</option>
        <option value="ILS">ILS ₪</option>
        <option value="ISK">ISK kr</option>
        <option value="JMD">JMD J$</option>
        <option value="KHR">KHR ៛</option>
        <option value="QAR">QAR ﷼</option>
        <option value="KYD">KYD $</option>
        <option value="KZT">KZT лв</option>
        <option value="KES">KES KSh</option>
        <option value="COP">COP $</option>
        <option value="KMF">KMF KMF</option>
        <option value="CDF">CDF CDF</option>
        <option value="CRC">CRC ₡</option>
        <option value="KPW">KPW ₩</option>
        <option value="CUP">CUP ₱</option>
        <option value="KGS">KGS лв</option>
        <option value="LAK">LAK ₭</option>
        <option value="LSL">LSL LSL</option>
        <option value="LVL">LVL Ls</option>
        <option value="LRD">LRD $</option>
        <option value="LYD">LYD LYD</option>
        <option value="LTL">LTL Lt</option>
        <option value="LBP">LBP £</option>
        <option value="HUF">HUF Ft</option>
        <option value="MGA">MGA Ar</option>
        <option value="MOP">MOP MOP</option>
        <option value="MKD">MKD ден</option>
        <option value="MWK">MWK MWK</option>
        <option value="MVR">MVR Rf</option>
        <option value="MYR">MYR RM</option>
        <option value="MUR">MUR ₨</option>
        <option value="MXN">MXN $</option>
        <option value="MDL">MDL MDL</option>
        <option value="MRO">MRO MRO</option>
        <option value="MZN">MZN MT</option>
        <option value="MNT">MNT ₮</option>
        <option value="MMK">MMK MMK</option>
        <option value="EGP">EGP £</option>
        <option value="NAD">NAD $</option>
        <option value="NPR">NPR ₨</option>
        <option value="NGN">NGN ₦</option>
        <option value="NIO">NIO C$</option>
        <option value="UZS">UZS лв</option>
        <option value="PAB">PAB B/.</option>
        <option value="PGK">PGK PGK</option>
        <option value="PYG">PYG Gs</option>
        <option value="PEN">PEN S/.</option>
        <option value="PLN">PLN zł</option>
        <option value="RON">RON lei</option>
        <option value="RWF">RWF RWF</option>
        <option value="SHP">SHP £</option>
        <option value="WST">WST WST</option>
        <option value="STD">STD STD</option>
        <option value="SCR">SCR ₨</option>
        <option value="SLL">SLL SLL</option>
        <option value="SGD">SGD $</option>
        <option value="SBD">SBD $</option>
        <option value="SOS">SOS S</option>
        <option value="LKR">LKR ₨</option>
        <option value="SDG">SDG SDG</option>
        <option value="SRD">SRD $</option>
        <option value="SYP">SYP £</option>
        <option value="SZL">SZL SZL</option>
        <option value="RSD">RSD Дин.</option>
        <option value="CLP">CLP $</option>
        <option value="TJS">TJS TJS</option>
        <option value="TZS">TZS TZS</option>
        <option value="THB">THB ฿</option>
        <option value="TWD">TWD NT$</option>
        <option value="TOP">TOP TOP</option>
        <option value="TTD">TTD TT$</option>
        <option value="TND">TND DT</option>
        <option value="TMT">TMT TMT</option>
        <option value="UGX">UGX USh</option>
        <option value="UAH">UAH ₴</option>
        <option value="OMR">OMR ﷼</option>
        <option value="UYU">UYU $U</option>
        <option value="JOD">JOD JD</option>
        <option value="VUV">VUV VUV</option>
        <option value="VEF">VEF Bs</option>
        <option value="VND">VND ₫</option>
        <option value="YER">YER ﷼</option>
        <option value="NZD">NZD $</option>
        <option value="ZMW">ZMW ZMW</option>
        <option value="ZWL">ZWL Z$</option>
      </select>
    </div>
</div>
</template>

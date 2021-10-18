<template>
  <div class="wrapper">
    <div v-bind:class="{ hidden: !!value || src }">
      <canvas class="signature-input" ref="canvas" />
      <span v-if="touched === false">Toca la pantalla para firmar</span>
      <v-notice v-if="error" type="danger" class="mb-1">{{ error }}</v-notice>
      <div class="actions-wrapper">
        <v-button v-on:click="clear" secondary
          >Limpiar <v-icon name="clear"
        /></v-button>
        <v-button v-on:click="confirm"
          >Confirmar <v-icon name="check"
        /></v-button>
      </div>
    </div>
    <div v-if="value || src">
      <img
        :src="value ? materializeAssetUrl(value) : src"
        alt="firma"
        role="presentation"
      />
    </div>
  </div>
</template>

<script>
import SignaturePad from "signature_pad";
import { upload, getRootPath } from "./upload";
export default {
  props: {
    value: {
      type: [String, Object],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    folder: {
      type: String,
      default: undefined,
    },
  },
  emits: ["input"],
  inject: ["system"],
  mounted() {
    const el = this.$el.querySelectorAll("canvas")[0];
    this.canvas = el;
    const signaturePad = new SignaturePad(el, {
      onEnd: this.onStrokeEnd,
    });
    this.signaturePad = signaturePad;
    this.resizeCanvas();
  },
  data() {
    const addTokenToURL = this.system.addTokenToURL;
    return {
      touched: false,
      error: null,
      materializeAssetUrl(id) {
        return addTokenToURL(getRootPath() + `assets/${id}`);
      },
      src: null,
    };
  },
  unmounted() {
    this.signaturePad.off();
  },
  methods: {
    clear() {
      this.touched = false;
      this.error = null;
      this.signaturePad.clear();
    },
    confirm() {
      this.error = null;
      if (this.signaturePad.isEmpty()) {
        this.error = "Introduce una firma para confirmar";
      }
      const dataUrlFile = this.signaturePad.toDataURL("image/svg+xml");
			console.log(this.$props.folder)
      upload(dataUrlFile, this.system, this.$props.folder).then((response) => {
        this.$emit("input", response.id);
        this.src = dataUrlFile;
      });
    },
    resizeCanvas() {
      var ratio = Math.max(window.devicePixelRatio || 1, 1);
      const el = this.canvas;
      el.width = el.offsetWidth * ratio;
      el.height = el.offsetHeight * ratio;
      el.getContext("2d").scale(ratio, ratio);
      this.signaturePad.clear();
    },
    onStrokeEnd() {
      this.touched = true;
    },
  },
};
</script>

<style>
.wrapper {
  position: relative;
  width: 400px;
}

.signature-input {
  min-height: var(--input-height-tall);
  color: var(--foreground-subdued);
  border: 2px dashed var(--border-normal);
  border-radius: var(--border-radius);
  transition: var(--fast) var(--transition);
  transition-property: color, border-color, background-color;
  width: 100%;
}

.actions-wrapper {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.mb-1 {
  margin-bottom: 16px;
}
.hidden {
  display: none;
}
</style>

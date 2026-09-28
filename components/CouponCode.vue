<script setup lang="ts">
import { ref } from 'vue';
import { copyText } from '@/utils/clipboard';
import { FontAwesomeIcon } from '@/utils/icons';

const props = defineProps<{ code: string; discount: number }>();

const copied = ref(false);

async function copy() {
  copied.value = await copyText(props.code);
  setTimeout(() => (copied.value = false), 1500);
}

defineExpose({ copy });
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    {{ discount }}% off with
    <button
      type="button"
      class="inline-flex items-center gap-1 rounded-sm border border-dashed border-kraken/60 px-1.5 font-mono text-[11px] text-kraken-text transition-colors hover:border-kraken hover:text-white"
      :aria-label="`Copy code ${code}`"
      @click.stop="copy"
    >
      {{ copied ? 'Copied' : code }}
      <FontAwesomeIcon :icon="copied ? 'check' : 'copy'" class="h-2.5 w-2.5" />
    </button>
  </span>
</template>

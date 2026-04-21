<template>
  <Page>
    <ActionBar title="Add Level" />
    <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
      <TextField
        v-model="levelName"
        hint="Level name"
        class="input"
        width="200"
        marginBottom="16"
      />
      <TextField
        v-model="levelOrder"
        hint="Level order"
        keyboardType="number"
        class="input"
        width="200"
        marginBottom="24"
      />
      <Button text="Add" class="btn btn-primary level-btn" marginBottom="16" @tap="onAdd" />
      <Button text="Cancel" class="btn btn-outline level-btn" @tap="onCancel" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'

export default defineComponent({
  data() {
    return {
      levelName: '',
      levelOrder: ''
    }
  },
  methods: {
    onAdd() {
      const name = this.levelName.trim()
      const order = parseInt(this.levelOrder, 10)
      if (!name || isNaN(order)) return
      this.$modal.close({ levelName: name, levelOrder: order })
    },
    onCancel() {
      this.$modal.close(null)
    }
  }
})
</script>

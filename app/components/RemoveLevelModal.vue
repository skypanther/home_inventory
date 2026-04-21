<template>
  <Page>
    <ActionBar title="Edit Level" />
    <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
      <TextField
        v-model="editedName"
        hint="Level name"
        class="input"
        width="200"
        marginBottom="16"
      />
      <TextField
        v-model="editedOrder"
        hint="Level order"
        keyboardType="number"
        class="input"
        width="200"
        marginBottom="24"
      />
      <Button text="Save" class="btn btn-primary level-btn" marginBottom="16" @tap="onSave" />
      <Button text="Remove" class="btn btn-outline level-btn" marginBottom="16" @tap="onRemove" />
      <Button text="Cancel" class="btn btn-outline level-btn" @tap="onCancel" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'

export default defineComponent({
  props: {
    levelId: { type: Number, required: true },
    levelName: { type: String, required: true },
    levelOrder: { type: Number, required: true }
  },
  data() {
    return {
      editedName: this.levelName,
      editedOrder: String(this.levelOrder)
    }
  },
  methods: {
    onSave() {
      const name = this.editedName.trim()
      const order = parseInt(this.editedOrder, 10)
      if (!name || isNaN(order)) return
      this.$modal.close({ action: 'save', levelId: this.levelId, levelName: name, levelOrder: order })
    },
    onRemove() {
      this.$modal.close({ action: 'remove', levelId: this.levelId })
    },
    onCancel() {
      this.$modal.close(null)
    }
  }
})
</script>

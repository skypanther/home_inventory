<template>
  <Page>
    <ActionBar title="Edit Room" />
    <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
      <TextField
        v-model="editedName"
        hint="Room name"
        class="input"
        width="200"
        marginBottom="16"
      />
      <TextField
        v-model="editedOrder"
        hint="Room order"
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
    roomId: { type: Number, required: true },
    roomName: { type: String, required: true },
    roomOrder: { type: Number, required: true }
  },
  data() {
    return {
      editedName: this.roomName,
      editedOrder: String(this.roomOrder)
    }
  },
  methods: {
    onSave() {
      const name = this.editedName.trim()
      const order = parseInt(this.editedOrder, 10)
      if (!name || isNaN(order)) return
      this.$modal.close({ action: 'save', roomId: this.roomId, roomName: name, roomOrder: order })
    },
    onRemove() {
      this.$modal.close({ action: 'remove', roomId: this.roomId })
    },
    onCancel() {
      this.$modal.close(null)
    }
  }
})
</script>

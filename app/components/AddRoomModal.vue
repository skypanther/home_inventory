<template>
  <Page>
    <ActionBar title="Add Room" />
    <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
      <TextField
        v-model="roomName"
        hint="Room name"
        class="input"
        width="200"
        marginBottom="16"
      />
      <TextField
        v-model="roomOrder"
        hint="Room order"
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
      roomName: '',
      roomOrder: ''
    }
  },
  methods: {
    onAdd() {
      const name = this.roomName.trim()
      const order = parseInt(this.roomOrder, 10)
      if (!name || isNaN(order)) return
      this.$modal.close({ roomName: name, roomOrder: order })
    },
    onCancel() {
      this.$modal.close(null)
    }
  }
})
</script>

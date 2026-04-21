<template>
  <Page>
    <ActionBar>
      <GridLayout columns="auto, *" width="100%">
        <Label col="0" class="fas text-lg" :text="'\uf060'" @tap="goBack" />
        <Label col="0" colSpan="2" :text="levelName" class="font-bold text-center" style="font-size: 19" />
      </GridLayout>
    </ActionBar>

    <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
      <Button
        v-for="room in rooms"
        :key="room.room_id"
        :text="room.room_name"
        class="btn btn-primary level-btn"
        @tap="openRoom(room)"
        @longPress="onLongPressRoom(room, $event)"
      />
      <Button text="+ Add Room" class="btn btn-primary level-btn" @tap="onAddRoom" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'
import { Frame } from '@nativescript/core'
import AddRoomModal from './AddRoomModal.vue'
import EditRoomModal from './EditRoomModal.vue'
import RoomScreen from './RoomScreen.vue'
import { getRooms, addRoom, updateRoom, deleteRoom } from '~/shared/database'

interface Room {
  room_id: number
  room_name: string
  room_order: number
}

export default defineComponent({
  props: {
    levelId: { type: Number, required: true },
    levelName: { type: String, required: true }
  },
  data() {
    return {
      rooms: [] as Room[]
    }
  },
  async mounted() {
    await this.refreshRooms()
  },
  methods: {
    openRoom(room: Room) {
      this.$navigateTo(RoomScreen, { frame: Frame.topmost(), props: { levelId: this.levelId, roomId: room.room_id, roomName: room.room_name } })
    },
    async refreshRooms() {
      this.rooms = await getRooms(this.levelId)
    },
    goBack() {
      Frame.topmost().goBack()
    },
    async onAddRoom() {
      const result = await this.$showModal(AddRoomModal, { fullscreen: false })
      if (result) {
        await addRoom(this.levelId, result.roomName, result.roomOrder)
        await this.refreshRooms()
      }
    },
    async onLongPressRoom(room: Room, args: any) {
      if (args.state !== 1) return
      const result = await this.$showModal(EditRoomModal, {
        fullscreen: false,
        props: { roomId: room.room_id, roomName: room.room_name, roomOrder: room.room_order }
      })
      if (!result) return
      if (result.action === 'save') {
        await updateRoom(result.roomId, result.roomName, result.roomOrder)
      } else if (result.action === 'remove') {
        await deleteRoom(result.roomId)
      }
      await this.refreshRooms()
    }
  }
})
</script>

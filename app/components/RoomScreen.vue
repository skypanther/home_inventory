<template>
  <Page>
    <ActionBar>
      <GridLayout columns="auto, *" width="100%">
        <Label col="0" class="fas text-lg" :text="'\uf060'" @tap="goBack" />
        <Label col="0" colSpan="2" text="Items" class="font-bold text-center" style="font-size: 19" />
      </GridLayout>
    </ActionBar>

    <GridLayout>
      <ScrollView>
        <WrapLayout orientation="horizontal">
          <GridLayout
            v-for="item in items"
            :key="item.item_id"
            :width="itemSize"
            :height="itemSize"
            margin="1"
            @tap="openItem(item)"
          >
            <Image :src="item.thumbnail_path" stretch="aspectFill" />
          </GridLayout>
        </WrapLayout>
      </ScrollView>
      <Button class="fas fab-btn" :text="'\uf030'" @tap="onCameraTap" />
    </GridLayout>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'
import { Frame, Screen, Dialogs } from '@nativescript/core'
import * as camera from '@nativescript/camera'
import { getItems, addItem } from '~/shared/database'
import { savePhotoFiles } from '~/shared/imageUtils'
import ItemScreen from './ItemScreen.vue'

interface Item {
  item_id: number
  photo_path: string
  thumbnail_path: string
}

export default defineComponent({
  props: {
    levelId: { type: Number, required: true },
    roomId: { type: Number, required: true },
    roomName: { type: String, required: true }
  },
  data() {
    return {
      items: [] as Item[]
    }
  },
  computed: {
    itemSize(): number {
      return Math.floor(Screen.mainScreen.widthDIPs / 3) - 2
    }
  },
  async mounted() {
    await this.refreshItems()
  },
  methods: {
    async refreshItems() {
      this.items = await getItems(this.roomId)
    },
    openItem(item: Item) {
      this.$navigateTo(ItemScreen, {
        frame: Frame.topmost(),
        props: { itemId: item.item_id, photoPath: item.photo_path }
      })
    },
    goBack() {
      Frame.topmost().goBack()
    },
    async onCameraTap() {
      const perms = await camera.requestPermissions()
      if (!perms.Success) {
        Dialogs.alert({
          title: 'Camera Access Denied',
          message: 'Camera permission was denied. You can enable it in Settings > Privacy > Camera.',
          okButtonText: 'OK'
        })
        return
      }
      const asset = await camera.takePicture({ saveToGallery: false })
      const { photoPath, thumbnailPath } = await savePhotoFiles(asset)
      await addItem(this.levelId, this.roomId, photoPath, thumbnailPath)
      await this.refreshItems()
    }
  }
})
</script>

<template>
  <Page>
    <ActionBar>
      <GridLayout columns="auto, *" width="100%">
        <Label col="0" class="fas text-lg" :text="'\uf0c9'" @tap="onDrawerButtonTap" />
        <Label col="0" colSpan="2" text="Home Inventory" class="font-bold text-lg text-center" />
      </GridLayout>
    </ActionBar>

    <ScrollView>
      <StackLayout verticalAlignment="top" horizontalAlignment="center" marginTop="24">
        <Label text="Levels" class="font-bold text-center levels-title" marginBottom="24" />
        <Button v-for="level in levels" :key="level.level_id" :text="level.level_name" class="btn btn-primary level-btn"
          @tap="openLevel(level)" @longPress="onLongPressLevel(level, $event)" />
        <Button text="+" class="btn btn-primary level-btn" @tap="onAddLevel" />
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'
import * as utils from '~/shared/utils'
import LevelScreen from './LevelScreen.vue'
import AddLevelModal from './AddLevelModal.vue'
import RemoveLevelModal from './RemoveLevelModal.vue'
import { getDb, addLevel, deleteLevel, updateLevel } from '~/shared/database'
import { ScrollView } from '@nativescript/core'

interface Level {
  level_id: number
  level_name: string
  level_order: number
}

export default defineComponent({
  data() {
    return {
      levels: [] as Level[]
    }
  },
  async mounted() {
    await this.refreshLevels()
  },
  methods: {
    async refreshLevels() {
      this.levels = await getDb().select(
        'SELECT level_id, level_name, level_order FROM levels ORDER BY level_order ASC'
      )
    },
    onDrawerButtonTap() {
      utils.showDrawer()
    },
    openLevel(level: Level) {
      this.$navigateTo(LevelScreen, { props: { levelId: level.level_id, levelName: level.level_name } })
    },
    async onAddLevel() {
      const result = await this.$showModal(AddLevelModal, { fullscreen: false })
      if (result) {
        await addLevel(result.levelName, result.levelOrder)
        await this.refreshLevels()
      }
    },
    async onLongPressLevel(level: Level, args: any) {
      if (args.state !== 1) return
      const result = await this.$showModal(RemoveLevelModal, {
        fullscreen: false,
        props: { levelId: level.level_id, levelName: level.level_name, levelOrder: level.level_order }
      })
      if (!result) return
      if (result.action === 'save') {
        await updateLevel(result.levelId, result.levelName, result.levelOrder)
      } else if (result.action === 'remove') {
        await deleteLevel(result.levelId)
      }
      await this.refreshLevels()
    }
  }
})
</script>

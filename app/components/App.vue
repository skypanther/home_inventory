<template>
    <Drawer ref="drawer" gesturesEnabled="true">
        <StackLayout ~leftDrawer backgroundColor="#ffffff">
            <DrawerContent />
        </StackLayout>
        <Frame ~mainContent id="main">
            <Home v-if="dbReady" />
        </Frame>
    </Drawer>
</template>

<script lang="ts">
  import { defineComponent } from 'nativescript-vue'
  import DrawerContent from './DrawerContent.vue'
  import Home from './Home.vue'
  import { initDatabase } from '~/shared/database'

  export default defineComponent({
    components: {
      DrawerContent,
      Home
    },
    data() {
      return { dbReady: false }
    },
    async created() {
      await initDatabase()
      this.dbReady = true
    }
  })
</script>

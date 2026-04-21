<template>
    <Page>
        <ActionBar>
            <GridLayout columns="auto, *">
                <Label col="0" class="fas text-lg" :text="'\uf0c9'" @tap="onDrawerButtonTap"/>
                <Label col="1" text="Browse" class="font-bold text-lg"/>
            </GridLayout>
        </ActionBar>

        <GridLayout>
            <Label class="far text-7xl text-gray-400 text-center" style="vertical-align: top; margin-top: 20%" :text="'\uf1ea'"/>
            <Label class="text-xl text-gray-400 text-center align-middle" text="Page content goes here"/>
        </GridLayout>
    </Page>
</template>

<script lang="ts">
  import { defineComponent } from 'nativescript-vue'
  import * as utils from '~/shared/utils'

  export default defineComponent({
    methods: {
      onDrawerButtonTap() {
        utils.showDrawer()
      }
    }
  })
</script>

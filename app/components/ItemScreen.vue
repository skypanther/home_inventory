<template>
  <Page>
    <ActionBar>
      <GridLayout columns="auto, *" width="100%">
        <Label col="0" class="fas text-lg" :text="'\uf060'" @tap="onCancel" />
        <Label col="0" colSpan="2" text="Item Details" class="font-bold text-center" style="font-size: 19" />
      </GridLayout>
    </ActionBar>

    <ScrollView>
      <StackLayout>
        <Image :src="photoPath" stretch="aspectFit" marginBottom="16" />

        <TextView
          v-model="notes"
          hint="Information about the item"
          height="160"
          margin="0 16 16 16"
          editable="true"
        />

        <Label text="Year Acquired" class="font-bold" margin="0 16 4 16" />
        <TextField
          v-model="yearAcquired"
          hint="e.g. 2023"
          keyboardType="number"
          margin="0 16 24 16"
        />

        <GridLayout columns="*, *" margin="0 16 32 16">
          <Button col="0" text="Cancel" class="btn btn-outline" marginRight="8" @tap="onCancel" />
          <Button col="1" text="Save" class="btn btn-primary" marginLeft="8" @tap="onSave" />
        </GridLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from 'nativescript-vue'
import { Frame } from '@nativescript/core'
import { getItem, updateItem } from '~/shared/database'

export default defineComponent({
  props: {
    itemId: { type: Number, required: true },
    photoPath: { type: String, required: true }
  },
  data() {
    return {
      notes: '',
      yearAcquired: ''
    }
  },
  async mounted() {
    const item = await getItem(this.itemId)
    if (item) {
      this.notes = item.notes || ''
      this.yearAcquired = item.year_acquired || ''
    }
  },
  methods: {
    async onSave() {
      await updateItem(this.itemId, this.notes, this.yearAcquired)
      Frame.topmost().goBack()
    },
    onCancel() {
      Frame.topmost().goBack()
    }
  }
})
</script>

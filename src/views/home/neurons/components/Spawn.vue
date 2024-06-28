<template>
  <a-modal
    v-model="visible"
    centered
    title="Spawn"
    width="550px"
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="disburse-modal"
    :after-close="afterClose"
  >
    <a-form-model :model="form" ref="form" :rules="formRules">
      <a-form-model-item label="New Controller" prop="principal">
        <a-input
          v-model="form.principal"
          autocomplete="off"
          placeholder="Principal"
        />
      </a-form-model-item>
      <a-form-model-item>
        <button
          type="button"
          class="transfer-submit primary large-primary"
          @click="onSpawn"
        >
          Spawn
        </button>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Principal } from '@dfinity/principal';
import { GovernanceService } from '@/ic/governance/governanceService';
import { WrappedFormUtils } from 'ant-design-vue/types/form/form';
import { validateCanister } from '@/utils/validate';
import { SpawnRequest } from '@/ic/governance/model';
import { checkAuth } from '@/ic/CheckAuth';
@Component({
  name: 'Spawn',
  components: {}
})
export default class extends Vue {
  @Prop()
  public neuronId!: bigint;
  @Prop()
  public governanceService!: GovernanceService;
  public visible = false;
  public form = {
    principal: ''
  };
  public formRules = {
    principal: [
      { required: true, message: 'Please enter Principal', trigger: 'blur' },
      { validator: validateCanister, trigger: 'blur' }
    ]
  };
  public onSpawn(): void {
    (this.$refs.form as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const response = await this.governanceService.spawn(this.neuronId);
            this.$emit('spawnSuccess', response.created_neuron_id[0].id);
            this.$message.success('spawn Success');
            this.visible = false;
          } catch (e) {
            console.log(e);
            this.$message.error(e.error_message);
          }
          loading.close();
        }
      }
    );
  }
  public afterClose(): void {
    (this.$refs.form as Vue & WrappedFormUtils).resetFields();
  }
}
</script>

<style scoped lang="scss">
.disburse-modal {
  button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>

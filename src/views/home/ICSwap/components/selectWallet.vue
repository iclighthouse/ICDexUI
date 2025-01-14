<template>
  <a-modal
    v-model="cyclesFormVisible"
    width="550px"
    title=""
    centered
    :footer="null"
    :keyboard="false"
    :maskClosable="false"
    class="other-cycles-modal delete-modal"
    :after-close="closeCyclesForm"
  >
    <a-form-model :model="cyclesForm" ref="cyclesForm" :rules="cyclesFormRules">
      <a-form-model-item label="Canister ID" prop="cyclesCanister">
        <a-input
          autocomplete="off"
          v-model="cyclesForm.cyclesCanister"
          type="text"
          placeholder="Canister ID(Principal)"
        />
      </a-form-model-item>
    </a-form-model>
    <div class="delete-button">
      <button @click="cyclesFormVisible = false">Cancel</button>
      <button class="default" @click="ConfirmOtherCycles">Confirm</button>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validateCyclesWalletCanister } from '@/utils/validate';
@Component({
  name: 'selectWallet',
  components: {}
})
export default class extends Vue {
  private cyclesFormVisible = false;
  private cyclesForm = {
    cyclesCanister: ''
  };
  private cyclesFormRules = {
    cyclesCanister: [
      {
        required: true,
        message: 'Please enter cycles wallet',
        trigger: 'blur'
      },
      { validator: validateCyclesWalletCanister, trigger: 'blur' }
    ]
  };
  private ConfirmOtherCycles(): void {
    (this.$refs as any).cyclesForm.validate((valid: any) => {
      if (valid) {
        const cyclesCanister = this.cyclesForm.cyclesCanister;
        this.$emit('cyclesCanisterChange', cyclesCanister);
        this.cyclesFormVisible = false;
      }
    });
  }
  private closeCyclesForm(): void {
    (this.$refs as any).cyclesForm.resetFields();
  }
}
</script>
<style scoped lang="scss">
.other-cycles-modal {
  ::v-deep .ant-modal-body {
    padding: 30px 55px 10px;
  }
}
</style>

<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      title="Hotkeys"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="follow-neurons-modal"
      :after-close="afterClose"
    >
      <a-form-model
        :model="hotkeysForm"
        ref="hotkeysForm"
        :rules="hotkeysFormRules"
      >
        <a-form-model-item label="Enter Hotkey" prop="principal">
          <a-input
            v-model="hotkeysForm.principal"
            autocomplete="off"
            type="text"
            placeholder="Principal Id"
          />
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 transfer-submit large-primary primary"
            @click="addHotkey"
          >
            Add Hotkey
          </button>
        </a-form-model-item>
      </a-form-model>
      <div class="hotkey-main">
        <p class="base-font-title">Hotkeys</p>
        <ul v-if="neuron && neuron.hot_keys && neuron.hot_keys.length">
          <li v-for="(item, index) in neuron.hot_keys" :key="index">
            <span> {{ item.toString() }} </span>
            <span class="margin-left-auto">
              <a-icon
                @click="removeHotkey(item.toString())"
                type="close-circle"
              />
            </span>
          </li>
        </ul>
        <div v-else>No hotkeys</div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validateCanister } from '@/utils/validate';
import { Neuron } from '@/ic/governance/model';
import { GovernanceService } from '@/ic/governance/governanceService';
import { GovernanceError } from '@/ic/SNSGovernance/model';

@Component({
  name: 'HotKey',
  components: {}
})
export default class extends Vue {
  private visible = false;
  private governanceService: GovernanceService = null;
  private hotkeysForm = {
    principal: ''
  };
  private neuron: Neuron = null;
  private index: number;
  private hotkeysFormRules = {
    principal: [
      {
        required: true,
        message: 'Please enter principal id',
        trigger: 'change'
      },
      { validator: validateCanister, trigger: 'blur' }
    ]
  };
  private init(neuron: Neuron, index: number): void {
    this.governanceService = new GovernanceService();
    this.visible = true;
    this.neuron = neuron;
    this.index = index;
    console.log(this.neuron, this.index);
  }
  private async addHotkey(): Promise<void> {
    (this.$refs.hotkeysForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          const res = await this.governanceService.addHotKey(
            this.neuron.id[0].id,
            this.hotkeysForm.principal
          );
          if (res && res.command) {
            const type = Object.keys(res.command[0])[0];
            if (type === 'Error') {
              const err = Object.values(res.command[0])[0] as GovernanceError;
              this.$message.error(err.error_message);
            } else {
              (this.$refs.hotkeysForm as any).resetFields();
              this.$message.success('Success');
              this.$emit('addHotkeySuccess', this.neuron.id[0].id);
            }
          } else {
            this.$message.error('Error');
          }
          loading.close();
        }
      }
    );
  }
  private async removeHotkey(principal: string): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    const res = await this.governanceService.removeHotKey(
      this.neuron.id[0].id,
      principal
    );
    if (res && res.command) {
      const type = Object.keys(res.command[0])[0];
      if (type === 'Error') {
        const err = Object.values(res.command[0])[0] as GovernanceError;
        this.$message.error(err.error_message);
      } else {
        this.$message.success('Success');
        this.$emit('addHotkeySuccess', this.neuron.id[0].id);
      }
    } else {
      this.$message.error('Error');
    }
    loading.close();
  }
  private afterClose(): void {
    (this.$refs.hotkeysForm as any).resetFields();
  }
}
</script>

<style scoped lang="scss">
.hotkey-main {
  p {
    margin-top: 40px;
    font-size: 16px;
  }
  li {
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <div>
    <a-modal
      v-model="visible"
      centered
      title="Follow Neurons"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      class="follow-neurons-modal"
      :after-close="afterCloseFollow"
    >
      <div>
        <div class="base-font-tip">
          Follow neurons to automate your voting, and receive the maximum voting
          rewards. You can follow neurons on specific topics or all topics.
        </div>
        <div class="follow-Neuron-list">
          <p class="follow-Neuron-list-title">Currently Following</p>
          <div
            class="follow-Neuron-list-ul-main"
            v-if="neuron && neuron.followees && neuron.followees.length"
          >
            <ul
              class="follow-Neuron-list-item"
              v-for="item in neuron.followees"
              :key="item[0].toString(10)"
            >
              <li>
                <div class="follow-Neuron-list-item-name">
                  {{ functionsName[item[0].toString(10)] }}
                </div>
                <div class="follow-Neuron-list-item-ids">
                  <div
                    v-for="(followee, index) in item[1].followees"
                    :key="index"
                  >
                    <a-tooltip placement="top">
                      <template slot="title">
                        {{ arrayToString(followee.id) }}
                      </template>
                      <span
                        v-show="
                          SNSNeurons &&
                          ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'SNS1' &&
                            arrayToString(followee.id) === sns1Id) ||
                            (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'CHAT' &&
                              arrayToString(followee.id) === chatId))
                        "
                        class="follow-Neuron-list-item-id"
                      >
                        ICLighthouse
                      </span>
                      <span
                        v-show="
                          !(
                            SNSNeurons &&
                            ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'SNS1' &&
                              arrayToString(followee.id) === sns1Id) ||
                              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                                'CHAT' &&
                                arrayToString(followee.id) === chatId))
                          )
                        "
                        class="follow-Neuron-list-item-id"
                      >
                        {{ arrayToString(followee.id) | ellipsisAccount(6) }}
                      </span>
                    </a-tooltip>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else>No followees</div>
        </div>
        <p class="add-remove-title">
          Add/Remove followees
          <button
            v-if="neuron && neuron.followees && neuron.followees.length"
            class="margin-left-auto primary"
            type="button"
            @click="deleteAllFollowee"
          >
            Remove All
          </button>
        </p>
        <a-collapse
          v-if="SNSNeurons && SNSNeurons.listNervousSystemFunctions"
          expand-icon-position="right"
          class="follow-collapse-panel-main"
          v-model="activeKey"
        >
          <a-collapse-panel
            v-for="list in SNSNeurons.listNervousSystemFunctions.functions.slice(
              0,
              1
            )"
            :key="list.id.toString(10)"
            class="follow-collapse-panel-item"
          >
            <div slot="header">
              <div class="follow-collapse-panel-header">
                <div>
                  <p class="system-name">{{ getSystemName(list) }}</p>
                  <div class="system-description">
                    {{ list.description[0] }}
                  </div>
                </div>
                <span class="follow-number">{{
                  followees[list.id.toString(10)] &&
                  followees[list.id.toString(10)].followees.length
                    ? followees[list.id.toString(10)].followees.length
                    : 0
                }}</span>
              </div>
            </div>
            <div>
              <p>Currently Following</p>
              <ul
                v-if="
                  followees[list.id.toString(10)] &&
                  followees[list.id.toString(10)].followees.length
                "
                class="followees-main"
              >
                <li
                  v-for="(followee, index) in followees[list.id.toString(10)]
                    .followees"
                  :key="index"
                  class="followees-item"
                >
                  <span
                    v-show="
                      SNSNeurons &&
                      ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1' &&
                        arrayToString(followee.id) === sns1Id) ||
                        (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT' &&
                          arrayToString(followee.id) === chatId))
                    "
                  >
                    ICLighthouse
                    <a-icon
                      type="copy"
                      @click.stop.prevent
                      v-clipboard:copy="arrayToString(followee.id)"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    />
                  </span>
                  <copy-account
                    v-show="
                      !(
                        SNSNeurons &&
                        ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                          'SNS1' &&
                          arrayToString(followee.id) === sns1Id) ||
                          (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'CHAT' &&
                            arrayToString(followee.id) === chatId))
                      )
                    "
                    :front="8"
                    :account="arrayToString(followee.id)"
                    copy-text="Neuron ID"
                  ></copy-account>
                  <span class="margin-left-auto">
                    <a-icon @click="deleteFollowee(list, index)" type="close" />
                  </span>
                </li>
              </ul>
              <div class="add-followee-button mt20">
                <button
                  type="button"
                  class="primary"
                  @click="onAddFollowee(list)"
                >
                  Add Followee
                </button>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel class="follow-collapse-panel-main-advanced">
            <div slot="header" class="base-color-w">Advanced</div>
            <a-collapse
              v-if="SNSNeurons && SNSNeurons.listNervousSystemFunctions"
              expand-icon-position="right"
              class="follow-collapse-panel-main"
              v-model="activeKeyAdvanced"
            >
              <a-collapse-panel
                v-for="list in SNSNeurons.listNervousSystemFunctions.functions.slice(
                  1
                )"
                :key="list.id.toString(10)"
                class="follow-collapse-panel-item"
              >
                <div slot="header">
                  <div class="follow-collapse-panel-header">
                    <div>
                      <p class="system-name">{{ getSystemName(list) }}</p>
                      <div class="system-description">
                        {{ list.description[0] }}
                      </div>
                    </div>
                    <span class="follow-number">{{
                      followees[list.id.toString(10)] &&
                      followees[list.id.toString(10)].followees.length
                        ? followees[list.id.toString(10)].followees.length
                        : 0
                    }}</span>
                  </div>
                </div>
                <div>
                  <p>Currently Following</p>
                  <ul
                    v-if="
                      followees[list.id.toString(10)] &&
                      followees[list.id.toString(10)].followees.length
                    "
                    class="followees-main"
                  >
                    <li
                      v-for="(followee, index) in followees[
                        list.id.toString(10)
                      ].followees"
                      :key="index"
                      class="followees-item"
                    >
                      <span
                        v-show="
                          SNSNeurons &&
                          ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                            'SNS1' &&
                            arrayToString(followee.id) === sns1Id) ||
                            (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'CHAT' &&
                              arrayToString(followee.id) === chatId))
                        "
                      >
                        ICLighthouse
                        <a-icon
                          type="copy"
                          @click.stop.prevent
                          v-clipboard:copy="arrayToString(followee.id)"
                          v-clipboard:success="onCopy"
                          v-clipboard:error="onError"
                        />
                      </span>
                      <copy-account
                        v-show="
                          !(
                            SNSNeurons &&
                            ((SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                              'SNS1' &&
                              arrayToString(followee.id) === sns1Id) ||
                              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol ===
                                'CHAT' &&
                                arrayToString(followee.id) === chatId))
                          )
                        "
                        :front="8"
                        :account="arrayToString(followee.id)"
                        copy-text="Neuron ID"
                      ></copy-account>
                      <span class="margin-left-auto">
                        <a-icon
                          @click="deleteFollowee(list, index)"
                          type="close"
                        />
                      </span>
                    </li>
                  </ul>
                  <div class="add-followee-button mt20">
                    <button
                      type="button"
                      class="primary"
                      @click="onAddFollowee(list)"
                    >
                      Add Followee
                    </button>
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </a-modal>
    <a-modal
      v-model="newFolloweeVisible"
      centered
      title="Enter New Followee"
      width="750px"
      :footer="null"
      :keyboard="false"
      :maskClosable="false"
      :after-close="afterClose"
    >
      <a-form-model
        :model="newFolloweeForm"
        ref="newFolloweeForm"
        :rules="newFolloweeFormRules"
      >
        <a-form-model-item label="Followee's Neuron Id" prop="neuronId">
          <a-input
            v-model="newFolloweeForm.neuronId"
            autocomplete="off"
            type="text"
            placeholder="Neuron Id"
          />
          <div
            v-show="
              SNSNeurons &&
              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1' ||
                SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT')
            "
            @click="setICLighthouseId"
            class="pointer ICLighthouse-id"
          >
            <button type="button">ICLighthouse</button>
          </div>
        </a-form-model-item>
        <a-form-model-item>
          <button
            type="button"
            class="w100 mt20 transfer-submit large-primary primary"
            @click="followNeuron"
          >
            Follow Neuron
          </button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { SNSNeuronsInfo } from '@/views/home/ICSNS/model';
import {
  Followees,
  GovernanceError,
  NervousSystemFunction,
  SNSNeuron,
  SNSNeuronId
} from '@/ic/SNSGovernance/model';
import { SNSGovernanceService } from '@/ic/SNSGovernance/SNSGovernanceService';
import { hexToBytes, toHexString } from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import { ICLighthouseCHATNeuronId, ICLighthouseNeuronId } from '@/ic/utils';
@Component({
  name: 'Following',
  components: {}
})
export default class extends Vue {
  private visible = false;
  private newFolloweeVisible = false;
  private activeKey = null;
  private activeKeyAdvanced = null;
  private newFolloweeForm = {
    neuronId: ''
  };
  private functionId: bigint = null;
  private newFolloweeFormRules = {
    neuronId: [
      { required: true, message: 'Please enter neuron id', trigger: 'change' }
    ]
  };
  private SNSNeurons: SNSNeuronsInfo = null;
  private neuron: SNSNeuron = null;
  private SNSIndex: number;
  private index: number;
  private followees: { [key: string]: Followees } = {};
  private functionsName: { [key: string]: string } = {};
  private sns1Id = ICLighthouseNeuronId;
  private chatId = ICLighthouseCHATNeuronId;
  private setICLighthouseId(): void {
    if (this.SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1') {
      this.newFolloweeForm.neuronId = ICLighthouseNeuronId;
    }
    if (this.SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT') {
      this.newFolloweeForm.neuronId = ICLighthouseCHATNeuronId;
    }
    (this.$refs.newFolloweeForm as any).validateField('neuronId');
  }
  private async init(
    SNSNeuronsList: Array<SNSNeuronsInfo>,
    SNSIndex: number,
    index: number
  ): Promise<void> {
    // todo list_known_neurons Functions
    this.SNSIndex = SNSIndex;
    this.index = index;
    this.SNSNeurons = SNSNeuronsList[SNSIndex];
    this.neuron = this.SNSNeurons.SNSNeurons[index];
    this.visible = true;
    if (!this.SNSNeurons.listNervousSystemFunctions) {
      await this.getListNervousSystemFunctions();
    } else {
      this.getFunctionsName();
    }
    this.followees = {};
    this.neuron.followees = this.neuron.followees.filter((follow) => {
      this.followees[follow[0].toString(10)] = follow[1];
      return this.functionsName[follow[0].toString(10)] && follow[1];
    });
    // this.$forceUpdate();
  }
  private async getListNervousSystemFunctions(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    try {
      const snsGovernanceService = new SNSGovernanceService();
      const listNervousSystemFunctions =
        await snsGovernanceService.listNervousSystemFunctions(
          this.SNSNeurons.SNSNeuronOfGovernanceId
        );
      this.SNSNeurons.listNervousSystemFunctions = listNervousSystemFunctions;
      this.$emit(
        'setListNervousSystemFunctions',
        listNervousSystemFunctions,
        this.SNSIndex
      );
      this.getFunctionsName();
    } catch (e) {
    }
    loading.close();
  }
  private getFunctionsName(): void {
    this.SNSNeurons.listNervousSystemFunctions.functions.forEach((item) => {
      if (item.id === BigInt(0)) {
        this.functionsName[item.id.toString(10)] = 'All topics';
      } else {
        if (item.name === 'Deegister Dapp Canisters') {
          this.functionsName[item.id.toString(10)] =
            'Deregister Dapp Canisters';
        } else {
          this.functionsName[item.id.toString(10)] = item.name;
        }
      }
    });
  }
  private getSystemName(systemFunction: NervousSystemFunction): string {
    if (systemFunction.id === BigInt(0)) {
      return 'All topics';
    }
    if (systemFunction.name === 'Deegister Dapp Canisters') {
      return 'Deregister Dapp Canisters';
    } else {
      return systemFunction.name;
    }
  }
  private onAddFollowee(systemFunction: NervousSystemFunction): void {
    this.functionId = systemFunction.id;
    this.newFolloweeVisible = true;
  }
  private deleteFollowee(
    systemFunction: NervousSystemFunction,
    index: number
  ): void {
    this.functionId = systemFunction.id;
    const followees = JSON.parse(
      JSON.stringify(this.followees[this.functionId.toString(10)].followees)
    );
    followees.splice(index, 1);
    this.setFollowees(followees, 'delete');
  }
  private async deleteAllFollowee(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const followeesValue: Array<bigint> = [];
      const MAX_COCURRENCY = 40;
      this.SNSNeurons.listNervousSystemFunctions.functions.forEach((item) => {
        const res = this.followees[item.id.toString(10)];
        if (res && res.followees) {
          followeesValue.push(item.id);
        }
      });
      let promiseValue = [];
      for (let i = 0; i < followeesValue.length; i++) {
        promiseValue.push(this.removeFollowees(followeesValue[i]));
        if (promiseValue.length === MAX_COCURRENCY) {
          await Promise.all(promiseValue);
          promiseValue = [];
        }
        if (i === followeesValue.length - 1 && promiseValue.length) {
          await Promise.all(promiseValue);
        }
      }
      this.$message.success('Success');
      this.$emit('followNeuronSuccess', this.SNSIndex, this.index);
    } catch (e) {
    }
    loading.close();
  }
  private async removeFollowees(functionId: bigint): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    try {
      await snsGovernanceService.setFollowees(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        functionId,
        []
      );
    } catch (e) {
    }
  }
  private followNeuron(): void {
    (this.$refs.newFolloweeForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          if (
            this.newFolloweeForm.neuronId.trim() ===
            this.arrayToString(this.neuron.id[0].id)
          ) {
            this.$message.error("You can't add the same neuron as followee.");
            return;
          }
          let followees: Array<SNSNeuronId> = [];
          if (
            this.followees[this.functionId.toString(10)] &&
            this.followees[this.functionId.toString(10)].followees &&
            this.followees[this.functionId.toString(10)].followees.length
          ) {
            followees = JSON.parse(
              JSON.stringify(
                this.followees[this.functionId.toString(10)].followees
              )
            );
          }
          const flag = followees.some((followee) => {
            return (
              this.newFolloweeForm.neuronId.trim() ===
              this.arrayToString(followee.id)
            );
          });
          if (flag) {
            this.$message.error('You are already following this neuron.');
            return;
          }
          const loading = this.$loading({
            lock: true,
            background: 'rgba(0, 0, 0, 0.5)'
          });
          await checkAuth();
          try {
            const snsGovernanceService = new SNSGovernanceService();
            const res = await snsGovernanceService.getNeuron(
              this.SNSNeurons.SNSNeuronOfGovernanceId,
              [
                {
                  id: Array.from(
                    hexToBytes(this.newFolloweeForm.neuronId.trim())
                  )
                }
              ]
            );
            loading.close();
            if (res.result) {
              const type = Object.keys(res.result[0])[0];
              if (type === 'Neuron') {
                followees.unshift({
                  id: Array.from(
                    hexToBytes(this.newFolloweeForm.neuronId.trim())
                  )
                });
                this.setFollowees(followees);
              } else {
                this.$message.error(
                  `Neuron with id ${this.newFolloweeForm.neuronId.trim()} does not exist.`
                );
              }
            }
          } catch (e) {
            loading.close();
          }
        }
      }
    );
  }
  private async setFollowees(
    followees: Array<SNSNeuronId>,
    followeesType?: string
  ): Promise<void> {
    const snsGovernanceService = new SNSGovernanceService();
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    try {
      const res = await snsGovernanceService.setFollowees(
        this.SNSNeurons.SNSNeuronOfGovernanceId,
        this.neuron.id[0].id,
        this.functionId,
        followees
      );
      if (res && res.command) {
        const type = Object.keys(res.command[0])[0];
        if (type === 'Error') {
          const err = Object.values(res.command[0])[0] as GovernanceError;
          this.$message.error(err.error_message);
        } else {
          if (followeesType) {
            this.$message.success('Success');
          } else {
            this.$message.success('Success');
            this.newFolloweeVisible = false;
          }
          this.$emit('followNeuronSuccess', this.SNSIndex, this.index);
        }
      } else {
        if (followeesType) {
          this.$message.error('Error');
        } else {
          this.$message.error('Follow Neuron Error');
        }
      }
    } catch (e) {
    }
    loading.close();
  }
  private afterClose(): void {
    this.functionId = null;
    (this.$refs.newFolloweeForm as any).resetFields();
  }
  private afterCloseFollow(): void {
    this.activeKey = null;
    this.activeKeyAdvanced = null;
  }
  private arrayToString(val: Array<number>): string {
    return toHexString(new Uint8Array(val));
  }
  private onCopy(): void {
    this.$message.success('Copied');
  }
  private onError(): void {
  }
}
</script>
<style scoped lang="scss">
.add-remove-title {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 16px;
  color: #fff;
  button {
    width: auto;
  }
}
.follow-Neuron-list {
  padding: 20px 0;
  .follow-Neuron-list-title {
    margin-bottom: 10px;
    font-size: 16px;
    color: #fff;
  }
  .follow-Neuron-list-item {
    padding: 10px 0;
    border-top: 1px solid #212b35;
    &:last-child {
      border-bottom: 1px solid #212b35;
    }
    .follow-Neuron-list-item-name {
      color: #fff;
    }
    .follow-Neuron-list-item-ids {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .follow-Neuron-list-item-id {
      display: inline-block;
      margin: 5px 5px 0 0;
      padding: 2px 8px;
      border: 1px solid #212b35;
      border-radius: 30px;
      color: #adb3c4;
    }
  }
}
.follow-Neuron-button {
  padding-bottom: 20px;
}
.system-name {
  font-size: 18px;
  color: #fff;
}
.system-description {
  color: #777d90;
  padding-right: 15px;
}
.follow-collapse-panel-header {
  display: flex;
  align-items: center;
}
.follow-number {
  margin-left: auto;
  font-size: 16px;
  color: #fff;
}
.follow-collapse-panel-main {
  background: #212b35;
  border: none;
  .follow-collapse-panel-item {
    border-color: #212b35;
  }
  ::v-deep .ant-collapse-arrow {
    color: #fff !important;
  }
  ::v-deep .ant-collapse-content {
    background: #212b35;
    border: none;
    color: #adb3c4;
  }
  .add-followee-button {
    button {
      height: 40px;
      margin: 0 auto;
    }
  }
  .followees-main {
    margin-top: 10px;
  }
  .followees-item {
    display: flex;
    align-items: center;
  }
}
.follow-neurons-modal {
  ::v-deep .ant-modal-content {
    min-height: 400px;
  }
  ::v-deep .ant-collapse > .ant-collapse-item {
    border: 0;
  }
}
.ICLighthouse-id {
  padding: 5px 0;
  font-size: 16px;
  button {
    background: #1a2a33;
    color: #52b7c3;
  }
}
</style>

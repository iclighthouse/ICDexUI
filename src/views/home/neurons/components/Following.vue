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
                    <span class="follow-Neuron-list-item-id">
                      <span v-show="knownNeuron[followee.id.toString()]">
                        {{ knownNeuron[followee.id.toString()] }}
                      </span>
                      <span v-show="!knownNeuron[followee.id.toString()]">
                        {{ followee.id.toString() | ellipsisAccount(6) }}
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div v-else>No followees</div>
        </div>
        <p class="add-remove-title">
          Add/Remove followees
          <!--<button
            v-if="neuron && neuron.followees && neuron.followees.length"
            class="margin-left-auto primary"
            type="button"
            @click="deleteAllFollowee"
          >
            Remove All
          </button>-->
        </p>
        <a-collapse
          expand-icon-position="right"
          class="follow-collapse-panel-main"
          v-model="activeKey"
        >
          <a-collapse-panel
            v-for="topic in topicInfo.slice(1, 3)"
            :key="topic.id.toString()"
            class="follow-collapse-panel-item"
          >
            <div slot="header">
              <div class="follow-collapse-panel-header">
                <div>
                  <p class="system-name">{{ topic.info.title }}</p>
                  <div class="system-description">
                    {{ topic.info.subtitle }}
                  </div>
                </div>
                <span class="follow-number">
                  {{
                    followees[topic.id] && followees[topic.id].followees.length
                      ? followees[topic.id].followees.length
                      : 0
                  }}
                </span>
              </div>
            </div>
            <div>
              <p>Currently Following</p>
              <ul
                v-if="
                  followees[topic.id] && followees[topic.id].followees.length
                "
                class="followees-main"
              >
                <li
                  v-for="(followee, index) in followees[topic.id].followees"
                  :key="index"
                  class="followees-item"
                >
                  <span v-show="knownNeuron[followee.id.toString()]">
                    {{ knownNeuron[followee.id.toString()] }}
                  </span>
                  <span v-show="!knownNeuron[followee.id.toString()]">
                    {{ followee.id.toString() | ellipsisAccount(6) }}
                  </span>
                  <span class="margin-left-auto">
                    <a-icon
                      @click="deleteFollowee(topic.id, followee.id)"
                      type="close"
                    />
                  </span>
                </li>
              </ul>
              <div class="add-followee-button mt20">
                <button
                  type="button"
                  class="primary"
                  @click="onAddFollowee(topic.id)"
                >
                  Add Followee
                </button>
              </div>
            </div>
          </a-collapse-panel>
        </a-collapse>
        <a-collapse
          expand-icon-position="right"
          class="follow-collapse-panel-main mt20"
          v-model="showAdvanced"
        >
          <a-collapse-panel
            v-for="topic in topicInfo.slice(0, 1)"
            :key="topic.id.toString()"
            class="follow-collapse-panel-item"
          >
            <div slot="header">
              <div class="follow-collapse-panel-header">
                <div>
                  <p class="system-name">{{ topic.info.title }}</p>
                  <div class="system-description">
                    {{ topic.info.subtitle }}
                  </div>
                </div>
                <span class="follow-number">
                  {{
                    followees[topic.id] && followees[topic.id].followees.length
                      ? followees[topic.id].followees.length
                      : 0
                  }}
                </span>
              </div>
            </div>
            <div class="follow-collapse-panel-main-advanced-currently">
              <p>Currently Following</p>
              <ul
                v-if="
                  followees[topic.id] && followees[topic.id].followees.length
                "
                class="followees-main"
              >
                <li
                  v-for="(followee, index) in followees[topic.id].followees"
                  :key="index"
                  class="followees-item"
                >
                  <span v-show="knownNeuron[followee.id.toString()]">
                    {{ knownNeuron[followee.id.toString()] }}
                  </span>
                  <span v-show="!knownNeuron[followee.id.toString()]">
                    {{ followee.id.toString() | ellipsisAccount(6) }}
                  </span>
                  <span class="margin-left-auto">
                    <a-icon
                      @click="deleteFollowee(topic.id, followee.id)"
                      type="close"
                    />
                  </span>
                </li>
              </ul>
              <div class="add-followee-button mt20">
                <button
                  type="button"
                  class="primary"
                  @click="onAddFollowee(topic.id)"
                >
                  Add Followee
                </button>
              </div>
            </div>
          </a-collapse-panel>
          <a-collapse-panel
            class="
              follow-collapse-panel-item follow-collapse-panel-main-advanced
            "
          >
            <div slot="header" class="base-color-w">Advanced</div>
            <a-collapse
              expand-icon-position="right"
              class="follow-collapse-panel-main"
              v-model="activeKeyAdvanced"
            >
              <a-collapse-panel
                v-for="topic in topicInfo.slice(3)"
                :key="topic.id.toString()"
                class="follow-collapse-panel-item"
              >
                <div slot="header">
                  <div class="follow-collapse-panel-header">
                    <div>
                      <p class="system-name">{{ topic.info.title }}</p>
                      <div class="system-description">
                        {{ topic.info.subtitle }}
                      </div>
                    </div>
                    <span class="follow-number">
                      {{
                        followees[topic.id] &&
                        followees[topic.id].followees.length
                          ? followees[topic.id].followees.length
                          : 0
                      }}
                    </span>
                  </div>
                </div>
                <div class="follow-collapse-panel-main-advanced-currently">
                  <p>Currently Following</p>
                  <ul
                    v-if="
                      followees[topic.id] &&
                      followees[topic.id].followees.length
                    "
                    class="followees-main"
                  >
                    <li
                      v-for="(followee, index) in followees[topic.id].followees"
                      :key="index"
                      class="followees-item"
                    >
                      <span v-show="knownNeuron[followee.id.toString()]">
                        {{ knownNeuron[followee.id.toString()] }}
                      </span>
                      <span v-show="!knownNeuron[followee.id.toString()]">
                        {{ followee.id.toString() | ellipsisAccount(6) }}
                      </span>
                      <span class="margin-left-auto">
                        <a-icon
                          @click="deleteFollowee(topic.id, followee.id)"
                          type="close"
                        />
                      </span>
                    </li>
                  </ul>
                  <div class="add-followee-button mt20">
                    <button
                      type="button"
                      class="primary"
                      @click="onAddFollowee(topic.id)"
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
          <!--<div
            v-show="
              SNSNeurons &&
              (SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'SNS1' ||
                SNSNeurons.SNSNeuronOfSNSTokenInfo.symbol === 'CHAT')
            "
            @click="setICLighthouseId"
            class="pointer ICLighthouse-id"
          >
            <button type="button">ICLighthouse</button>
          </div>-->
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
      <div
        v-if="listKnownNeurons && listKnownNeurons.known_neurons"
        class="know-neurons-main"
      >
        <div class="base-font-title">Options for Following</div>
        <ul>
          <li
            v-for="(item, index) in listKnownNeurons.known_neurons"
            :key="index"
          >
            <span>{{ item.known_neuron_data[0].name }}</span>
            <button
              class="margin-left-auto"
              v-if="currentFollowees.indexOf(item.id[0].id.toString()) >= 0"
              type="button"
              @click="deleteFollowee(functionId, item.id[0].id)"
            >
              Unfollow
            </button>
            <button
              class="margin-left-auto"
              v-else
              type="button"
              @click="addFolloweeOnOptions(functionId, item.id[0].id)"
            >
              Follow
            </button>
          </li>
        </ul>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { toHexString } from '@/ic/converter';
import { checkAuth } from '@/ic/CheckAuth';
import {
  Followees,
  ListKnownNeuronsResponse,
  Neuron,
  NeuronId
} from '@/ic/governance/model';
import { FunctionsName, TopicInfo } from '@/views/home/neurons/model';
import { GovernanceService } from '@/ic/governance/governanceService';
@Component({
  name: 'Following',
  components: {}
})
export default class extends Vue {
  private visible = false;
  private newFolloweeVisible = false;
  private topicInfo = TopicInfo;
  private activeKey = null;
  private activeKeyAdvanced = null;
  private showAdvanced = null;
  private governanceService: GovernanceService = null;
  private newFolloweeForm = {
    neuronId: ''
  };
  private functionId: number = null;
  private newFolloweeFormRules = {
    neuronId: [
      { required: true, message: 'Please enter neuron id', trigger: 'change' }
    ]
  };
  private neuronsList: Array<Neuron> = [];
  private neuron: Neuron = null;
  private index: number;
  private followees: { [key: string]: Followees } = {};
  private currentFollowees: Array<string> = [];
  private functionsName = FunctionsName;
  private listKnownNeurons: ListKnownNeuronsResponse = null;
  get knownNeuron(): { [key: string]: string } {
    const res = {};
    if (this.listKnownNeurons) {
      this.listKnownNeurons.known_neurons.forEach((item) => {
        res[item.id[0].id.toString()] = item.known_neuron_data[0].name;
      });
    }
    return res;
  }
  private async init(
    neuronsList: Array<Neuron>,
    index: number,
    listKnownNeurons: ListKnownNeuronsResponse
  ): Promise<void> {
    this.governanceService = new GovernanceService();
    this.index = index;
    this.neuronsList = neuronsList;
    this.listKnownNeurons = listKnownNeurons;
    this.neuron = this.neuronsList[index];
    this.visible = true;
    this.followees = {};
    this.neuron.followees = this.neuron.followees.filter((follow) => {
      this.followees[follow[0].toString(10)] = follow[1];
      return this.functionsName[follow[0].toString(10)] && follow[1];
    });
    // this.$forceUpdate();
  }
  private addFolloweeOnOptions(topicId: number, neuronId: bigint): void {
    this.functionId = topicId;
    const followees = this.getFollowees();
    followees.push({ id: neuronId });
    this.setFollowees(followees, 'add');
  }
  private onAddFollowee(topicId: number): void {
    this.functionId = topicId;
    this.newFolloweeVisible = true;
    this.currentFollowees = [];
    if (this.followees[topicId.toString()]) {
      this.followees[topicId.toString()].followees.forEach((item) => {
        this.currentFollowees.push(item.id.toString());
      });
    }
  }
  private getFollowees(): Array<NeuronId> {
    let followees: Array<NeuronId> = [];
    if (
      this.followees[this.functionId.toString(10)] &&
      this.followees[this.functionId.toString(10)].followees &&
      this.followees[this.functionId.toString(10)].followees.length
    ) {
      followees = JSON.parse(
        JSON.stringify(
          this.followees[this.functionId.toString(10)].followees,
          (key, value) =>
            typeof value === 'bigint' ? value.toString(10) : value
        ),
        (key, value) => (typeof value === 'string' ? BigInt(value) : value)
      );
    }
    return followees;
  }
  private deleteFollowee(topicId: number, neuronId: bigint): void {
    this.functionId = topicId;
    const followees = this.getFollowees();
    let currentIndex = null;
    this.followees[topicId.toString()].followees.some(
      (item, followeesIndex) => {
        if (Number(item.id) === Number(neuronId)) {
          currentIndex = followeesIndex;
          return true;
        }
      }
    );
    followees.splice(currentIndex, 1);
    this.setFollowees(followees, 'delete');
  }
  private async deleteAllFollowee(): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    loading.close();
  }
  private async removeFollowees(functionId: bigint): Promise<void> {
    try {
      //
    } catch (e) {
    }
  }
  private followNeuron(): void {
    (this.$refs.newFolloweeForm as Vue & { validate: any }).validate(
      async (valid: any) => {
        if (valid) {
          if (
            this.newFolloweeForm.neuronId.trim() ===
            this.neuron.id[0].id.toString()
          ) {
            this.$message.error("You can't add the same neuron as followee.");
            return;
          }
          let followees: Array<NeuronId> = [];
          if (
            this.followees[this.functionId.toString(10)] &&
            this.followees[this.functionId.toString(10)].followees &&
            this.followees[this.functionId.toString(10)].followees.length
          ) {
            followees = this.getFollowees();
          }
          const flag = followees.some((followee) => {
            return (
              this.newFolloweeForm.neuronId.trim() === followee.id.toString()
            );
          });
          if (flag) {
            this.$message.error('You are already following this neuron.');
            return;
          }
          followees.push({ id: BigInt(this.newFolloweeForm.neuronId.trim()) });
          this.setFollowees(followees, 'add');
        }
      }
    );
  }
  private async setFollowees(
    followees: Array<NeuronId>,
    followeesType?: string
  ): Promise<void> {
    const loading = this.$loading({
      lock: true,
      background: 'rgba(0, 0, 0, 0.5)'
    });
    await checkAuth();
    const res = await this.governanceService.setFollow(
      this.neuron.id[0].id,
      BigInt(this.functionId),
      followees
    );
    if (res && res.command) {
      const type = Object.keys(res.command[0])[0];
      if (type === 'Error') {
        this.$message.error('Error');
      } else {
        this.$message.success('Success');
        this.$emit('followNeuronSuccess', this.neuron.id[0].id);
        if (followeesType) {
          this.newFolloweeVisible = false;
        }
      }
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
    this.showAdvanced = null;
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
.know-neurons-main {
  margin-top: 40px;
  li {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
}
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
}
.ICLighthouse-id {
  padding: 5px 0;
  font-size: 16px;
  button {
    background: #1a2a33;
    color: #52b7c3;
  }
}
@media screen and (max-width: 768px) {
  .know-neurons-main {
    button {
      width: 80px;
      flex-shrink: 0;
    }
  }
}
</style>
